import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TZDate } from "@date-fns/tz";
import { DateTimeRangePicker } from "@/registry/new-york/date-time-picker/date-time-range-picker";

describe(`DateTimeRangePicker`, () => {
    it(`renders start and end inputs with 24h placeholder`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} />);
        const inputs = screen.getAllByPlaceholderText(`yyyy-MM-dd HH:mm`);
        expect(inputs).toHaveLength(2);
    });

    it(`renders with 12h placeholders`, () => {
        render(<DateTimeRangePicker timeFormat={`12h`} />);
        expect(screen.getAllByPlaceholderText(`yyyy-MM-dd hh:mm AM/PM`)).toHaveLength(2);
    });

    it(`renders with seconds placeholders`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} showSeconds={true} />);
        expect(screen.getAllByPlaceholderText(`yyyy-MM-dd HH:mm:ss`)).toHaveLength(2);
    });

    it(`renders start and end labels`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} />);
        expect(screen.getByText(`Start`)).toBeInTheDocument();
        expect(screen.getByText(`End`)).toBeInTheDocument();
    });

    it(`displays controlled value`, () => {
        const from = new Date(2025, 5, 15, 14, 30, 0);
        const to = new Date(2025, 5, 20, 16, 0, 0);
        render(
            <DateTimeRangePicker
                value={{ from, to }}
                timeFormat={`24h`}
            />
        );
        expect(screen.getByDisplayValue(`2025-06-15 14:30`)).toBeInTheDocument();
        expect(screen.getByDisplayValue(`2025-06-20 16:00`)).toBeInTheDocument();
    });

    it(`allows typing in the start input`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} />);
        const inputs = screen.getAllByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(inputs[0], { target: { value: `2025-06-15 14:30` } });
        expect(inputs[0]).toHaveValue(`2025-06-15 14:30`);
    });

    it(`shows checkmark after typing in start input`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} />);
        const inputs = screen.getAllByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(inputs[0], { target: { value: `2025-06-15 14:30` } });
        expect(screen.getByLabelText(`Confirm date input`)).toBeInTheDocument();
    });

    it(`calls onChange after confirming start input`, () => {
        const onChange = vi.fn();
        render(<DateTimeRangePicker onChange={onChange} timeFormat={`24h`} />);
        const inputs = screen.getAllByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(inputs[0], { target: { value: `2025-06-15 14:30` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));
        expect(onChange).toHaveBeenCalled();
        const calledWith = onChange.mock.calls[0][0] as { from: Date; to: Date | undefined };
        expect(calledWith.from?.getFullYear()).toBe(2025);
        expect(calledWith.from?.getMonth()).toBe(5);
        expect(calledWith.from?.getDate()).toBe(15);
    });

    it(`opens popover when calendar icon is clicked`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} />);
        const calendarButtons = screen.getAllByLabelText(`Open calendar`);
        fireEvent.click(calendarButtons[0]);
        expect(screen.getByText(`Start time`)).toBeInTheDocument();
        expect(screen.getByText(`End time`)).toBeInTheDocument();
    });

    it(`does not show timezone when showTimezone is false`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} />);
        const calendarButtons = screen.getAllByLabelText(`Open calendar`);
        fireEvent.click(calendarButtons[0]);
        expect(screen.queryByText(`Timezone`)).not.toBeInTheDocument();
    });

    it(`shows timezone when showTimezone is true`, () => {
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                showTimezone={true}
                timeZone={`UTC`}
                onTimezoneChange={vi.fn()}
            />
        );
        const calendarButtons = screen.getAllByLabelText(`Open calendar`);
        fireEvent.click(calendarButtons[0]);
        expect(screen.getByText(`Timezone`)).toBeInTheDocument();
    });

    it(`disables inputs when disabled`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} disabled={true} />);
        const startInput = screen.getByLabelText(`Start date and time`);
        const endInput = screen.getByLabelText(`End date and time`);
        expect(startInput).toBeDisabled();
        expect(endInput).toBeDisabled();
    });

    it(`accepts custom start and end placeholders`, () => {
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                startPlaceholder={`Start date`}
                endPlaceholder={`End date`}
            />
        );
        expect(screen.getByPlaceholderText(`Start date`)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(`End date`)).toBeInTheDocument();
    });

    it(`renders in beside layout`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} timeLayout={`beside`} />);
        const calendarButtons = screen.getAllByLabelText(`Open calendar`);
        fireEvent.click(calendarButtons[0]);
        expect(screen.getByText(`Start time`)).toBeInTheDocument();
        expect(screen.getByText(`End time`)).toBeInTheDocument();
    });

    it(`renders with default uncontrolled state`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} />);
        const startInput = screen.getByLabelText(`Start date and time`) as HTMLInputElement;
        const endInput = screen.getByLabelText(`End date and time`) as HTMLInputElement;
        expect(startInput.value).toBe(``);
        expect(endInput.value).toBe(``);
    });

    it(`reverts start input on invalid confirm`, () => {
        const from = new Date(2025, 5, 15, 14, 30, 0);
        render(
            <DateTimeRangePicker
                value={{ from, to: undefined }}
                timeFormat={`24h`}
            />
        );
        const startInput = screen.getByDisplayValue(`2025-06-15 14:30`);
        fireEvent.change(startInput, { target: { value: `invalid` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));
        expect(startInput).toHaveValue(`2025-06-15 14:30`);
    });

    it(`uses locale detection for default timeFormat`, () => {
        render(<DateTimeRangePicker />);
        const startInput = screen.getByLabelText(`Start date and time`);
        expect(startInput).toBeInTheDocument();
    });

    it(`passes disableFuture to calendar`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} disableFuture={true} />);
        const calendarButtons = screen.getAllByLabelText(`Open calendar`);
        fireEvent.click(calendarButtons[0]);
        expect(screen.getByText(`Start time`)).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// Helpers for drag tests
