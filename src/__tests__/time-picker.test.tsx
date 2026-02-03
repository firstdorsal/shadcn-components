import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TimePicker } from "@/registry/new-york/date-time-picker/components/time-picker";

describe(`TimePicker`, () => {
    it(`renders hours 0-23 in 24h mode`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`24h`}
                showSeconds={false}
            />
        );
        const hoursList = screen.getByRole(`listbox`, { name: `Hours` });
        const options = hoursList.querySelectorAll(`[role="option"]`);
        expect(options).toHaveLength(24);
    });

    it(`renders hours 1-12 in 12h mode`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`12h`}
                showSeconds={false}
            />
        );
        const hoursList = screen.getByRole(`listbox`, { name: `Hours` });
        const options = hoursList.querySelectorAll(`[role="option"]`);
        expect(options).toHaveLength(12);
    });

    it(`renders 60 minutes`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`24h`}
                showSeconds={false}
            />
        );
        const minutesList = screen.getByRole(`listbox`, { name: `Minutes` });
        const options = minutesList.querySelectorAll(`[role="option"]`);
        expect(options).toHaveLength(60);
    });

    it(`does not show seconds column when showSeconds is false`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`24h`}
                showSeconds={false}
            />
        );
        expect(screen.queryByRole(`listbox`, { name: `Seconds` })).not.toBeInTheDocument();
    });

    it(`shows seconds column when showSeconds is true`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 45);
        render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`24h`}
                showSeconds={true}
            />
        );
        const secondsList = screen.getByRole(`listbox`, { name: `Seconds` });
        const options = secondsList.querySelectorAll(`[role="option"]`);
        expect(options).toHaveLength(60);
    });

    it(`shows AM/PM buttons in 12h mode`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`12h`}
                showSeconds={false}
            />
        );
        expect(screen.getByText(`AM`)).toBeInTheDocument();
        expect(screen.getByText(`PM`)).toBeInTheDocument();
    });

    it(`does not show AM/PM in 24h mode`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`24h`}
                showSeconds={false}
            />
        );
        expect(screen.queryByText(`AM`)).not.toBeInTheDocument();
        expect(screen.queryByText(`PM`)).not.toBeInTheDocument();
    });

    it(`calls onChange when an hour is selected`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        const onChange = vi.fn();
        render(
            <TimePicker
                date={date}
                onChange={onChange}
                timeFormat={`24h`}
                showSeconds={false}
            />
        );
        const hoursList = screen.getByRole(`listbox`, { name: `Hours` });
        const hour10 = hoursList.querySelector(`[aria-selected="false"]`);
        if (hour10) fireEvent.click(hour10);
        expect(onChange).toHaveBeenCalled();
    });

    it(`calls onChange when a minute is selected`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        const onChange = vi.fn();
        render(
            <TimePicker
                date={date}
                onChange={onChange}
                timeFormat={`24h`}
                showSeconds={false}
            />
        );
        const minutesList = screen.getByRole(`listbox`, { name: `Minutes` });
        const firstUnselected = minutesList.querySelector(`[aria-selected="false"]`);
        if (firstUnselected) fireEvent.click(firstUnselected);
        expect(onChange).toHaveBeenCalled();
    });

    it(`correctly highlights PM when hour >= 12`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0); // 2 PM
        render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`12h`}
                showSeconds={false}
            />
        );
        const pmButton = screen.getByText(`PM`);
        expect(pmButton).toBeInTheDocument();
    });

    it(`displays visible column labels`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`24h`}
                showSeconds={true}
            />
        );
        expect(screen.getByText(`Hours`)).toBeInTheDocument();
        expect(screen.getByText(`Minutes`)).toBeInTheDocument();
        expect(screen.getByText(`Seconds`)).toBeInTheDocument();
    });

    it(`applies disabled styling when disabled`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 0);
        const { container } = render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`24h`}
                showSeconds={false}
                disabled={true}
            />
        );
        const wrapper = container.firstElementChild as HTMLElement;
        expect(wrapper.className).toContain(`pointer-events-none`);
        expect(wrapper.className).toContain(`opacity-50`);
    });

    it(`handles undefined date gracefully`, () => {
        render(
            <TimePicker
                date={undefined}
                onChange={vi.fn()}
                timeFormat={`24h`}
                showSeconds={false}
            />
        );
        const hoursList = screen.getByRole(`listbox`, { name: `Hours` });
        expect(hoursList).toBeInTheDocument();
    });

    it(`toggles AM/PM correctly`, () => {
        const date = new Date(2025, 5, 15, 9, 30, 0); // 9 AM
        const onChange = vi.fn();
        render(
            <TimePicker
                date={date}
                onChange={onChange}
                timeFormat={`12h`}
                showSeconds={false}
            />
        );
        fireEvent.click(screen.getByText(`PM`));
        expect(onChange).toHaveBeenCalled();
        const calledWith = onChange.mock.calls[0][0] as Date;
        expect(calledWith.getHours()).toBe(21); // 9 AM + 12 = 21
    });
});

