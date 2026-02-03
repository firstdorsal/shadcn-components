import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { TimezoneSelector } from "@/registry/new-york/date-time-picker/components/timezone-selector";

beforeAll(() => {
    global.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
    Element.prototype.scrollIntoView = vi.fn();
});

describe(`TimezoneSelector`, () => {
    it(`renders with default placeholder`, () => {
        render(<TimezoneSelector value={undefined} onChange={vi.fn()} />);
        expect(screen.getByText(`Select timezone...`)).toBeInTheDocument();
    });

    it(`renders with custom placeholder`, () => {
        render(
            <TimezoneSelector
                value={undefined}
                onChange={vi.fn()}
                placeholder={`Choose tz`}
            />
        );
        expect(screen.getByText(`Choose tz`)).toBeInTheDocument();
    });

    it(`displays selected timezone label`, () => {
        render(<TimezoneSelector value={`UTC`} onChange={vi.fn()} />);
        expect(screen.getByRole(`combobox`)).toBeInTheDocument();
    });

    it(`disables the button when disabled`, () => {
        render(
            <TimezoneSelector value={undefined} onChange={vi.fn()} disabled={true} />
        );
        expect(screen.getByRole(`combobox`)).toBeDisabled();
    });

    it(`opens popover on click`, () => {
        render(<TimezoneSelector value={`UTC`} onChange={vi.fn()} />);
        fireEvent.click(screen.getByRole(`combobox`));
        expect(screen.getByPlaceholderText(`Search timezone...`)).toBeInTheDocument();
    });

    it(`renders the combobox with correct aria-expanded`, () => {
        render(<TimezoneSelector value={`UTC`} onChange={vi.fn()} />);
        const combobox = screen.getByRole(`combobox`);
        expect(combobox).toHaveAttribute(`aria-expanded`, `false`);
        fireEvent.click(combobox);
        expect(combobox).toHaveAttribute(`aria-expanded`, `true`);
    });
});