// ---------------------------------------------------------------------------

const openCalendarWithRange = (
    from: Date,
    to: Date,
    onChange = vi.fn()
) => {
    const result = render(
        <DateTimeRangePicker
            value={{ from, to }}
            onChange={onChange}
            timeFormat={`24h`}
        />
    );
    const calendarButtons = screen.getAllByLabelText(`Open calendar`);
    fireEvent.click(calendarButtons[0]);
    return { ...result, onChange };
};

// Radix Popover renders content in a portal on document.body, so we must
// search document.body rather than the render container.
const body = () => document.body as HTMLElement;

const findDaySpan = (dataAttr: string): HTMLElement => {
    const button = body().querySelector(`[${dataAttr}="true"]`);
    if (!button) throw new Error(`No button with ${dataAttr}="true" found`);
    const span = button.parentElement;
    if (!span) throw new Error(`Button has no parent span`);
    return span;
};

const findDayByNumber = (dayNum: number, monthIndex = 0): HTMLElement => {
    // Calendar renders two months; each month has its own grid.
    // Find all visible day buttons with the matching text content.
    const allButtons = Array.from(
        body().querySelectorAll<HTMLElement>(`[data-slot="calendar"] button`)
    ).filter(
        (btn) =>
            btn.textContent?.trim() === String(dayNum) &&
            !btn.closest(`[data-disabled="true"]`)
    );

    const btn = allButtons[monthIndex] ?? allButtons[0];
    if (!btn)
        throw new Error(
            `No day button with text "${dayNum}" at monthIndex ${monthIndex}`
        );
    const span = btn.parentElement;
    if (!span || span.tagName !== `SPAN`) return btn;
    return span;
};

// ---------------------------------------------------------------------------
// Drag helpers
// ---------------------------------------------------------------------------
// IMPORTANT: After each pointer event that mutates drag state, React re-renders
// the Calendar with a new `selected` range. This can replace DOM nodes, making
// previously-captured element references stale. Therefore we must look up
// elements **fresh** before every event dispatch.

const simulateDrag = (
    startDataAttr: string,
    targetDayNum: number,
    pointerOpts: PointerEventInit = {}
) => {
    act(() => {
        fireEvent.pointerDown(findDaySpan(startDataAttr), {
            button: 0,
            ...pointerOpts
        });
    });
    act(() => {
        findDayByNumber(targetDayNum).dispatchEvent(
            new PointerEvent(`pointerover`, {
                bubbles: true,
                cancelable: true,
                ...pointerOpts
            })
        );
    });
    act(() => {
        findDayByNumber(targetDayNum).dispatchEvent(
            new PointerEvent(`pointerup`, {
                bubbles: true,
                cancelable: true,
                ...pointerOpts
            })
        );
    });
};

// ---------------------------------------------------------------------------
// Drag interaction tests
// ---------------------------------------------------------------------------

