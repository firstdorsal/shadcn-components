import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import {
  HotkeyInput,
  formatHotkey,
  hotkeyEquals,
  type Hotkey,
} from "@/components/ui/hotkey-input"

describe(`HotkeyInput`, () => {
  describe(`rendering`, () => {
    it(`renders with default placeholder`, () => {
      render(<HotkeyInput />)
      expect(screen.getByText(`Press a key combination...`)).toBeInTheDocument()
    })

    it(`renders with custom placeholder`, () => {
      render(<HotkeyInput placeholder={`Set shortcut`} />)
      expect(screen.getByText(`Set shortcut`)).toBeInTheDocument()
    })

    it(`renders with aria-label`, () => {
      render(<HotkeyInput aria-label={`Custom shortcut`} />)
      expect(screen.getByRole(`textbox`)).toHaveAttribute(
        `aria-label`,
        `Custom shortcut`
      )
    })

    it(`renders disabled state`, () => {
      render(<HotkeyInput disabled />)
      const input = screen.getByRole(`textbox`)
      expect(input).toHaveAttribute(`aria-disabled`, `true`)
      expect(input).toHaveAttribute(`tabindex`, `-1`)
    })

    it(`displays controlled value`, () => {
      const hotkey: Hotkey = {
        key: `s`,
        code: `KeyS`,
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      }
      render(<HotkeyInput value={hotkey} />)
      expect(screen.getByText(`Ctrl + S`)).toBeInTheDocument()
    })

    it(`displays default value`, () => {
      const hotkey: Hotkey = {
        key: `a`,
        code: `KeyA`,
        ctrlKey: false,
        shiftKey: true,
        altKey: true,
        metaKey: false,
      }
      render(<HotkeyInput defaultValue={hotkey} />)
      expect(screen.getByText(`Alt + Shift + A`)).toBeInTheDocument()
    })
  })

  describe(`key capture`, () => {
    it(`captures single key press`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: `a`, code: `KeyA` })

      expect(onChange).toHaveBeenCalledWith({
        key: `a`,
        code: `KeyA`,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      })
    })

    it(`captures Ctrl+key combination`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: `s`, code: `KeyS`, ctrlKey: true })

      expect(onChange).toHaveBeenCalledWith({
        key: `s`,
        code: `KeyS`,
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      })
    })

    it(`captures Ctrl+Shift+key combination`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, {
        key: `p`,
        code: `KeyP`,
        ctrlKey: true,
        shiftKey: true,
      })

      expect(onChange).toHaveBeenCalledWith({
        key: `p`,
        code: `KeyP`,
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
        metaKey: false,
      })
    })

    it(`captures Alt+key combination`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: `Enter`, code: `Enter`, altKey: true })

      expect(onChange).toHaveBeenCalledWith({
        key: `Enter`,
        code: `Enter`,
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        metaKey: false,
      })
    })

    it(`captures Meta+key combination`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: `k`, code: `KeyK`, metaKey: true })

      expect(onChange).toHaveBeenCalledWith({
        key: `k`,
        code: `KeyK`,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: true,
      })
    })

    it(`captures complex modifier combination`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, {
        key: `z`,
        code: `KeyZ`,
        ctrlKey: true,
        shiftKey: true,
        altKey: true,
        metaKey: true,
      })

      expect(onChange).toHaveBeenCalledWith({
        key: `z`,
        code: `KeyZ`,
        ctrlKey: true,
        shiftKey: true,
        altKey: true,
        metaKey: true,
      })
    })

    it(`captures function keys`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: `F5`, code: `F5` })

      expect(onChange).toHaveBeenCalledWith({
        key: `F5`,
        code: `F5`,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      })
    })

    it(`captures arrow keys`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, {
        key: `ArrowUp`,
        code: `ArrowUp`,
        ctrlKey: true,
      })

      expect(onChange).toHaveBeenCalledWith({
        key: `ArrowUp`,
        code: `ArrowUp`,
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      })
    })

    it(`captures Space key`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: ` `, code: `Space`, ctrlKey: true })

      expect(onChange).toHaveBeenCalledWith({
        key: ` `,
        code: `Space`,
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      })
    })

    it(`captures Escape key`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: `Escape`, code: `Escape` })

      expect(onChange).toHaveBeenCalledWith({
        key: `Escape`,
        code: `Escape`,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      })
    })
  })

  describe(`blocked keys`, () => {
    it(`ignores Tab key`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: `Tab`, code: `Tab` })

      expect(onChange).not.toHaveBeenCalled()
    })

    it(`ignores CapsLock`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: `CapsLock`, code: `CapsLock` })

      expect(onChange).not.toHaveBeenCalled()
    })

    it(`ignores NumLock`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: `NumLock`, code: `NumLock` })

      expect(onChange).not.toHaveBeenCalled()
    })

    it(`ignores ScrollLock`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: `ScrollLock`, code: `ScrollLock` })

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe(`modifier-only keys`, () => {
    it(`does not capture modifier-only by default`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput onChange={onChange} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, {
        key: `Control`,
        code: `ControlLeft`,
        ctrlKey: true,
      })
      fireEvent.keyUp(input, {
        key: `Control`,
        code: `ControlLeft`,
        ctrlKey: false,
      })

      expect(onChange).not.toHaveBeenCalled()
    })

    it(`shows pending modifiers while held`, () => {
      render(<HotkeyInput />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, {
        key: `Control`,
        code: `ControlLeft`,
        ctrlKey: true,
      })

      expect(screen.getByText(`Ctrl + ...`)).toBeInTheDocument()
    })

    it(`shows multiple pending modifiers`, () => {
      render(<HotkeyInput />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, {
        key: `Shift`,
        code: `ShiftLeft`,
        ctrlKey: true,
        shiftKey: true,
      })

      expect(screen.getByText(`Ctrl + Shift + ...`)).toBeInTheDocument()
    })

    it(`clears pending modifiers on blur`, () => {
      render(<HotkeyInput placeholder={`Press a key...`} />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, {
        key: `Control`,
        code: `ControlLeft`,
        ctrlKey: true,
      })

      expect(screen.getByText(`Ctrl + ...`)).toBeInTheDocument()

      fireEvent.blur(input)

      expect(screen.getByText(`Press a key...`)).toBeInTheDocument()
    })
  })

  describe(`recording state`, () => {
    it(`shows 'Recording...' when focused with no value`, () => {
      render(<HotkeyInput />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)

      expect(screen.getByText(`Recording...`)).toBeInTheDocument()
    })

    it(`exits recording state after key capture`, () => {
      render(<HotkeyInput />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)

      expect(screen.getByText(`Recording...`)).toBeInTheDocument()

      fireEvent.keyDown(input, { key: `a`, code: `KeyA` })

      expect(screen.queryByText(`Recording...`)).not.toBeInTheDocument()
      expect(screen.getByText(`A`)).toBeInTheDocument()
    })

    it(`applies ring style when recording`, () => {
      render(<HotkeyInput />)

      const input = screen.getByRole(`textbox`)

      expect(input).not.toHaveClass(`ring-1`)

      fireEvent.focus(input)

      expect(input).toHaveClass(`ring-1`)
    })
  })

  describe(`clear button`, () => {
    it(`shows clear button when value is set`, () => {
      const hotkey: Hotkey = {
        key: `a`,
        code: `KeyA`,
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      }
      render(<HotkeyInput value={hotkey} />)

      expect(screen.getByRole(`button`, { name: `Clear hotkey` })).toBeInTheDocument()
    })

    it(`does not show clear button when no value`, () => {
      render(<HotkeyInput />)

      expect(screen.queryByRole(`button`, { name: `Clear hotkey` })).not.toBeInTheDocument()
    })

    it(`does not show clear button when disabled`, () => {
      const hotkey: Hotkey = {
        key: `a`,
        code: `KeyA`,
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      }
      render(<HotkeyInput value={hotkey} disabled />)

      expect(screen.queryByRole(`button`, { name: `Clear hotkey` })).not.toBeInTheDocument()
    })

    it(`clears value when clear button clicked`, () => {
      const onChange = vi.fn()
      const hotkey: Hotkey = {
        key: `a`,
        code: `KeyA`,
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      }
      render(<HotkeyInput defaultValue={hotkey} onChange={onChange} />)

      const clearButton = screen.getByRole(`button`, { name: `Clear hotkey` })
      fireEvent.click(clearButton)

      expect(onChange).toHaveBeenCalledWith(null)
    })
  })

  describe(`disabled state`, () => {
    it(`does not capture keys when disabled`, () => {
      const onChange = vi.fn()
      render(<HotkeyInput disabled onChange={onChange} />)

      const input = screen.getByRole(`textbox`)

      fireEvent.keyDown(input, { key: `a`, code: `KeyA` })

      expect(onChange).not.toHaveBeenCalled()
    })

    it(`does not enter recording state when disabled`, () => {
      render(<HotkeyInput disabled />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)

      expect(screen.queryByText(`Recording...`)).not.toBeInTheDocument()
    })
  })

  describe(`controlled mode`, () => {
    it(`respects controlled value changes`, () => {
      const hotkey1: Hotkey = {
        key: `a`,
        code: `KeyA`,
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      }
      const hotkey2: Hotkey = {
        key: `b`,
        code: `KeyB`,
        ctrlKey: false,
        shiftKey: true,
        altKey: false,
        metaKey: false,
      }

      const { rerender } = render(<HotkeyInput value={hotkey1} />)
      expect(screen.getByText(`Ctrl + A`)).toBeInTheDocument()

      rerender(<HotkeyInput value={hotkey2} />)
      expect(screen.getByText(`Shift + B`)).toBeInTheDocument()
    })

    it(`allows null value in controlled mode`, () => {
      const { rerender } = render(<HotkeyInput value={null} />)
      expect(screen.getByText(`Press a key combination...`)).toBeInTheDocument()

      const hotkey: Hotkey = {
        key: `x`,
        code: `KeyX`,
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      }
      rerender(<HotkeyInput value={hotkey} />)
      expect(screen.getByText(`Ctrl + X`)).toBeInTheDocument()

      rerender(<HotkeyInput value={null} />)
      expect(screen.getByText(`Press a key combination...`)).toBeInTheDocument()
    })
  })

  describe(`uncontrolled mode`, () => {
    it(`maintains internal state`, () => {
      render(<HotkeyInput />)

      const input = screen.getByRole(`textbox`)
      fireEvent.focus(input)
      fireEvent.keyDown(input, { key: `f`, code: `KeyF`, ctrlKey: true })

      expect(screen.getByText(`Ctrl + F`)).toBeInTheDocument()
    })

    it(`uses defaultValue initially`, () => {
      const hotkey: Hotkey = {
        key: `g`,
        code: `KeyG`,
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
        metaKey: false,
      }
      render(<HotkeyInput defaultValue={hotkey} />)

      expect(screen.getByText(`Ctrl + Shift + G`)).toBeInTheDocument()
    })
  })
})

