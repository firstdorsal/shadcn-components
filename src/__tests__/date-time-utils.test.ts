import { describe, expect, it } from "vitest";
import {
    formatDateTime,
    getFormatString,
    getPlaceholder,
    parseDateTimeString
} from "@/lib/date-time-utils";

describe(`getFormatString`, () => {
    it(`returns 24h format without seconds`, () => {
        expect(getFormatString({ timeFormat: `24h`, showSeconds: false })).toBe(
            `yyyy-MM-dd HH:mm`
        );
    });

    it(`returns 24h format with seconds`, () => {
        expect(getFormatString({ timeFormat: `24h`, showSeconds: true })).toBe(
            `yyyy-MM-dd HH:mm:ss`
        );
    });

    it(`returns 12h format without seconds`, () => {
        expect(getFormatString({ timeFormat: `12h`, showSeconds: false })).toBe(
            `yyyy-MM-dd hh:mm a`
        );
    });

    it(`returns 12h format with seconds`, () => {
        expect(getFormatString({ timeFormat: `12h`, showSeconds: true })).toBe(
            `yyyy-MM-dd hh:mm:ss a`
        );
    });
});

describe(`getPlaceholder`, () => {
    it(`returns 24h placeholder without seconds`, () => {
        expect(getPlaceholder({ timeFormat: `24h`, showSeconds: false })).toBe(
            `yyyy-MM-dd HH:mm`
        );
    });

    it(`returns 24h placeholder with seconds`, () => {
        expect(getPlaceholder({ timeFormat: `24h`, showSeconds: true })).toBe(
            `yyyy-MM-dd HH:mm:ss`
        );
    });

    it(`returns 12h placeholder without seconds`, () => {
        expect(getPlaceholder({ timeFormat: `12h`, showSeconds: false })).toBe(
            `yyyy-MM-dd hh:mm AM/PM`
        );
    });

    it(`returns 12h placeholder with seconds`, () => {
        expect(getPlaceholder({ timeFormat: `12h`, showSeconds: true })).toBe(
            `yyyy-MM-dd hh:mm:ss AM/PM`
        );
    });
});

describe(`parseDateTimeString`, () => {
    const ref = new Date(2025, 0, 1);

    it(`parses a valid 24h string`, () => {
        const result = parseDateTimeString(
            `2025-06-15 14:30`,
            { timeFormat: `24h`, showSeconds: false },
            ref
        );
        expect(result).not.toBeNull();
        expect(result!.getFullYear()).toBe(2025);
        expect(result!.getMonth()).toBe(5);
        expect(result!.getDate()).toBe(15);
        expect(result!.getHours()).toBe(14);
        expect(result!.getMinutes()).toBe(30);
    });

    it(`parses a valid 24h string with seconds`, () => {
        const result = parseDateTimeString(
            `2025-06-15 14:30:45`,
            { timeFormat: `24h`, showSeconds: true },
            ref
        );
        expect(result).not.toBeNull();
        expect(result!.getSeconds()).toBe(45);
    });

    it(`parses a valid 12h string`, () => {
        const result = parseDateTimeString(
            `2025-06-15 02:30 PM`,
            { timeFormat: `12h`, showSeconds: false },
            ref
        );
        expect(result).not.toBeNull();
        expect(result!.getHours()).toBe(14);
        expect(result!.getMinutes()).toBe(30);
    });

    it(`parses a valid 12h string with seconds`, () => {
        const result = parseDateTimeString(
            `2025-06-15 02:30:45 AM`,
            { timeFormat: `12h`, showSeconds: true },
            ref
        );
        expect(result).not.toBeNull();
        expect(result!.getHours()).toBe(2);
        expect(result!.getMinutes()).toBe(30);
        expect(result!.getSeconds()).toBe(45);
    });

    it(`returns null for invalid string`, () => {
        const result = parseDateTimeString(
            `not-a-date`,
            { timeFormat: `24h`, showSeconds: false },
            ref
        );
        expect(result).toBeNull();
    });

    it(`returns null for mismatched format`, () => {
        const result = parseDateTimeString(
            `2025-06-15 02:30 PM`,
            { timeFormat: `24h`, showSeconds: false },
            ref
        );
        expect(result).toBeNull();
    });

    it(`trims whitespace`, () => {
        const result = parseDateTimeString(
            `  2025-06-15 14:30  `,
            { timeFormat: `24h`, showSeconds: false },
            ref
        );
        expect(result).not.toBeNull();
    });
});

describe(`formatDateTime`, () => {
    it(`formats in 24h without seconds`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 45);
        const result = formatDateTime(date, {
            timeFormat: `24h`,
            showSeconds: false
        });
        expect(result).toBe(`2025-06-15 14:30`);
    });

    it(`formats in 24h with seconds`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 45);
        const result = formatDateTime(date, {
            timeFormat: `24h`,
            showSeconds: true
        });
        expect(result).toBe(`2025-06-15 14:30:45`);
    });

    it(`formats in 12h without seconds`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 45);
        const result = formatDateTime(date, {
            timeFormat: `12h`,
            showSeconds: false
        });
        expect(result).toBe(`2025-06-15 02:30 PM`);
    });

    it(`formats in 12h with seconds`, () => {
        const date = new Date(2025, 5, 15, 14, 30, 45);
        const result = formatDateTime(date, {
            timeFormat: `12h`,
            showSeconds: true
        });
        expect(result).toBe(`2025-06-15 02:30:45 PM`);
    });

    it(`formats midnight correctly in 12h`, () => {
        const date = new Date(2025, 0, 1, 0, 0, 0);
        const result = formatDateTime(date, {
            timeFormat: `12h`,
            showSeconds: false
        });
        expect(result).toBe(`2025-01-01 12:00 AM`);
    });

    it(`formats noon correctly in 12h`, () => {
        const date = new Date(2025, 0, 1, 12, 0, 0);
        const result = formatDateTime(date, {
            timeFormat: `12h`,
            showSeconds: false
        });
        expect(result).toBe(`2025-01-01 12:00 PM`);
    });
});
