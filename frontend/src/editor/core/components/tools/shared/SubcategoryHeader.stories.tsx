import type { Meta, StoryObj } from "@storybook/react-vite";
import SubcategoryHeader from "@editor/components/tools/shared/SubcategoryHeader";

const meta = {
  title: "Tool Parts/Shared/SubcategoryHeader",
  component: SubcategoryHeader,
} satisfies Meta<typeof SubcategoryHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Page organization",
  },
};

export const CustomSpacing: Story = {
  args: {
    label: "Security",
    mt: "2rem",
    mb: "1rem",
  },
};