describe(`DateTimeRangePicker drag interactions`, () => {
    it(`shows grab cursor on range endpoint spans and their inner buttons`, () => {
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15)
        );
        const startSpan = findDaySpan(`data-range-start`);
        const endSpan = findDaySpan(`data-range-end`);
        expect(startSpan.className).toContain(`cursor-grab`);
        expect(endSpan.className).toContain(`cursor-grab`);
        // The inner button must also get the cursor override
        expect(startSpan.className).toMatch(/\[&_button\]:cursor-grab/);
        expect(endSpan.className).toMatch(/\[&_button\]:cursor-grab/);
    });

    it(`updates range when dragging the end marker`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        simulateDrag(`data-range-end`, 20);

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        expect(call.to.getDate()).toBe(20);
        expect(call.from.getDate()).toBe(10);
    });

    it(`updates range when dragging the start marker`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        simulateDrag(`data-range-start`, 5);

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        expect(call.from.getDate()).toBe(5);
        expect(call.to.getDate()).toBe(15);
    });

    it(`auto-swaps when dragging start past end`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        simulateDrag(`data-range-start`, 20);

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        // Auto-swapped: from should be the earlier date (15), to the later (20)
        expect(call.from.getDate()).toBe(15);
        expect(call.to.getDate()).toBe(20);
    });

    it(`auto-swaps when dragging end before start`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        simulateDrag(`data-range-end`, 5);

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        expect(call.from.getDate()).toBe(5);
        expect(call.to.getDate()).toBe(10);
    });

    it(`does not modify range on click without drag`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        onChange.mockClear();

        // Pointer down + up on same element without entering another day
        act(() => {
            fireEvent.pointerDown(findDaySpan(`data-range-end`), { button: 0 });
        });
        act(() => {
            findDaySpan(`data-range-end`).dispatchEvent(
                new PointerEvent(`pointerup`, { bubbles: true, cancelable: true })
            );
        });

        // handleDragEnd should NOT have been called (hasMoved=false)
        const dragCalls = onChange.mock.calls.filter((c) => {
            const arg = c[0] as { from: Date; to: Date };
            return arg.from && arg.to;
        });
        expect(dragCalls).toHaveLength(0);
    });

    it(`preserves time values after drag`, () => {
        const from = new Date(2025, 5, 10, 14, 30, 45);
        const to = new Date(2025, 5, 15, 9, 15, 30);
        const onChange = vi.fn();
        openCalendarWithRange(from, to, onChange);

        simulateDrag(`data-range-end`, 20);

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        // Start time preserved
        expect(call.from.getHours()).toBe(14);
        expect(call.from.getMinutes()).toBe(30);
        // End time preserved
        expect(call.to.getHours()).toBe(9);
        expect(call.to.getMinutes()).toBe(15);
    });

    it(`does not start drag when disabled`, () => {
        const onChange = vi.fn();
        render(
            <DateTimeRangePicker
                value={{
                    from: new Date(2025, 5, 10),
                    to: new Date(2025, 5, 15)
                }}
                onChange={onChange}
                timeFormat={`24h`}
                disabled={true}
            />
        );

        const calendarButtons = screen.getAllByLabelText(`Open calendar`);
        expect(calendarButtons[0]).toBeDisabled();
    });

    it(`does not start drag on right-click`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        onChange.mockClear();

        act(() => {
            fireEvent.pointerDown(findDaySpan(`data-range-start`), { button: 2 });
        });
        act(() => {
            findDaySpan(`data-range-start`).dispatchEvent(
                new PointerEvent(`pointerup`, { bubbles: true, cancelable: true })
            );
        });

        expect(onChange).not.toHaveBeenCalled();
    });

    it(`shows grabbing cursor during drag`, () => {
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15)
        );

        const endSpan = findDaySpan(`data-range-end`);

        // Before drag
        expect(endSpan.className).toContain(`cursor-grab`);
        expect(endSpan.className).not.toContain(`cursor-grabbing`);

        // Start drag
        act(() => {
            fireEvent.pointerDown(endSpan, { button: 0 });
        });

        // During drag — all day spans should show grabbing cursor
        const day12Span = findDayByNumber(12);
        expect(day12Span.className).toContain(`cursor-grabbing`);
    });
});

// ---------------------------------------------------------------------------
// Touch / mobile drag tests
// ---------------------------------------------------------------------------

describe(`DateTimeRangePicker touch drag interactions`, () => {
    const touchOpts: PointerEventInit = { pointerType: `touch`, pointerId: 1 };

    it(`handles touch drag to extend range end`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        simulateDrag(`data-range-end`, 18, touchOpts);

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        expect(call.to.getDate()).toBe(18);
        expect(call.from.getDate()).toBe(10);
    });

    it(`handles touch drag to move start earlier`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        simulateDrag(`data-range-start`, 3, touchOpts);

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        expect(call.from.getDate()).toBe(3);
        expect(call.to.getDate()).toBe(15);
    });

    it(`has touch-action none on day button wrappers`, () => {
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15)
        );
        const startSpan = findDaySpan(`data-range-start`);
        expect(startSpan.style.touchAction).toBe(`none`);
    });

    it(`touch auto-swaps when dragging end before start`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        simulateDrag(`data-range-end`, 5, touchOpts);

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        // Auto-swapped
        expect(call.from.getDate()).toBe(5);
        expect(call.to.getDate()).toBe(10);
    });
});

// ---------------------------------------------------------------------------
// Realistic click helper
// ---------------------------------------------------------------------------
// In real browsers, a click is preceded by pointerdown → pointerup → click.
// Using just fireEvent.click() skips the pointerdown handler entirely and
// won't catch bugs where pointerdown intercepts/prevents the click.
//
// Accepts a finder function (not an element) because pointer events can cause
// React re-renders that recreate DOM nodes, making stale references invalid.

