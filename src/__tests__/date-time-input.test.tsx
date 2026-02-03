import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DateTimeInput } from "@/registry/new-york/date-time-picker/components/date-time-input";

describe(`DateTimeInput`, () => {
    const defaultProps = {
        value: `2025-06-15 14:30`,
        onChange: vi.fn(),
        onConfirm: vi.fn(),
        onCalendarClick: vi.fn(),
        isDirty: false
    };

    it(`renders input with value`, () => {
        render(<DateTimeInput {...defaultProps} />);
        const input = screen.getByDisplayValue(`2025-06-15 14:30`);
        expect(input).toBeInTheDocument();
    });

    it(`renders calendar icon button`, () => {
        render(<DateTimeInput {...defaultProps} />);
        const calBtn = screen.getByLabelText(`Open calendar`);
        expect(calBtn).toBeInTheDocument();
    });

    it(`does not show checkmark when not dirty`, () => {
        render(<DateTimeInput {...defaultProps} isDirty={false} />);
        expect(screen.queryByLabelText(`Confirm date input`)).not.toBeInTheDocument();
    });

    it(`shows checkmark when dirty`, () => {
        render(<DateTimeInput {...defaultProps} isDirty={true} />);
        expect(screen.getByLabelText(`Confirm date input`)).toBeInTheDocument();
    });

    it(`calls onChange on input change`, () => {
        const onChange = vi.fn();
        render(<DateTimeInput {...defaultProps} onChange={onChange} />);
        const input = screen.getByDisplayValue(`2025-06-15 14:30`);
        fireEvent.change(input, { target: { value: `2025-06-15 15:00` } });
        expect(onChange).toHaveBeenCalledWith(`2025-06-15 15:00`);
    });

    it(`calls onCalendarClick when calendar icon is clicked`, () => {
        const onCalendarClick = vi.fn();
        render(<DateTimeInput {...defaultProps} onCalendarClick={onCalendarClick} />);
        fireEvent.click(screen.getByLabelText(`Open calendar`));
        expect(onCalendarClick).toHaveBeenCalled();
    });

    it(`calls onConfirm when checkmark is clicked`, () => {
        const onConfirm = vi.fn();
        render(<DateTimeInput {...defaultProps} isDirty={true} onConfirm={onConfirm} />);
        fireEvent.click(screen.getByLabelText(`Confirm date input`));
        expect(onConfirm).toHaveBeenCalled();
    });

    it(`calls onConfirm on Enter key when dirty`, () => {
        const onConfirm = vi.fn();
        render(<DateTimeInput {...defaultProps} isDirty={true} onConfirm={onConfirm} />);
        const input = screen.getByDisplayValue(`2025-06-15 14:30`);
        fireEvent.keyDown(input, { key: `Enter` });
        expect(onConfirm).toHaveBeenCalled();
    });

    it(`does not call onConfirm on Enter key when not dirty`, () => {
        const onConfirm = vi.fn();
        render(<DateTimeInput {...defaultProps} isDirty={false} onConfirm={onConfirm} />);
        const input = screen.getByDisplayValue(`2025-06-15 14:30`);
        fireEvent.keyDown(input, { key: `Enter` });
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it(`renders with placeholder`, () => {
        render(<DateTimeInput {...defaultProps} value={``} placeholder={`Pick a date`} />);
        expect(screen.getByPlaceholderText(`Pick a date`)).toBeInTheDocument();
    });

    it(`disables input and buttons when disabled`, () => {
        render(<DateTimeInput {...defaultProps} isDirty={true} disabled={true} />);
        expect(screen.getByDisplayValue(`2025-06-15 14:30`)).toBeDisabled();
        expect(screen.getByLabelText(`Open calendar`)).toBeDisabled();
        expect(screen.getByLabelText(`Confirm date input`)).toBeDisabled();
    });
});
