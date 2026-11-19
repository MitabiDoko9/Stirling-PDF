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
import { loadFixture } from "@editor/components/tools/toolPanelStory/fixtures";
import { PAGE_POINTER_LAYER_CLASS } from "@editor/components/viewer/ViewerPointerProviders";

const meta = {
  title: "Tool Panels/Add image",
  ...toolPanelMeta("addImage"),
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Panel: Story = {};

async function uploadImage(context: PlayContext): Promise<void> {
  const panelElement = await waitForToolPanel(context);
  const panel = within(panelElement);
  const picker = await panel.findByRole("button", {
    name: "Select image file",
  });
  await waitFor(() => expect(picker).toBeEnabled(), STAGE_TIMEOUT);
  await userEvent.upload(
    panelElement.querySelector<HTMLInputElement>('input[type="file"]')!,
    await loadFixture("sample.png"),
  );
  await panel.findByRole("img", { name: "Current image signature" });
  await waitFor(() =>
    expect(
      panel.getByRole("checkbox", {
        name: "Remove white background (make transparent)",
      }),
    ).toBeEnabled(),
  );
}

export const ImageUploaded: Story = {
  play: uploadImage,
};

export const MobileUpload: Story = {
  parameters: toolPanelServer(appConfig({ enableMobileSignature: true })),
  play: untilPanelShows("Mobile upload"),
};

export const ConfigureImageTooltip: Story = {
  play: openTooltip({ step: "Configure Image" }),
};

export const PlaceImageTooltip: Story = {
  play: openTooltip({ info: "Click on the PDF to add your image" }),
};

export const ResumePlacementTooltip: Story = {
  play: openTooltip({ info: "Resume placement" }, { after: uploadImage }),
};

const onViewer = { showWorkbench: true, workbench: "viewer" } as const;

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
  await uploadImage(context);
  const panel = within(await waitForToolPanel(context));
  const resume = panel.queryByRole("button", { name: "Resume placement" });
  if (resume) {
    await waitFor(() => expect(resume).toBeEnabled(), STAGE_TIMEOUT);
    await userEvent.click(resume);
  }
  await panel.findByRole("button", { name: "Pause placement" }, STAGE_TIMEOUT);
  return panel;
}

async function placeImage(context: PlayContext): Promise<PanelQueries> {
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
  const panel = await placeImage(context);
  await userEvent.click(panel.getByRole("button", { name: "Undo" }));
  await waitFor(
    () => expect(panel.getByRole("button", { name: "Redo" })).toBeEnabled(),
    STAGE_TIMEOUT,
  );
}

export const PausePlacementTooltip: Story = {
  args: onViewer,
  play: openTooltip({ info: "Pause placement" }, { after: armPlacement }),
};

export const UndoTooltip: Story = {
  args: onViewer,
  play: openTooltip({ info: "Undo" }, { after: placeImage }),
};

export const RedoTooltip: Story = {
  args: onViewer,
  play: openTooltip({ info: "Redo" }, { after: placeAndUndo }),
};