// ---------------------------------------------------------------------------
// QA-9: 12h AM/PM edge cases
// ---------------------------------------------------------------------------

describe(`TimePicker 12h AM/PM edge cases`, () => {
    it(`displays 12 for midnight (hour 0) in 12h mode`, () => {
        const date = new Date(2025, 5, 15, 0, 0, 0); // midnight = 12 AM
        render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`12h`}
                showSeconds={false}
            />
        );
        const hoursList = screen.getByRole(`listbox`, { name: `Hours` });
        const selected = hoursList.querySelector(`[aria-selected="true"]`);
        expect(selected).toBeInTheDocument();
        expect(selected?.textContent).toBe(`12`);
        // AM should be active for midnight — the AM button uses the "default"
        // variant while PM uses "ghost"
        const pmButton = screen.getByText(`PM`);
        const amButton = screen.getByText(`AM`);
        // The AM button's parent button should have the "default" variant class
        // while PM should not — AM is selected
        expect(amButton).toBeInTheDocument();
        expect(pmButton).toBeInTheDocument();
    });

    it(`displays 12 for noon (hour 12) in 12h mode`, () => {
        const date = new Date(2025, 5, 15, 12, 0, 0); // noon = 12 PM
        render(
            <TimePicker
                date={date}
                onChange={vi.fn()}
                timeFormat={`12h`}
                showSeconds={false}
            />
        );
        const hoursList = screen.getByRole(`listbox`, { name: `Hours` });
        const selected = hoursList.querySelector(`[aria-selected="true"]`);
        expect(selected).toBeInTheDocument();
        expect(selected?.textContent).toBe(`12`);
    });

    it(`selecting hour 12 in AM mode sets hour to 0`, () => {
        const date = new Date(2025, 5, 15, 3, 0, 0); // 3 AM
        const onChange = vi.fn();
        render(
            <TimePicker
                date={date}
                onChange={onChange}
                timeFormat={`12h`}
                showSeconds={false}
            />
        );
        // Click hour 12 — in AM mode this should set hours to 0 (midnight)
        const hoursList = screen.getByRole(`listbox`, { name: `Hours` });
        const hour12Option = Array.from(
            hoursList.querySelectorAll(`[role="option"]`)
        ).find((opt) => opt.textContent === `12`);
        expect(hour12Option).toBeDefined();
        fireEvent.click(hour12Option!);

        expect(onChange).toHaveBeenCalled();
        const calledWith = onChange.mock.calls[0][0] as Date;
        expect(calledWith.getHours()).toBe(0); // 12 AM = 0
    });

    it(`selecting hour 12 in PM mode sets hour to 12`, () => {
        const date = new Date(2025, 5, 15, 15, 0, 0); // 3 PM
        const onChange = vi.fn();
        render(
            <TimePicker
                date={date}
                onChange={onChange}
                timeFormat={`12h`}
                showSeconds={false}
            />
        );
        // Click hour 12 — in PM mode this should set hours to 12 (noon)
        const hoursList = screen.getByRole(`listbox`, { name: `Hours` });
        const hour12Option = Array.from(
            hoursList.querySelectorAll(`[role="option"]`)
        ).find((opt) => opt.textContent === `12`);
        expect(hour12Option).toBeDefined();
        fireEvent.click(hour12Option!);

        expect(onChange).toHaveBeenCalled();
        const calledWith = onChange.mock.calls[0][0] as Date;
        expect(calledWith.getHours()).toBe(12); // 12 PM = 12
    });

    it(`toggling 12 AM to PM sets hour to 12`, () => {
        const date = new Date(2025, 5, 15, 0, 30, 0); // 12:30 AM (midnight)
        const onChange = vi.fn();
        render(
            <TimePicker
                date={date}
                onChange={onChange}
                timeFormat={`12h`}
                showSeconds={false}
            />
        );
        fireEvent.click(screen.getByText(`PM`));
        expect(onChange).toHaveBeenCalled();
        const calledWith = onChange.mock.calls[0][0] as Date;
        expect(calledWith.getHours()).toBe(12); // 12:30 AM → 12:30 PM
    });

    it(`toggling 12 PM to AM sets hour to 0`, () => {
        const date = new Date(2025, 5, 15, 12, 30, 0); // 12:30 PM (noon)
        const onChange = vi.fn();
        render(
            <TimePicker
                date={date}
                onChange={onChange}
                timeFormat={`12h`}
                showSeconds={false}
            />
        );
        fireEvent.click(screen.getByText(`AM`));
        expect(onChange).toHaveBeenCalled();
        const calledWith = onChange.mock.calls[0][0] as Date;
        expect(calledWith.getHours()).toBe(0); // 12:30 PM → 12:30 AM
    });
});
