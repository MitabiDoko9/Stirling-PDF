import type { StoryObj } from "@storybook/react-vite";
import { http, HttpResponse } from "msw";
import { expect, waitFor, within } from "storybook/test";
import {
  toolPanelMeta,
  toolPanelServer,
} from "@editor/components/tools/toolPanelStory/toolPanelMeta";
import {
  openTooltip,
  waitForToolPanel,
} from "@editor/components/tools/toolPanelStory/toolPanelStoryPlay";

const meta = {
  title: "Tool Panels/Compress",
  ...toolPanelMeta("compress"),
};
export default meta;

type Story = StoryObj<typeof meta>;

function imageMagickEnabled(enabled: boolean) {
  return toolPanelServer(
    http.get("*/api/v1/config/group-enabled", ({ request }) =>
      new URL(request.url).searchParams.get("group") === "ImageMagick"
        ? HttpResponse.json(enabled)
        : undefined,
    ),
  );
}

export const Panel: Story = {
  parameters: imageMagickEnabled(true),
};

export const FileSize: Story = {
  args: { parameters: { compressionMethod: "filesize" } },
  parameters: imageMagickEnabled(true),
};

export const LineArt: Story = {
  args: { parameters: { lineArt: true } },
  parameters: imageMagickEnabled(true),
};

export const LineArtUnavailable: Story = {
  args: { parameters: { lineArt: true } },
  parameters: imageMagickEnabled(false),
};

export const SettingsTooltip: Story = {
  parameters: imageMagickEnabled(true),
  play: openTooltip({ step: "Settings" }),
};

export const LineArtTooltip: Story = {
  parameters: imageMagickEnabled(true),
  play: openTooltip({ info: /Uses ImageMagick/ }),
};

export const LineArtUnavailableTooltip: Story = {
  parameters: imageMagickEnabled(false),
  play: openTooltip({
    element: async (context) => {
      const panel = within(await waitForToolPanel(context));
      const checkbox = await panel.findByRole("checkbox", {
        name: "Convert images to line art",
      });
      await waitFor(() => expect(checkbox).toBeDisabled());
      return checkbox.closest<HTMLElement>(".mantine-Checkbox-root")!
        .parentElement!;
    },
  }),
};

export const FileSizeRequiredTooltip: Story = {
  args: { parameters: { compressionMethod: "filesize" } },
  parameters: imageMagickEnabled(true),
  play: openTooltip({ runButton: true }),
};
