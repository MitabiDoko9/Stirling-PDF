import type { StoryObj } from "@storybook/react-vite";
import { toolPanelMeta } from "@editor/components/tools/toolPanelStory/toolPanelMeta";

const meta = {
  title: "Tool Panels/PDF to Single Large Page",
  ...toolPanelMeta("pdfToSinglePage"),
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Panel: Story = {};
