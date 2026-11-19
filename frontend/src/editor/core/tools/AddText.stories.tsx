import type { StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  appConfig,
  toolPanelMeta,
  toolPanelServer,
} from "@editor/components/tools/toolPanelStory/toolPanelMeta";
import {
  openTooltip,
  type PanelQueries,
  type PlayContext,
  STAGE_TIMEOUT,
  untilPanelShows,
  waitForToolPanel,
} from "@editor/components/tools/toolPanelStory/toolPanelStoryPlay";
import { PAGE_POINTER_LAYER_CLASS } from "@editor/components/viewer/ViewerPointerProviders";

const meta = {
  title: "Tool Panels/Add Text",
  ...toolPanelMeta("addText"),
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Panel: Story = {};

const textEntered = { parameters: { signerName: "Approved by J. Doe" } };
const textOnViewer = {
  ...textEntered,
  showWorkbench: true,
  workbench: "viewer",
} as const;

export const TextEntered: Story = {
  args: textEntered,
};

export const MobileUpload: Story = {
  parameters: toolPanelServer(appConfig({ enableMobileSignature: true })),
  play: untilPanelShows("Mobile upload"),
};

export const ConfigureTextTooltip: Story = {
  play: openTooltip({ step: "Configure Text" }),
};

export const PlaceTextTooltip: Story = {
  play: openTooltip({ info: "Click on the PDF to add your text" }),
};

export const ResumePlacementTooltip: Story = {
  args: textEntered,
  play: openTooltip({ info: "Resume placement" }),
};

function findPageLayer(context: PlayContext): Promise<HTMLElement> {
  return waitFor(() => {
    const layer =
      context.canvasElement.ownerDocument.querySelector<HTMLElement>(
        `.${PAGE_POINTER_LAYER_CLASS}`,
      );
    expect(layer).not.toBeNull();
    return layer!;
  }, STAGE_TIMEOUT);
}

// The panel's placement toggle drives the viewer's signature tools, which exist
// only once the viewer has drawn a page; a Resume click before that is dropped.
async function armPlacement(context: PlayContext): Promise<PanelQueries> {
  await findPageLayer(context);
  const panel = within(await waitForToolPanel(context));
  const resume = panel.queryByRole("button", { name: "Resume placement" });
  if (resume) {
    await waitFor(() => expect(resume).toBeEnabled(), STAGE_TIMEOUT);
    await userEvent.click(resume);
  }
  await panel.findByRole("button", { name: "Pause placement" }, STAGE_TIMEOUT);
  return panel;
}

async function placeText(context: PlayContext): Promise<PanelQueries> {
  const panel = await armPlacement(context);
  const layer = await findPageLayer(context);
  const box = layer.getBoundingClientRect();
  await userEvent.pointer({
    keys: "[MouseLeft]",
    target: layer,
    coords: {
      clientX: box.left + box.width / 2,
      clientY: box.top + box.height / 3,
    },
  });
  await waitFor(
    () => expect(panel.getByRole("button", { name: "Undo" })).toBeEnabled(),
    STAGE_TIMEOUT,
  );
  return panel;
}

async function placeAndUndo(context: PlayContext): Promise<void> {
  const panel = await placeText(context);
  await userEvent.click(panel.getByRole("button", { name: "Undo" }));
  await waitFor(
    () => expect(panel.getByRole("button", { name: "Redo" })).toBeEnabled(),
    STAGE_TIMEOUT,
  );
}

export const PausePlacementTooltip: Story = {
  args: textOnViewer,
  play: openTooltip({ info: "Pause placement" }, { after: armPlacement }),
};

export const UndoTooltip: Story = {
  args: textOnViewer,
  play: openTooltip({ info: "Undo" }, { after: placeText }),
};

export const RedoTooltip: Story = {
  args: textOnViewer,
  play: openTooltip({ info: "Redo" }, { after: placeAndUndo }),
};
