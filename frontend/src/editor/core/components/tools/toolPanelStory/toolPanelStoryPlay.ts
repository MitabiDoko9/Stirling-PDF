import { expect, userEvent, waitFor, within } from "storybook/test";

/** A step's tooltip opens from its title; a field's from its (i), named by its text. */
export type TooltipTrigger = { step: string } | { info: string | RegExp };

interface PlayContext {
  canvasElement: HTMLElement;
}

const PANEL = '[data-sidebar="tool-panel"]';
const STAGE_TIMEOUT = { timeout: 20000 };

/**
 * Resolves once the staged tool has drawn its steps, so the a11y scan and any
 * capture see the finished panel rather than the frame before files load.
 */
export async function waitForToolPanel({
  canvasElement,
}: PlayContext): Promise<HTMLElement> {
  return waitFor(() => {
    const panel = canvasElement.ownerDocument.querySelector<HTMLElement>(PANEL);
    expect(panel).not.toBeNull();
    const stage = panel!.querySelector(".tool-panel__stage");
    expect(stage?.textContent ?? "").not.toMatch(/Loading/);
    expect(panel!.querySelector(".mantine-Stack-root")).not.toBeNull();
    return panel!;
  }, STAGE_TIMEOUT);
}

/**
 * Play function that opens one tooltip the way a user does, by hovering its
 * trigger, so the capture shows the tooltip the editor draws.
 */
export function openTooltip(trigger: TooltipTrigger) {
  return async (context: PlayContext) => {
    const panel = within(await waitForToolPanel(context));
    const target =
      "step" in trigger
        ? await panel.findByText(trigger.step, { exact: true }, STAGE_TIMEOUT)
        : await panel.findByRole(
            "button",
            { name: trigger.info },
            STAGE_TIMEOUT,
          );
    target.scrollIntoView({ block: "center" });
    await userEvent.hover(target);
    const body = within(context.canvasElement.ownerDocument.body);
    await waitFor(
      () => expect(body.getByRole("tooltip")).toBeVisible(),
      STAGE_TIMEOUT,
    );
  };
}