const simulateRealisticClick = (findTarget: () => HTMLElement) => {
    act(() => {
        fireEvent.pointerDown(findTarget(), { button: 0 });
    });
    act(() => {
        fireEvent.pointerUp(findTarget(), { button: 0 });
    });
    act(() => {
        fireEvent.click(findTarget());
    });
};

// ---------------------------------------------------------------------------
// Click selection pattern tests (first click = start, second = end, etc.)
// ---------------------------------------------------------------------------

describe(`DateTimeRangePicker click selection pattern`, () => {
    it(`first click selects start date only`, () => {
        const onChange = vi.fn();
        render(
            <DateTimeRangePicker
                onChange={onChange}
                timeFormat={`24h`}
            />
        );

        const calendarButtons = screen.getAllByLabelText(`Open calendar`);
        fireEvent.click(calendarButtons[0]);

        simulateRealisticClick(() => {
            const span = findDayByNumber(10);
            return span.querySelector(`button`) ?? span;
        });

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date | undefined;
            to: Date | undefined;
        };
        expect(call.from).toBeDefined();
        expect(call.from?.getDate()).toBe(10);
        expect(call.to).toBeUndefined();
    });

    it(`second click sets end date completing the range`, () => {
        const onChange = vi.fn();
        render(
            <DateTimeRangePicker
                value={{ from: new Date(2025, 5, 10), to: undefined }}
                onChange={onChange}
                timeFormat={`24h`}
            />
        );

        const calendarButtons = screen.getAllByLabelText(`Open calendar`);
        fireEvent.click(calendarButtons[0]);

        simulateRealisticClick(() => {
            const span = findDayByNumber(20);
            return span.querySelector(`button`) ?? span;
        });

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date | undefined;
            to: Date | undefined;
        };
        expect(call.from?.getDate()).toBe(10);
        expect(call.to).toBeDefined();
        expect(call.to?.getDate()).toBe(20);
    });

    it(`third click on complete range starts new selection (clears to)`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        onChange.mockClear();

        simulateRealisticClick(() => {
            const span = findDayByNumber(25);
            return span.querySelector(`button`) ?? span;
        });

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date | undefined;
            to: Date | undefined;
        };
        expect(call.from).toBeDefined();
        // to must be cleared on 3rd click
        expect(call.to).toBeUndefined();
    });

    it(`clicking endpoint of complete range without dragging starts new selection`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        onChange.mockClear();

        simulateRealisticClick(() => {
            const span = findDaySpan(`data-range-start`);
            return span.querySelector(`button`) ?? span;
        });

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date | undefined;
            to: Date | undefined;
        };
        // to must be cleared
        expect(call.to).toBeUndefined();
    });

    it(`full 3-click cycle in uncontrolled mode: from → to → new from → new to`, () => {
        const onChange = vi.fn();
        render(
            <DateTimeRangePicker onChange={onChange} timeFormat={`24h`} />
        );

        const calendarButtons = screen.getAllByLabelText(`Open calendar`);
        fireEvent.click(calendarButtons[0]);

        // Click 1: set from = day 10
        simulateRealisticClick(() => {
            const span = findDayByNumber(10);
            return span.querySelector(`button`) ?? span;
        });
        expect(onChange).toHaveBeenCalledTimes(1);
        const call1 = onChange.mock.calls[0][0] as {
            from: Date | undefined;
            to: Date | undefined;
        };
        expect(call1.from?.getDate()).toBe(10);
        expect(call1.to).toBeUndefined();

        // Click 2: set to = day 15
        simulateRealisticClick(() => {
            const span = findDayByNumber(15);
            return span.querySelector(`button`) ?? span;
        });
        expect(onChange).toHaveBeenCalledTimes(2);
        const call2 = onChange.mock.calls[1][0] as {
            from: Date | undefined;
            to: Date | undefined;
        };
        expect(call2.from?.getDate()).toBe(10);
        expect(call2.to?.getDate()).toBe(15);

        // Click 3: start new range, from = day 20, to cleared
        simulateRealisticClick(() => {
            const span = findDayByNumber(20);
            return span.querySelector(`button`) ?? span;
        });
        expect(onChange).toHaveBeenCalledTimes(3);
        const call3 = onChange.mock.calls[2][0] as {
            from: Date | undefined;
            to: Date | undefined;
        };
        expect(call3.from?.getDate()).toBe(20);
        expect(call3.to).toBeUndefined();

        // Click 4: set to = day 25
        simulateRealisticClick(() => {
            const span = findDayByNumber(25);
            return span.querySelector(`button`) ?? span;
        });
        expect(onChange).toHaveBeenCalledTimes(4);
        const call4 = onChange.mock.calls[3][0] as {
            from: Date | undefined;
            to: Date | undefined;
        };
        expect(call4.from?.getDate()).toBe(20);
        expect(call4.to?.getDate()).toBe(25);
    });
});

// ---------------------------------------------------------------------------
// QA-1: End date validation tests
// ---------------------------------------------------------------------------

