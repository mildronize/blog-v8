export interface RegisterShortcutOptions {
  disableTextInputs?: boolean;
}
/**
 * Register a keyboard shortcut with a callback
 * 
 * @ref: Original Hook in TypeScript from https://github.com/mildronize/blog-v8/blob/9db90ac6459c99658c41aaafc281aa8218cc5f06/snippets/src/pages/search/useShortcut.tsx
 * @ref: Original Hook in JavaScript from https://www.taniarascia.com/keyboard-shortcut-hook-react/
 */
export function registerShortcut(
  shortcut: string,
  callback: (event: KeyboardEvent) => void,
  options: RegisterShortcutOptions = { disableTextInputs: true }
) {
  // Track partial sequences of multi-key shortcuts
  let keyCombo: string[] = [];

  function handleKeyDown(event: KeyboardEvent) {
    // Check if user is typing into an input
    const target = event.target as HTMLElement | null;
    const isTextInput =
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLInputElement &&
        (!target.type || target.type === 'text')) ||
      (target?.isContentEditable ?? false);

    // If the event is being held down, ignore
    if (event.repeat) {
      return;
    }

    // If we should ignore text inputs and user is in a text field, stop
    if (options.disableTextInputs && isTextInput) {
      event.stopPropagation();
      return;
    }

    const modifierMap: Record<string, boolean> = {
      Control: event.ctrlKey,
      Alt: event.altKey,
      Command: event.metaKey, // often "Meta" on some OS
      Shift: event.shiftKey,
    };

    // Handle modifier-based shortcuts like "Control+D" or "Alt+Shift+S"
    if (shortcut.includes('+')) {
      const keyArray = shortcut.split('+');

      // If first part is a modifier (e.g. "Control"), handle that case
      if (Object.keys(modifierMap).includes(keyArray[0])) {
        const finalKey = keyArray.pop(); // e.g. 'D'
        // If all required modifiers are pressed, and finalKey matches event.key
        if (keyArray.every((k) => modifierMap[k]) && finalKey === event.key) {
          callback(event);
        }
      } else {
        // Otherwise, treat "A+B+C" like a sequence: press A, then B, then C
        if (keyArray[keyCombo.length] === event.key) {
          // If this was the last key in the sequence, call callback
          if (
            keyArray[keyArray.length - 1] === event.key &&
            keyCombo.length === keyArray.length - 1
          ) {
            callback(event);
            keyCombo = []; // reset
            return;
          }

          // Otherwise, we're partway through the sequence
          keyCombo = [...keyCombo, event.key];
          return;
        }

        // If user pressed something that doesn't match the sequence, reset
        if (keyCombo.length > 0) {
          keyCombo = [];
          return;
        }
      }
    }

    // Handle single-key shortcut (e.g. just 'D')
    if (shortcut === event.key) {
      callback(event);
    }
  }

  // Attach the listener
  window.addEventListener('keydown', handleKeyDown);

  return {
      // Return a cleanup function
    unregister: () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }
}
