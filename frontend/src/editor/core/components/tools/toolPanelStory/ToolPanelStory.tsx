import { useEffect, useRef, useState, type ReactNode } from "react";
import { PlatformProviders } from "@editor/components/PlatformProviders";
import { AppProviders } from "@editor/components/AppProviders";
import RightSidebar from "@editor/components/tools/RightSidebar";
import { useFileHandler } from "@editor/hooks/useFileHandler";
import { useToolWorkflowActions } from "@editor/contexts/ToolWorkflowContext";
import {
  ToolPanelPreviewProvider,
  type ToolPanelPreview,
} from "@editor/contexts/ToolPanelPreviewContext";
import {
  loadFixture,
  type FixtureName,
} from "@editor/components/tools/toolPanelStory/fixtures";
import type { ToolId } from "@editor/types/toolId";

export interface ToolPanelStoryProps {
  toolId: ToolId;
  /** Loaded and selected in this order before the tool opens. */
  files?: readonly FixtureName[];
  /** Merged over the tool's default parameters, for settings that need input to appear. */
  parameters?: Readonly<Record<string, unknown>>;
  /** File-typed parameters (a certificate, a stamp image), loaded from fixtures. */
  parameterFiles?: Readonly<Record<string, FixtureName>>;
  /** Opens steps the tool would keep collapsed until a file or choice exists. */
  expandAllSteps?: boolean;
}

/**
 * The editor's real tool panel for one tool, inside the editor's own provider
 * stack (PlatformProviders, then AppProviders): the same RightSidebar, header and
 * createToolFlow steps the editor draws. Only the inputs are staged: fixture files
 * go in through FileContext, the tool opens through the workflow, and
 * ToolPanelPreview opens what would otherwise wait on input.
 */
export function ToolPanelStory(props: ToolPanelStoryProps) {
  return (
    <PlatformProviders>
      <AppProviders>
        <StagedTool {...props}>
          <PanelFrame />
        </StagedTool>
      </AppProviders>
    </PlatformProviders>
  );
}

/**
 * The editor's row of workbench and tool panel, grown to the panel's full
 * content height so a capture shows every setting rather than a scrolled window.
 * The panel's stage is absolutely positioned, so its height is read, not inherited.
 */
function PanelFrame() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const stage =
      frameRef.current?.querySelector<HTMLElement>(".tool-panel__stage");
    if (!stage) return;
    const measure = () =>
      setHeight(stage.getBoundingClientRect().top + stage.scrollHeight);
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    for (const child of stage.querySelectorAll("*")) observer.observe(child);
    measure();
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      style={{
        display: "flex",
        height: height ? `max(100vh, ${height}px)` : "100vh",
        background: "var(--c-bg)",
      }}
    >
      {/* The workbench's slot: sidebar tooltips open into it, as in the editor. */}
      <div style={{ flex: 1 }} />
      <RightSidebar />
    </div>
  );
}

function StagedTool({
  toolId,
  files = ["sample.pdf"],
  parameters,
  parameterFiles,
  expandAllSteps = true,
  children,
}: ToolPanelStoryProps & { children: ReactNode }) {
  const { addFiles } = useFileHandler();
  const { handleToolSelectForced } = useToolWorkflowActions();
  const [preview, setPreview] = useState<ToolPanelPreview | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [documents, fileParameters] = await Promise.all([
        Promise.all(files.map(loadFixture)),
        loadParameterFiles(parameterFiles),
      ]);
      if (cancelled) return;
      if (documents.length > 0) await addFiles(documents);
      if (cancelled) return;
      // In place before the tool mounts: parameter hooks read it only for their
      // initial state.
      setPreview({
        expandAllSteps,
        parameters:
          parameters || parameterFiles
            ? { ...parameters, ...fileParameters }
            : undefined,
      });
      handleToolSelectForced(toolId);
    })();
    return () => {
      cancelled = true;
    };
    // Stage once per mount; Storybook remounts the story when its args change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!preview) return null;
  return (
    <ToolPanelPreviewProvider value={preview}>
      {children}
    </ToolPanelPreviewProvider>
  );
}

async function loadParameterFiles(
  parameterFiles: ToolPanelStoryProps["parameterFiles"],
): Promise<Record<string, File>> {
  if (!parameterFiles) return {};
  const entries = await Promise.all(
    Object.entries(parameterFiles).map(
      async ([key, name]) => [key, await loadFixture(name)] as const,
    ),
  );
  return Object.fromEntries(entries);
}