describe(`formatHotkey`, () => {
  it(`formats single key`, () => {
    const hotkey: Hotkey = {
      key: `a`,
      code: `KeyA`,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(formatHotkey(hotkey)).toBe(`A`)
  })

  it(`formats Ctrl+key`, () => {
    const hotkey: Hotkey = {
      key: `s`,
      code: `KeyS`,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(formatHotkey(hotkey)).toBe(`Ctrl + S`)
  })

  it(`formats modifiers in correct order`, () => {
    const hotkey: Hotkey = {
      key: `z`,
      code: `KeyZ`,
      ctrlKey: true,
      shiftKey: true,
      altKey: true,
      metaKey: true,
    }
    expect(formatHotkey(hotkey)).toBe(`Ctrl + Alt + Shift + Meta + Z`)
  })

  it(`formats Space key`, () => {
    const hotkey: Hotkey = {
      key: ` `,
      code: `Space`,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(formatHotkey(hotkey)).toBe(`Ctrl + Space`)
  })

  it(`formats arrow keys`, () => {
    const hotkey: Hotkey = {
      key: `ArrowUp`,
      code: `ArrowUp`,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(formatHotkey(hotkey)).toBe(`Up`)
  })

  it(`formats Escape key`, () => {
    const hotkey: Hotkey = {
      key: `Escape`,
      code: `Escape`,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(formatHotkey(hotkey)).toBe(`Esc`)
  })

  it(`formats function keys`, () => {
    const hotkey: Hotkey = {
      key: `F12`,
      code: `F12`,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(formatHotkey(hotkey)).toBe(`Ctrl + F12`)
  })

  it(`formats Delete key`, () => {
    const hotkey: Hotkey = {
      key: `Delete`,
      code: `Delete`,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(formatHotkey(hotkey)).toBe(`Ctrl + Del`)
  })

  it(`formats modifier-only hotkey (Ctrl key itself)`, () => {
    const hotkey: Hotkey = {
      key: `Control`,
      code: `ControlLeft`,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(formatHotkey(hotkey)).toBe(`Ctrl`)
  })
})

describe(`hotkeyEquals`, () => {
  it(`returns true for identical hotkeys`, () => {
    const a: Hotkey = {
      key: `a`,
      code: `KeyA`,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    const b: Hotkey = {
      key: `a`,
      code: `KeyA`,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(hotkeyEquals(a, b)).toBe(true)
  })

  it(`returns false for different keys`, () => {
    const a: Hotkey = {
      key: `a`,
      code: `KeyA`,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    const b: Hotkey = {
      key: `b`,
      code: `KeyB`,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(hotkeyEquals(a, b)).toBe(false)
  })

  it(`returns false for different modifiers`, () => {
    const a: Hotkey = {
      key: `a`,
      code: `KeyA`,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    const b: Hotkey = {
      key: `a`,
      code: `KeyA`,
      ctrlKey: true,
      shiftKey: true,
      altKey: false,
      metaKey: false,
    }
    expect(hotkeyEquals(a, b)).toBe(false)
  })

  it(`returns true for both null`, () => {
    expect(hotkeyEquals(null, null)).toBe(true)
  })

  it(`returns true for both undefined`, () => {
    expect(hotkeyEquals(undefined, undefined)).toBe(true)
  })

  it(`returns false for null and hotkey`, () => {
    const hotkey: Hotkey = {
      key: `a`,
      code: `KeyA`,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(hotkeyEquals(null, hotkey)).toBe(false)
    expect(hotkeyEquals(hotkey, null)).toBe(false)
  })

  it(`returns false for different codes (same key)`, () => {
    const a: Hotkey = {
      key: `1`,
      code: `Digit1`,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    const b: Hotkey = {
      key: `1`,
      code: `Numpad1`,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }
    expect(hotkeyEquals(a, b)).toBe(false)
  })
})
