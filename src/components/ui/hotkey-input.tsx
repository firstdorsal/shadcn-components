import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * Represents a captured keyboard shortcut with modifier key states.
 * Both `key` and `code` are stored for cross-platform compatibility.
 */
export interface Hotkey {
  /** The key value (e.g., "k", "Enter", "ArrowUp") */
  key: string
  /** The physical key code (e.g., "KeyK", "Enter", "ArrowUp") */
  code: string
  /** Whether Ctrl (or Control on Mac) was held */
  ctrlKey: boolean
  /** Whether Shift was held */
  shiftKey: boolean
  /** Whether Alt (or Option on Mac) was held */
  altKey: boolean
  /** Whether Meta (Cmd on Mac, Win on Windows) was held */
  metaKey: boolean
}

/**
 * State for tracking currently held modifier keys during recording.
 */
interface ModifierState {
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  metaKey: boolean
}

/**
 * Props for the HotkeyInput component.
 */
export interface HotkeyInputProps {
  /** Controlled hotkey value. Pass `undefined` for uncontrolled mode. */
  value?: Hotkey | null
  /** Initial hotkey for uncontrolled mode. */
  defaultValue?: Hotkey | null
  /** Called when the hotkey changes. */
  onChange?: (hotkey: Hotkey | null) => void
  /** Disables the input. */
  disabled?: boolean
  /** Placeholder text when no hotkey is set. */
  placeholder?: string
  /** Allow capturing modifier-only shortcuts (e.g., just "Ctrl"). */
  allowModifierOnly?: boolean
  /** Additional CSS classes for the container. */
  className?: string
  /** Accessible label for the input. */
  // TypeScript requires quotes for hyphenated property names in interfaces
  // eslint-disable-next-line quotes
  "aria-label"?: string
}

const MODIFIER_KEYS = new Set([
  `Control`,
  `Shift`,
  `Alt`,
  `Meta`,
  `CapsLock`,
  `NumLock`,
  `ScrollLock`,
])

const BLOCKED_KEYS = new Set([
  `Tab`,
  `CapsLock`,
  `NumLock`,
  `ScrollLock`,
])

/**
 * Formats a Hotkey object into a human-readable string (e.g., "Ctrl + Shift + K").
 */
const formatHotkey = (hotkey: Hotkey): string => {
  const parts: string[] = []

  if (hotkey.ctrlKey) parts.push(`Ctrl`)
  if (hotkey.altKey) parts.push(`Alt`)
  if (hotkey.shiftKey) parts.push(`Shift`)
  if (hotkey.metaKey) parts.push(`Meta`)

  if (!MODIFIER_KEYS.has(hotkey.key)) {
    parts.push(formatKeyName(hotkey.key))
  }

  return parts.join(` + `)
}

const formatKeyName = (key: string): string => {
  const keyMap: Record<string, string> = {
    " ": `Space`,
    "ArrowUp": `Up`,
    "ArrowDown": `Down`,
    "ArrowLeft": `Left`,
    "ArrowRight": `Right`,
    "Escape": `Esc`,
    "Delete": `Del`,
    "Backspace": `Backspace`,
    "Enter": `Enter`,
    "Insert": `Ins`,
    "PageUp": `PgUp`,
    "PageDown": `PgDn`,
    "Home": `Home`,
    "End": `End`,
  }

  if (keyMap[key]) return keyMap[key]
  if (key.length === 1) return key.toUpperCase()
  return key
}

/**
 * Compares two Hotkey objects for equality.
 * Returns true if both are null/undefined or if all properties match.
 */
const hotkeyEquals = (a: Hotkey | null | undefined, b: Hotkey | null | undefined): boolean => {
  if (!a && !b) return true
  if (!a || !b) return false
  return (
    a.key === b.key &&
    a.code === b.code &&
    a.ctrlKey === b.ctrlKey &&
    a.shiftKey === b.shiftKey &&
    a.altKey === b.altKey &&
    a.metaKey === b.metaKey
  )
}

/**
 * A keyboard shortcut input component for capturing key combinations.
 *
 * Note: The forwarded ref points to the container `div` element, not a native
 * input. This component uses a div with `role="textbox"` for keyboard capture
 * and is not compatible with native form submission. Use the `onChange` callback
 * to integrate with forms.
 *
 * @example
 * ```tsx
 * <HotkeyInput
 *   value={hotkey}
 *   onChange={setHotkey}
 *   placeholder="Press a key combination..."
 * />
 * ```
 */
