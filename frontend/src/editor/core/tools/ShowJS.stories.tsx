import type { StoryObj } from "@storybook/react-vite";
import { toolPanelMeta } from "@editor/components/tools/toolPanelStory/toolPanelMeta";

const meta = {
  title: "Tool Panels/Show Javascript",
  ...toolPanelMeta("showJS"),
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Panel: Story = {};