describe(`DateTimeRangePicker end date validation`, () => {
    it(`rejects end date before start date via text input`, () => {
        const onChange = vi.fn();
        const from = new Date(2025, 5, 15, 14, 30, 0);
        const to = new Date(2025, 5, 20, 16, 0, 0);
        render(
            <DateTimeRangePicker
                value={{ from, to }}
                onChange={onChange}
                timeFormat={`24h`}
            />
        );
        // Try to set end date to before start date
        const endInput = screen.getByDisplayValue(`2025-06-20 16:00`);
        fireEvent.change(endInput, { target: { value: `2025-06-10 12:00` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        // End input should revert to original value — onChange should NOT have
        // been called with an invalid range
        expect(endInput).toHaveValue(`2025-06-20 16:00`);
    });

    it(`accepts end date equal to start date`, () => {
        const onChange = vi.fn();
        const from = new Date(2025, 5, 15, 10, 0, 0);
        render(
            <DateTimeRangePicker
                value={{ from, to: undefined }}
                onChange={onChange}
                timeFormat={`24h`}
            />
        );
        const inputs = screen.getAllByPlaceholderText(`yyyy-MM-dd HH:mm`);
        const endInput = inputs[1];
        fireEvent.change(endInput, { target: { value: `2025-06-15 10:00` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        expect(call.to.getDate()).toBe(15);
        expect(call.to.getHours()).toBe(10);
    });

    it(`accepts end date after start date via text input`, () => {
        const onChange = vi.fn();
        const from = new Date(2025, 5, 15, 14, 30, 0);
        render(
            <DateTimeRangePicker
                value={{ from, to: undefined }}
                onChange={onChange}
                timeFormat={`24h`}
            />
        );
        const inputs = screen.getAllByPlaceholderText(`yyyy-MM-dd HH:mm`);
        const endInput = inputs[1];
        fireEvent.change(endInput, { target: { value: `2025-06-20 16:00` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        expect(call.to.getDate()).toBe(20);
        expect(call.to.getHours()).toBe(16);
    });

    it(`reverts end input on invalid date string`, () => {
        const from = new Date(2025, 5, 15, 14, 30, 0);
        const to = new Date(2025, 5, 20, 16, 0, 0);
        render(
            <DateTimeRangePicker
                value={{ from, to }}
                timeFormat={`24h`}
            />
        );
        const endInput = screen.getByDisplayValue(`2025-06-20 16:00`);
        fireEvent.change(endInput, { target: { value: `not-a-date` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));
        expect(endInput).toHaveValue(`2025-06-20 16:00`);
    });
});

// ---------------------------------------------------------------------------
// QA-5: Drag cancel on month navigation
// ---------------------------------------------------------------------------

describe(`DateTimeRangePicker drag cancel on month navigation`, () => {
    it(`cancels drag when month is changed during drag`, () => {
        const onChange = vi.fn();
        openCalendarWithRange(
            new Date(2025, 5, 10),
            new Date(2025, 5, 15),
            onChange
        );

        onChange.mockClear();

        // Start a drag on the end marker
        act(() => {
            fireEvent.pointerDown(findDaySpan(`data-range-end`), { button: 0 });
        });

        // Simulate month navigation by clicking the forward button
        const nextMonthBtn = body().querySelector(
            `[data-slot="calendar"] button[name="next-month"]`
        );
        if (nextMonthBtn) {
            act(() => {
                fireEvent.click(nextMonthBtn);
            });
        }

        // The drag should be cancelled — no onChange from drag
        const dragCalls = onChange.mock.calls.filter((c) => {
            const arg = c[0] as { from: Date; to: Date };
            return arg.from && arg.to;
        });
        expect(dragCalls).toHaveLength(0);
    });
});

// ---------------------------------------------------------------------------
// QA-8: Single-day range drag behavior
// ---------------------------------------------------------------------------

describe(`DateTimeRangePicker single-day range drag`, () => {
    it(`extends end when dragging a single-day range`, () => {
        const onChange = vi.fn();
        const sameDay = new Date(2025, 5, 15, 10, 0, 0);
        openCalendarWithRange(sameDay, new Date(sameDay), onChange);

        // The single-day range has both range_start and range_end on the same button
        // Dragging should default to extending the end
        simulateDrag(`data-range-end`, 20);

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        expect(call.from.getDate()).toBe(15);
        expect(call.to.getDate()).toBe(20);
    });

    it(`allows dragging single-day range to an earlier date`, () => {
        const onChange = vi.fn();
        const sameDay = new Date(2025, 5, 15, 10, 0, 0);
        openCalendarWithRange(sameDay, new Date(sameDay), onChange);

        // Drag end to before the start — should auto-swap
        simulateDrag(`data-range-start`, 10);

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        // Auto-swapped: 10 < 15 so from=10, to=15
        expect(call.from.getDate()).toBe(10);
        expect(call.to.getDate()).toBe(15);
    });
});

// ---------------------------------------------------------------------------
// QA-2: TZDate wrapping in range picker
// ---------------------------------------------------------------------------

describe(`DateTimeRangePicker timezone wrapping`, () => {
    it(`wraps onChange dates as TZDate when timeZone is set`, () => {
        const onChange = vi.fn();
        render(
            <DateTimeRangePicker
                onChange={onChange}
                timeFormat={`24h`}
                timeZone={`America/New_York`}
            />
        );
        const inputs = screen.getAllByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(inputs[0], { target: { value: `2025-06-15 14:30` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[0][0] as { from: Date; to: Date | undefined };
        expect(call.from).toBeInstanceOf(TZDate);
    });

    it(`does not wrap as TZDate when no timeZone is set`, () => {
        const onChange = vi.fn();
        render(
            <DateTimeRangePicker onChange={onChange} timeFormat={`24h`} />
        );
        const inputs = screen.getAllByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(inputs[0], { target: { value: `2025-06-15 14:30` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        expect(onChange).toHaveBeenCalled();
        const call = onChange.mock.calls[0][0] as { from: Date; to: Date | undefined };
        expect(call.from.constructor.name).toBe(`Date`);
    });
});

// ---------------------------------------------------------------------------
// QA-3: Controlled value sync in range picker
// ---------------------------------------------------------------------------

describe(`DateTimeRangePicker controlled value sync`, () => {
    it(`updates inputs when controlled value changes externally`, () => {
        const { rerender } = render(
            <DateTimeRangePicker
                value={{
                    from: new Date(2025, 5, 10, 14, 0, 0),
                    to: new Date(2025, 5, 15, 16, 0, 0)
                }}
                timeFormat={`24h`}
            />
        );
        expect(screen.getByDisplayValue(`2025-06-10 14:00`)).toBeInTheDocument();
        expect(screen.getByDisplayValue(`2025-06-15 16:00`)).toBeInTheDocument();

        rerender(
            <DateTimeRangePicker
                value={{
                    from: new Date(2025, 7, 1, 9, 0, 0),
                    to: new Date(2025, 7, 10, 17, 0, 0)
                }}
                timeFormat={`24h`}
            />
        );
        expect(screen.getByDisplayValue(`2025-08-01 09:00`)).toBeInTheDocument();
        expect(screen.getByDisplayValue(`2025-08-10 17:00`)).toBeInTheDocument();
    });

    it(`clears dirty state when controlled value changes`, () => {
        const { rerender } = render(
            <DateTimeRangePicker
                value={{
                    from: new Date(2025, 5, 10, 14, 0, 0),
                    to: new Date(2025, 5, 15, 16, 0, 0)
                }}
                timeFormat={`24h`}
            />
        );
        // Make start input dirty
        const startInput = screen.getByDisplayValue(`2025-06-10 14:00`);
        fireEvent.change(startInput, { target: { value: `2025-06-10 14:01` } });
        expect(screen.getByLabelText(`Confirm date input`)).toBeInTheDocument();

        // External value change should clear dirty state
        rerender(
            <DateTimeRangePicker
                value={{
                    from: new Date(2025, 7, 1, 9, 0, 0),
                    to: new Date(2025, 7, 10, 17, 0, 0)
                }}
                timeFormat={`24h`}
            />
        );
        expect(screen.queryByLabelText(`Confirm date input`)).not.toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// QA-4: Full workflow integration tests for range picker
// ---------------------------------------------------------------------------

describe(`DateTimeRangePicker full workflow`, () => {
    it(`type start → confirm → type end → confirm → verify complete range`, () => {
        const onChange = vi.fn();
        render(
            <DateTimeRangePicker onChange={onChange} timeFormat={`24h`} />
        );

        const inputs = screen.getAllByPlaceholderText(`yyyy-MM-dd HH:mm`);
        const startInput = inputs[0];
        const endInput = inputs[1];

        // Step 1: Type start date and confirm
        fireEvent.change(startInput, { target: { value: `2025-06-10 09:00` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        expect(onChange).toHaveBeenCalledTimes(1);
        const firstCall = onChange.mock.calls[0][0] as {
            from: Date;
            to: Date | undefined;
        };
        expect(firstCall.from.getFullYear()).toBe(2025);
        expect(firstCall.from.getMonth()).toBe(5);
        expect(firstCall.from.getDate()).toBe(10);
        expect(firstCall.from.getHours()).toBe(9);
        expect(firstCall.from.getMinutes()).toBe(0);
        expect(firstCall.to).toBeUndefined();

        // Step 2: Type end date and confirm
        fireEvent.change(endInput, { target: { value: `2025-06-20 17:30` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        expect(onChange).toHaveBeenCalledTimes(2);
        const secondCall = onChange.mock.calls[1][0] as {
            from: Date;
            to: Date;
        };
        expect(secondCall.to.getDate()).toBe(20);
        expect(secondCall.to.getHours()).toBe(17);
        expect(secondCall.to.getMinutes()).toBe(30);
    });
});

// ---------------------------------------------------------------------------
// QA-13: Stronger onChange assertions
// ---------------------------------------------------------------------------

describe(`DateTimeRangePicker onChange assertions`, () => {
    it(`fully validates onChange shape for start input confirmation`, () => {
        const onChange = vi.fn();
        render(<DateTimeRangePicker onChange={onChange} timeFormat={`24h`} />);
        const inputs = screen.getAllByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(inputs[0], { target: { value: `2025-06-15 14:30` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        expect(onChange).toHaveBeenCalledTimes(1);
        const call = onChange.mock.calls[0][0] as {
            from: Date | undefined;
            to: Date | undefined;
        };
        // Verify full shape — both from and to keys exist
        expect(call).toHaveProperty(`from`);
        expect(call).toHaveProperty(`to`);
        expect(call.from).toBeInstanceOf(Date);
        expect(call.from!.getFullYear()).toBe(2025);
        expect(call.from!.getMonth()).toBe(5);
        expect(call.from!.getDate()).toBe(15);
        expect(call.from!.getHours()).toBe(14);
        expect(call.from!.getMinutes()).toBe(30);
        expect(call.from!.getSeconds()).toBe(0);
        expect(call.to).toBeUndefined();
    });

    it(`fully validates drag onChange with preserved times`, () => {
        const from = new Date(2025, 5, 10, 8, 15, 30);
        const to = new Date(2025, 5, 15, 22, 45, 10);
        const onChange = vi.fn();
        openCalendarWithRange(from, to, onChange);

        simulateDrag(`data-range-end`, 25);

        const call = onChange.mock.calls[onChange.mock.calls.length - 1][0] as {
            from: Date;
            to: Date;
        };
        // Verify from is completely preserved
        expect(call.from.getFullYear()).toBe(2025);
        expect(call.from.getMonth()).toBe(5);
        expect(call.from.getDate()).toBe(10);
        expect(call.from.getHours()).toBe(8);
        expect(call.from.getMinutes()).toBe(15);
        expect(call.from.getSeconds()).toBe(30);
        // Verify to date changed but time preserved
        expect(call.to.getDate()).toBe(25);
        expect(call.to.getHours()).toBe(22);
        expect(call.to.getMinutes()).toBe(45);
        expect(call.to.getSeconds()).toBe(10);
    });
});

// ---------------------------------------------------------------------------
// QA-12: Range picker accessibility
// ---------------------------------------------------------------------------

describe(`DateTimeRangePicker accessibility`, () => {
    it(`has aria-labels on both inputs`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} />);
        expect(screen.getByLabelText(`Start date and time`)).toBeInTheDocument();
        expect(screen.getByLabelText(`End date and time`)).toBeInTheDocument();
    });

    it(`has aria-labels on both calendar buttons`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} />);
        const calendarButtons = screen.getAllByLabelText(`Open calendar`);
        expect(calendarButtons).toHaveLength(2);
    });

    it(`has listbox roles for time columns in popover`, () => {
        render(<DateTimeRangePicker timeFormat={`24h`} showSeconds={true} />);
        const calendarButtons = screen.getAllByLabelText(`Open calendar`);
        fireEvent.click(calendarButtons[0]);
        // Should have two hours listboxes (start + end), two minutes, two seconds
        const hoursBoxes = screen.getAllByRole(`listbox`, { name: `Hours` });
        const minutesBoxes = screen.getAllByRole(`listbox`, { name: `Minutes` });
        const secondsBoxes = screen.getAllByRole(`listbox`, { name: `Seconds` });
        expect(hoursBoxes.length).toBeGreaterThanOrEqual(2);
        expect(minutesBoxes.length).toBeGreaterThanOrEqual(2);
        expect(secondsBoxes.length).toBeGreaterThanOrEqual(2);
    });

    // ---- Duration display ----------------------------------------------------

    it(`does not show duration text by default`, () => {
        const from = new Date(2025, 1, 10);
        const to = new Date(2025, 1, 15);
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from, to }}
            />
        );
        expect(screen.queryByText(/day/)).not.toBeInTheDocument();
    });

    it(`shows duration text when showDuration is true and range is complete`, () => {
        const from = new Date(2025, 1, 10);
        const to = new Date(2025, 1, 15);
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from, to }}
                showDuration={true}
            />
        );
        // Feb 10–15: 5 nights, 6 days
        expect(screen.getByText(`6 days, 5 nights`)).toBeInTheDocument();
    });

    it(`does not show duration when range is incomplete`, () => {
        const from = new Date(2025, 1, 10);
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from, to: undefined }}
                showDuration={true}
            />
        );
        expect(screen.queryByText(/day/)).not.toBeInTheDocument();
    });

    it(`shows correct singular for same-day range`, () => {
        const day = new Date(2025, 1, 10);
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from: day, to: day }}
                showDuration={true}
            />
        );
        // Same day: 0 nights, 1 day
        expect(screen.getByText(`1 day, 0 nights`)).toBeInTheDocument();
    });

    it(`shows correct duration for single-night range`, () => {
        const from = new Date(2025, 1, 10);
        const to = new Date(2025, 1, 11);
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from, to }}
                showDuration={true}
            />
        );
        // Feb 10–11: 1 night, 2 days
        expect(screen.getByText(`2 days, 1 night`)).toBeInTheDocument();
    });

    // ---- Duration edge cases -------------------------------------------------

    it(`handles leap year correctly (Feb 28 to Mar 1, 2024)`, () => {
        // 2024 is a leap year, so Feb has 29 days
        const from = new Date(2024, 1, 28); // Feb 28, 2024
        const to = new Date(2024, 2, 1);    // Mar 1, 2024
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from, to }}
                showDuration={true}
            />
        );
        // Feb 28, Feb 29, Mar 1 = 3 days, 2 nights
        expect(screen.getByText(`3 days, 2 nights`)).toBeInTheDocument();
    });

    it(`handles non-leap year correctly (Feb 28 to Mar 1, 2023)`, () => {
        // 2023 is not a leap year
        const from = new Date(2023, 1, 28); // Feb 28, 2023
        const to = new Date(2023, 2, 1);    // Mar 1, 2023
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from, to }}
                showDuration={true}
            />
        );
        // Feb 28, Mar 1 = 2 days, 1 night
        expect(screen.getByText(`2 days, 1 night`)).toBeInTheDocument();
    });

    it(`handles large multi-year ranges`, () => {
        const from = new Date(2020, 0, 1);  // Jan 1, 2020
        const to = new Date(2025, 0, 1);    // Jan 1, 2025
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from, to }}
                showDuration={true}
            />
        );
        // 5 years spanning 2020-2024 (leap years: 2020, 2024)
        // Days: 366+365+365+365+366 = 1827 nights, 1828 days (includes both endpoints)
        expect(screen.getByText(`1828 days, 1827 nights`)).toBeInTheDocument();
    });

    it(`ignores time components in duration calculation`, () => {
        // Times are different but days should be the same
        const from = new Date(2025, 1, 10, 23, 59, 59, 999);
        const to = new Date(2025, 1, 12, 0, 0, 0, 1);
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from, to }}
                showDuration={true}
            />
        );
        // Feb 10, 11, 12 = 3 days, 2 nights (time stripped to midnight)
        expect(screen.getByText(`3 days, 2 nights`)).toBeInTheDocument();
    });

    it(`handles reversed dates (returns null for negative duration)`, () => {
        const from = new Date(2025, 1, 15);
        const to = new Date(2025, 1, 10);  // Before from
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from, to }}
                showDuration={true}
            />
        );
        // Negative duration should not display
        expect(screen.queryByText(/day/)).not.toBeInTheDocument();
    });

    it(`handles DST spring forward (US Eastern Mar 9, 2025)`, () => {
        // US Eastern DST starts Mar 9, 2025 at 2:00 AM
        // From Mar 8 to Mar 10 crosses DST boundary
        const from = new Date(2025, 2, 8);  // Mar 8, 2025
        const to = new Date(2025, 2, 10);   // Mar 10, 2025
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from, to }}
                showDuration={true}
            />
        );
        // Mar 8, 9, 10 = 3 days, 2 nights (regardless of DST)
        expect(screen.getByText(`3 days, 2 nights`)).toBeInTheDocument();
    });

    it(`handles DST fall back (US Eastern Nov 2, 2025)`, () => {
        // US Eastern DST ends Nov 2, 2025 at 2:00 AM
        const from = new Date(2025, 10, 1);  // Nov 1, 2025
        const to = new Date(2025, 10, 3);    // Nov 3, 2025
        render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from, to }}
                showDuration={true}
            />
        );
        // Nov 1, 2, 3 = 3 days, 2 nights (regardless of DST)
        expect(screen.getByText(`3 days, 2 nights`)).toBeInTheDocument();
    });

    // ---- Controlled mode duration update -------------------------------------

    it(`updates duration immediately when controlled value changes`, () => {
        const { rerender } = render(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from: new Date(2025, 1, 10), to: new Date(2025, 1, 12) }}
                showDuration={true}
            />
        );
        expect(screen.getByText(`3 days, 2 nights`)).toBeInTheDocument();

        // Update to a different range
        rerender(
            <DateTimeRangePicker
                timeFormat={`24h`}
                value={{ from: new Date(2025, 1, 10), to: new Date(2025, 1, 15) }}
                showDuration={true}
            />
        );
        expect(screen.getByText(`6 days, 5 nights`)).toBeInTheDocument();
    });
});
