// Shared wiring for the modal dialogs on /map/ (own requirement, export & share):
// open as modal, close on a backdrop click, return focus to the opener.

/**
 * Wire a `<dialog>` and return `{ open(opener), close() }`.
 *
 * A backdrop click closes the dialog only when the press started on the
 * backdrop too: a text selection dragged out of a field ends with a click
 * whose target is the dialog, and must not throw a draft away.
 *
 * On close, focus returns to the opener while it is still in the page;
 * otherwise `onFocusLost` picks a target. `onClose` runs after that.
 */
export function bindDialog(dialog, { onClose = () => {}, onFocusLost = () => {} } = {}) {
  let opener = null;
  let pressedBackdrop = false;

  const close = () => {
    if (dialog.open) dialog.close();
  };
  const open = (from = dialog.ownerDocument.activeElement) => {
    opener = from;
    if (!dialog.open) dialog.showModal();
  };

  // The dialog element itself is only ever the target on its backdrop.
  dialog.addEventListener("mousedown", (event) => {
    pressedBackdrop = event.target === dialog;
  });
  dialog.addEventListener("click", (event) => {
    const fromBackdrop = pressedBackdrop;
    pressedBackdrop = false;
    if (fromBackdrop && event.target === dialog) close();
  });
  dialog.addEventListener("close", () => {
    const from = opener;
    opener = null;
    if (from?.isConnected) from.focus();
    else onFocusLost();
    onClose(from);
  });

  return { open, close };
}
