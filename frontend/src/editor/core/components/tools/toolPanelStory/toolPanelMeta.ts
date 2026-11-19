import type { Meta } from "@storybook/react-vite";
import {
  ToolPanelStory,
  type ToolPanelStoryProps,
} from "@editor/components/tools/toolPanelStory/ToolPanelStory";
import { waitForToolPanel } from "@editor/components/tools/toolPanelStory/toolPanelStoryPlay";
import type { ToolId } from "@editor/types/toolId";

/**
 * The shared Storybook meta for one tool's panel stories. Spread it beside a
 * literal `title: "Tool Panels/<Tool name>"`: Storybook reads the title
 * statically and falls back to the file path for a computed one. Every story
 * waits for the panel to finish staging before it is scanned or captured; a
 * story with its own play (a tooltip) does that wait itself.
 */
export function toolPanelMeta(
  toolId: ToolId,
  args?: Omit<ToolPanelStoryProps, "toolId">,
) {
  return {
    component: ToolPanelStory,
    parameters: { layout: "fullscreen" },
    args: { toolId, ...args },
    play: waitForToolPanel,
  } satisfies Meta<typeof ToolPanelStory>;
}
