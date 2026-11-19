import type { Meta, StoryObj } from "@storybook/react-vite";
import ToolLoadingFallback from "@editor/components/tools/ToolLoadingFallback";

const meta: Meta<typeof ToolLoadingFallback> = {
  title: "Tool Parts/ToolLoadingFallback",
  component: ToolLoadingFallback,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithToolName: Story = {
  args: {
    toolName: "Merge PDF",
  },
};
