import type { StoryObj } from "@storybook/react-vite";
import { toolPanelMeta } from "@editor/components/tools/toolPanelStory/toolPanelMeta";
import { openTooltip } from "@editor/components/tools/toolPanelStory/toolPanelStoryPlay";

const meta = {
  title: "Tool Panels/Replace & Invert Color",
  ...toolPanelMeta("replaceColor"),
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Panel: Story = {};

export const CustomColors: Story = {
  args: {
    parameters: {
      replaceAndInvertOption: "CUSTOM_COLOR",
      textColor: "#1f3a93",
      backGroundColor: "#fff8e1",
    },
  },
};

export const InvertAllColours: Story = {
  args: { parameters: { replaceAndInvertOption: "FULL_INVERSION" } },
};

export const SettingsTooltip: Story = {
  play: openTooltip({ step: "Settings" }),
};
