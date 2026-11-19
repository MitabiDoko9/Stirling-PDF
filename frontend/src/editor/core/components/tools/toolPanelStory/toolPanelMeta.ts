import type { Meta } from "@storybook/react-vite";
import { http, HttpResponse, type RequestHandler } from "msw";
import {
  ToolPanelStory,
  type ToolPanelStoryProps,
} from "@editor/components/tools/toolPanelStory/ToolPanelStory";
import { waitForToolPanel } from "@editor/components/tools/toolPanelStory/toolPanelStoryPlay";
import type { ToolId } from "@editor/types/toolId";

/**
 * A server that has every tool endpoint on. Without an answer the panel holds
 * its settings disabled while it waits, so a capture would show greyed
 * controls and a click would be dropped.
 */
const ENDPOINTS_ENABLED = [
  http.get("*/api/v1/config/endpoint-enabled", () => HttpResponse.json(true)),
  http.get("*/api/v1/config/endpoints-availability", () =>
    HttpResponse.json({}),
  ),
];

/**
 * A story's `parameters` for the server responses its panel reads. Pass every
 * response the story needs here rather than as a raw `msw.handlers` array: a
 * story's array replaces the meta's, and these are listed ahead of the
 * defaults so they win over them.
 */
export function toolPanelServer(...handlers: RequestHandler[]) {
  return { msw: { handlers: [...handlers, ...ENDPOINTS_ENABLED] } };
}

/**
 * A server that reports `endpoint` unavailable for a missing dependency and
 * every other endpoint on. Spread into toolPanelServer.
 */
export function endpointUnavailable(endpoint: string): RequestHandler[] {
  return [
    http.get("*/api/v1/config/endpoint-enabled", ({ request }) =>
      HttpResponse.json(
        new URL(request.url).searchParams.get("endpoint") !== endpoint,
      ),
    ),
    http.get("*/api/v1/config/endpoints-availability", () =>
      HttpResponse.json({
        [endpoint]: { enabled: false, reason: "DEPENDENCY" },
      }),
    ),
  ];
}

/**
 * The server's app-config with `flags` on, for settings a server flag reveals.
 * Keeps the AI engine on, as the default Storybook server has it.
 */
export function appConfig(flags: Readonly<Record<string, unknown>>) {
  return http.get("*/api/v1/config/app-config", () =>
    HttpResponse.json({ aiEngineEnabled: true, ...flags }),
  );
}

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
    parameters: { layout: "fullscreen", ...toolPanelServer() },
    args: { toolId, ...args },
    play: async (context) => {
      await waitForToolPanel(context);
    },
  } satisfies Meta<typeof ToolPanelStory>;
}
