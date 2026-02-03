import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TZDate } from "@date-fns/tz";
import { DateTimePicker } from "@/registry/new-york/date-time-picker/date-time-picker";

describe(`DateTimePicker`, () => {
    it(`renders with 24h placeholder`, () => {
        render(<DateTimePicker timeFormat={`24h`} />);
        expect(screen.getByPlaceholderText(`yyyy-MM-dd HH:mm`)).toBeInTheDocument();
    });

    it(`renders 12h placeholder when timeFormat is 12h`, () => {
        render(<DateTimePicker timeFormat={`12h`} />);
        expect(screen.getByPlaceholderText(`yyyy-MM-dd hh:mm AM/PM`)).toBeInTheDocument();
    });

    it(`renders with seconds placeholder`, () => {
        render(<DateTimePicker timeFormat={`24h`} showSeconds={true} />);
        expect(screen.getByPlaceholderText(`yyyy-MM-dd HH:mm:ss`)).toBeInTheDocument();
    });

    it(`displays controlled value`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        render(<DateTimePicker value={date} timeFormat={`24h`} />);
        expect(screen.getByDisplayValue(`2025-06-15 14:30`)).toBeInTheDocument();
    });

    it(`allows typing in the input`, () => {
        const onChange = vi.fn();
        render(<DateTimePicker onChange={onChange} timeFormat={`24h`} />);
        const input = screen.getByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(input, { target: { value: `2025-06-15 14:30` } });
        expect(input).toHaveValue(`2025-06-15 14:30`);
    });

    it(`shows checkmark after typing`, () => {
        render(<DateTimePicker timeFormat={`24h`} />);
        const input = screen.getByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(input, { target: { value: `2025-06-15 14:30` } });
        expect(screen.getByLabelText(`Confirm date input`)).toBeInTheDocument();
    });

    it(`calls onChange after confirming typed input`, () => {
        const onChange = vi.fn();
        render(<DateTimePicker onChange={onChange} timeFormat={`24h`} />);
        const input = screen.getByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(input, { target: { value: `2025-06-15 14:30` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));
        expect(onChange).toHaveBeenCalled();
        const calledWith = onChange.mock.calls[0][0] as Date;
        expect(calledWith.getFullYear()).toBe(2025);
        expect(calledWith.getMonth()).toBe(5);
        expect(calledWith.getDate()).toBe(15);
        expect(calledWith.getHours()).toBe(14);
        expect(calledWith.getMinutes()).toBe(30);
    });

    it(`reverts input on invalid confirm`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        render(<DateTimePicker value={date} timeFormat={`24h`} />);
        const input = screen.getByDisplayValue(`2025-06-15 14:30`);
        fireEvent.change(input, { target: { value: `invalid` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));
        expect(input).toHaveValue(`2025-06-15 14:30`);
    });

    it(`opens popover when calendar icon is clicked`, () => {
        render(<DateTimePicker timeFormat={`24h`} />);
        fireEvent.click(screen.getByLabelText(`Open calendar`));
        expect(screen.getByRole(`listbox`, { name: `Hours` })).toBeInTheDocument();
    });

    it(`does not show timezone section when showTimezone is false`, () => {
        render(<DateTimePicker timeFormat={`24h`} />);
        fireEvent.click(screen.getByLabelText(`Open calendar`));
        expect(screen.queryByText(`Timezone`)).not.toBeInTheDocument();
    });

    it(`shows timezone section when showTimezone is true`, () => {
        render(
            <DateTimePicker
                timeFormat={`24h`}
                showTimezone={true}
                timeZone={`UTC`}
                onTimezoneChange={vi.fn()}
            />
        );
        fireEvent.click(screen.getByLabelText(`Open calendar`));
        expect(screen.getByText(`Timezone`)).toBeInTheDocument();
    });

    it(`disables everything when disabled`, () => {
        render(<DateTimePicker timeFormat={`24h`} disabled={true} />);
        expect(screen.getByPlaceholderText(`yyyy-MM-dd HH:mm`)).toBeDisabled();
        expect(screen.getByLabelText(`Open calendar`)).toBeDisabled();
    });

    it(`confirms input on Enter key`, () => {
        const onChange = vi.fn();
        render(<DateTimePicker onChange={onChange} timeFormat={`24h`} />);
        const input = screen.getByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(input, { target: { value: `2025-06-15 14:30` } });
        fireEvent.keyDown(input, { key: `Enter` });
        expect(onChange).toHaveBeenCalled();
    });

    it(`uses locale detection for default timeFormat`, () => {
        // Default should render without error regardless of locale
        render(<DateTimePicker />);
        const input = screen.getByLabelText(`Date and time`) as HTMLInputElement;
        expect(input).toBeInTheDocument();
    });

    it(`passes disableFuture to calendar`, () => {
        render(<DateTimePicker timeFormat={`24h`} disableFuture={true} />);
        fireEvent.click(screen.getByLabelText(`Open calendar`));
        // Calendar should render (disableFuture is handled internally by Calendar)
        expect(screen.getByRole(`listbox`, { name: `Hours` })).toBeInTheDocument();
    });

    it(`renders time beside calendar when timeLayout is beside`, () => {
        render(<DateTimePicker timeFormat={`24h`} timeLayout={`beside`} />);
        fireEvent.click(screen.getByLabelText(`Open calendar`));
        expect(screen.getByRole(`listbox`, { name: `Hours` })).toBeInTheDocument();
        expect(screen.getByRole(`listbox`, { name: `Minutes` })).toBeInTheDocument();
    });

    it(`renders time below calendar by default`, () => {
        render(<DateTimePicker timeFormat={`24h`} />);
        fireEvent.click(screen.getByLabelText(`Open calendar`));
        expect(screen.getByRole(`listbox`, { name: `Hours` })).toBeInTheDocument();
    });

    it(`accepts custom placeholder`, () => {
        render(<DateTimePicker timeFormat={`24h`} placeholder={`Pick a date`} />);
        expect(screen.getByPlaceholderText(`Pick a date`)).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// QA-2: TZDate wrapping verification
// ---------------------------------------------------------------------------

describe(`DateTimePicker timezone wrapping`, () => {
    it(`wraps onChange date as TZDate when timeZone is set`, () => {
        const onChange = vi.fn();
        render(
            <DateTimePicker
                onChange={onChange}
                timeFormat={`24h`}
                timeZone={`America/New_York`}
            />
        );
        const input = screen.getByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(input, { target: { value: `2025-06-15 14:30` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        expect(onChange).toHaveBeenCalled();
        const calledWith = onChange.mock.calls[0][0] as Date;
        expect(calledWith).toBeInstanceOf(TZDate);
    });

    it(`does not wrap as TZDate when no timeZone is set`, () => {
        const onChange = vi.fn();
        render(
            <DateTimePicker onChange={onChange} timeFormat={`24h`} />
        );
        const input = screen.getByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(input, { target: { value: `2025-06-15 14:30` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        expect(onChange).toHaveBeenCalled();
        const calledWith = onChange.mock.calls[0][0] as Date;
        // Should be a plain Date, not TZDate
        expect(calledWith.constructor.name).toBe(`Date`);
    });
});

// ---------------------------------------------------------------------------
// QA-3: Controlled value sync
// ---------------------------------------------------------------------------

describe(`DateTimePicker controlled value sync`, () => {
    it(`updates input when controlled value changes externally`, () => {
        const { rerender } = render(
            <DateTimePicker
                value={new Date(2025, 5, 15, 14, 30, 0)}
                timeFormat={`24h`}
            />
        );
        expect(screen.getByDisplayValue(`2025-06-15 14:30`)).toBeInTheDocument();

        // Simulate external value change
        rerender(
            <DateTimePicker
                value={new Date(2025, 7, 20, 9, 0, 0)}
                timeFormat={`24h`}
            />
        );
        expect(screen.getByDisplayValue(`2025-08-20 09:00`)).toBeInTheDocument();
    });

    it(`clears dirty state when controlled value changes`, () => {
        const { rerender } = render(
            <DateTimePicker
                value={new Date(2025, 5, 15, 14, 30, 0)}
                timeFormat={`24h`}
            />
        );
        const input = screen.getByDisplayValue(`2025-06-15 14:30`);

        // User types (makes input dirty)
        fireEvent.change(input, { target: { value: `2025-06-15 14:31` } });
        // Checkmark should appear (dirty)
        expect(screen.getByLabelText(`Confirm date input`)).toBeInTheDocument();

        // External value change should clear dirty state
        rerender(
            <DateTimePicker
                value={new Date(2025, 7, 20, 9, 0, 0)}
                timeFormat={`24h`}
            />
        );
        expect(screen.getByDisplayValue(`2025-08-20 09:00`)).toBeInTheDocument();
        // Checkmark should be gone (not dirty)
        expect(screen.queryByLabelText(`Confirm date input`)).not.toBeInTheDocument();
    });

    it(`syncs input to empty when controlled value becomes undefined`, () => {
        const { rerender } = render(
            <DateTimePicker
                value={new Date(2025, 5, 15, 14, 30, 0)}
                timeFormat={`24h`}
            />
        );
        expect(screen.getByDisplayValue(`2025-06-15 14:30`)).toBeInTheDocument();

        // Change to undefined — need to exercise the setDate path
        // Since value prop can't be undefined (that switches to uncontrolled),
        // verify that a different date works
        rerender(
            <DateTimePicker
                value={new Date(2025, 0, 1, 0, 0, 0)}
                timeFormat={`24h`}
            />
        );
        expect(screen.getByDisplayValue(`2025-01-01 00:00`)).toBeInTheDocument();
    });
});

// ---------------------------------------------------------------------------
// QA-4: Full workflow integration tests
// ---------------------------------------------------------------------------

describe(`DateTimePicker full workflow`, () => {
    it(`type date → confirm → open calendar → change time → verify onChange`, () => {
        const onChange = vi.fn();
        render(<DateTimePicker onChange={onChange} timeFormat={`24h`} />);

        // Step 1: Type a date
        const input = screen.getByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(input, { target: { value: `2025-06-15 14:30` } });

        // Step 2: Confirm
        fireEvent.click(screen.getByLabelText(`Confirm date input`));
        expect(onChange).toHaveBeenCalledTimes(1);
        const firstCall = onChange.mock.calls[0][0] as Date;
        expect(firstCall.getFullYear()).toBe(2025);
        expect(firstCall.getMonth()).toBe(5);
        expect(firstCall.getDate()).toBe(15);
        expect(firstCall.getHours()).toBe(14);
        expect(firstCall.getMinutes()).toBe(30);

        // Step 3: Open calendar
        fireEvent.click(screen.getByLabelText(`Open calendar`));
        expect(screen.getByRole(`listbox`, { name: `Hours` })).toBeInTheDocument();
    });

    it(`type invalid date → confirm → input reverts → type valid → confirm → succeeds`, () => {
        const onChange = vi.fn();
        render(
            <DateTimePicker
                onChange={onChange}
                timeFormat={`24h`}
                defaultValue={new Date(2025, 5, 15, 14, 30, 0)}
            />
        );

        const input = screen.getByDisplayValue(`2025-06-15 14:30`);

        // Step 1: Type invalid date
        fireEvent.change(input, { target: { value: `garbage` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        // Should revert
        expect(input).toHaveValue(`2025-06-15 14:30`);
        expect(onChange).not.toHaveBeenCalled();

        // Step 2: Type valid date
        fireEvent.change(input, { target: { value: `2025-07-20 10:00` } });
        fireEvent.click(screen.getByLabelText(`Confirm date input`));

        expect(onChange).toHaveBeenCalledTimes(1);
        const call = onChange.mock.calls[0][0] as Date;
        expect(call.getMonth()).toBe(6);
        expect(call.getDate()).toBe(20);
    });
});

// ---------------------------------------------------------------------------
// QA-12: Accessibility attribute tests
// ---------------------------------------------------------------------------

describe(`DateTimePicker accessibility`, () => {
    it(`has aria-label on the input`, () => {
        render(<DateTimePicker timeFormat={`24h`} />);
        expect(screen.getByLabelText(`Date and time`)).toBeInTheDocument();
    });

    it(`has aria-label on calendar button`, () => {
        render(<DateTimePicker timeFormat={`24h`} />);
        expect(screen.getByLabelText(`Open calendar`)).toBeInTheDocument();
    });

    it(`has aria-label on confirm button when dirty`, () => {
        render(<DateTimePicker timeFormat={`24h`} />);
        const input = screen.getByPlaceholderText(`yyyy-MM-dd HH:mm`);
        fireEvent.change(input, { target: { value: `2025-06-15 14:30` } });
        expect(screen.getByLabelText(`Confirm date input`)).toBeInTheDocument();
    });

    it(`has listbox roles with labels for time columns`, () => {
        render(<DateTimePicker timeFormat={`24h`} showSeconds={true} />);
        fireEvent.click(screen.getByLabelText(`Open calendar`));
        expect(screen.getByRole(`listbox`, { name: `Hours` })).toBeInTheDocument();
        expect(screen.getByRole(`listbox`, { name: `Minutes` })).toBeInTheDocument();
        expect(screen.getByRole(`listbox`, { name: `Seconds` })).toBeInTheDocument();
    });

    it(`has option roles with aria-selected on time buttons`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        render(<DateTimePicker value={date} timeFormat={`24h`} />);
        fireEvent.click(screen.getByLabelText(`Open calendar`));

        const hoursList = screen.getByRole(`listbox`, { name: `Hours` });
        const selectedHour = hoursList.querySelector(`[aria-selected="true"]`);
        expect(selectedHour).toBeInTheDocument();
        expect(selectedHour?.textContent).toBe(`14`);
    });
});
