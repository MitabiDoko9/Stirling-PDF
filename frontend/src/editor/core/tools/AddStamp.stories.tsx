import type { StoryObj } from "@storybook/react-vite";
import { toolPanelMeta } from "@editor/components/tools/toolPanelStory/toolPanelMeta";
import { openTooltip } from "@editor/components/tools/toolPanelStory/toolPanelStoryPlay";

const meta = {
  title: "Tool Panels/Add Stamp",
  ...toolPanelMeta("addStamp"),
};
export default meta;

type Story = StoryObj<typeof meta>;

export const TextStamp: Story = {};

export const ImageStamp: Story = {
  args: {
    parameters: { stampType: "image" },
    parameterFiles: { stampImage: "sample.png" },
  },
};

export const DynamicVariablesTooltip: Story = {
  play: openTooltip({ info: "Dynamic Variables" }),
};
