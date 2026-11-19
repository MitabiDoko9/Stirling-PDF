import type { StoryObj } from "@storybook/react-vite";
import { toolPanelMeta } from "@editor/components/tools/toolPanelStory/toolPanelMeta";
import { openTooltip } from "@editor/components/tools/toolPanelStory/toolPanelStoryPlay";

const meta = {
  title: "Tool Panels/Certificate Sign",
  ...toolPanelMeta("certSign"),
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Panel: Story = {};

export const Pkcs12Uploaded: Story = {
  args: {
    parameters: { certType: "PKCS12", showSignature: true, showLogo: true },
    parameterFiles: { p12File: "valid-test.p12" },
  },
};

export const CertificateTooltip: Story = {
  play: openTooltip({ step: "Certificate" }),
};