const HotkeyInput = React.forwardRef<HTMLDivElement, HotkeyInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = null,
      onChange,
      disabled = false,
      placeholder = `Press a key combination...`,
      allowModifierOnly = false,
      className,
      "aria-label": ariaLabel = `Hotkey input`,
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined
    const [internalValue, setInternalValue] = React.useState<Hotkey | null>(
      defaultValue
    )
    const [isRecording, setIsRecording] = React.useState(false)
    const [pendingModifiers, setPendingModifiers] = React.useState<ModifierState | null>(null)

    const value = isControlled ? controlledValue : internalValue

    const setValue = React.useCallback(
      (newValue: Hotkey | null) => {
        if (!isControlled) {
          setInternalValue(newValue)
        }
        onChange?.(newValue)
      },
      [isControlled, onChange]
    )

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return

        event.preventDefault()
        event.stopPropagation()

        if (BLOCKED_KEYS.has(event.key)) {
          return
        }

        const isModifierKey = MODIFIER_KEYS.has(event.key)

        if (isModifierKey) {
          setPendingModifiers({
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            metaKey: event.metaKey,
          })
          return
        }

        const hotkey: Hotkey = {
          key: event.key,
          code: event.code,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          metaKey: event.metaKey,
        }

        setValue(hotkey)
        setPendingModifiers(null)
        setIsRecording(false)
      },
      [disabled, setValue]
    )

    const handleKeyUp = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return

        if (!allowModifierOnly) {
          setPendingModifiers(null)
          return
        }

        // When allowModifierOnly is enabled and a modifier key is released,
        // capture the combination of OTHER modifiers that were held.
        // The released key becomes the "main" key, but we exclude it from
        // the modifier flags to avoid redundancy (e.g., Ctrl key sets key="Control"
        // but ctrlKey should be false since Ctrl IS the key, not a modifier of it).
        if (MODIFIER_KEYS.has(event.key) && pendingModifiers) {
          const hasModifier =
            pendingModifiers.ctrlKey ||
            pendingModifiers.shiftKey ||
            pendingModifiers.altKey ||
            pendingModifiers.metaKey

          if (hasModifier) {
            const hotkey: Hotkey = {
              key: event.key,
              code: event.code,
              ctrlKey: event.key !== `Control` && pendingModifiers.ctrlKey,
              shiftKey: event.key !== `Shift` && pendingModifiers.shiftKey,
              altKey: event.key !== `Alt` && pendingModifiers.altKey,
              metaKey: event.key !== `Meta` && pendingModifiers.metaKey,
            }

            if (
              hotkey.ctrlKey ||
              hotkey.shiftKey ||
              hotkey.altKey ||
              hotkey.metaKey
            ) {
              setValue(hotkey)
              setIsRecording(false)
            }
          }
          setPendingModifiers(null)
        }
      },
      [disabled, allowModifierOnly, pendingModifiers, setValue]
    )

    const handleFocus = React.useCallback(() => {
      if (!disabled) {
        setIsRecording(true)
      }
    }, [disabled])

    const handleBlur = React.useCallback(() => {
      setIsRecording(false)
      setPendingModifiers(null)
    }, [])

    const handleClear = React.useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation()
        setValue(null)
      },
      [setValue]
    )

    const displayValue = React.useMemo(() => {
      if (isRecording && pendingModifiers) {
        const parts: string[] = []
        if (pendingModifiers.ctrlKey) parts.push(`Ctrl`)
        if (pendingModifiers.altKey) parts.push(`Alt`)
        if (pendingModifiers.shiftKey) parts.push(`Shift`)
        if (pendingModifiers.metaKey) parts.push(`Meta`)
        if (parts.length > 0) return parts.join(` + `) + ` + ...`
      }

      if (value) {
        return formatHotkey(value)
      }

      return null
    }, [isRecording, pendingModifiers, value])

    return (
      <div
        ref={ref}
        role={`textbox`}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        aria-readonly={false}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          `flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors`,
          `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`,
          disabled && `cursor-not-allowed opacity-50`,
          !disabled && `cursor-text`,
          isRecording && `ring-1 ring-ring`,
          className
        )}
      >
        <span
          className={cn(
            `flex-1 select-none font-mono text-sm`,
            !displayValue && `text-muted-foreground`
          )}
        >
          {displayValue ?? (isRecording ? `Recording...` : placeholder)}
        </span>
        {value && !disabled && (
          <Button
            type={`button`}
            variant={`ghost`}
            size={`icon`}
            className={`h-5 w-5 shrink-0`}
            onClick={handleClear}
            tabIndex={-1}
            aria-label={`Clear hotkey`}
          >
            <X className={`h-3 w-3`} />
          </Button>
        )}
      </div>
    )
  }
)
HotkeyInput.displayName = `HotkeyInput`

export { HotkeyInput, formatHotkey, hotkeyEquals }
export type { ModifierState }
