import { describe, expect, it, beforeEach } from "vitest";
import {
    clearTimezoneCache,
    getTimezoneOptions
} from "@/registry/new-york/date-time-picker/lib/timezone-utils";

describe(`getTimezoneOptions`, () => {
    beforeEach(() => {
        clearTimezoneCache();
    });

    it(`returns a non-empty array`, () => {
        const options = getTimezoneOptions();
        expect(options.length).toBeGreaterThan(0);
    });

    it(`includes common timezones`, () => {
        const options = getTimezoneOptions();
        const values = options.map((o) => o.value);
        expect(values).toContain(`America/New_York`);
        expect(values).toContain(`Europe/London`);
        expect(values).toContain(`Asia/Tokyo`);
    });

    it(`returns options sorted by offset`, () => {
        const options = getTimezoneOptions();
        for (let i = 1; i < options.length; i++) {
            expect(options[i].offsetMinutes).toBeGreaterThanOrEqual(
                options[i - 1].offsetMinutes
            );
        }
    });

    it(`each option has the expected shape`, () => {
        const options = getTimezoneOptions();
        const first = options[0];
        expect(first).toHaveProperty(`value`);
        expect(first).toHaveProperty(`label`);
        expect(first).toHaveProperty(`offset`);
        expect(first).toHaveProperty(`offsetMinutes`);
        expect(first.label).toContain(`UTC`);
    });

    it(`recalculates when referenceDate changes across days`, () => {
        const summer = new Date(2024, 6, 15); // July 15 (DST in northern hemisphere)
        const winter = new Date(2024, 0, 15); // Jan 15 (no DST)

        const summerOptions = getTimezoneOptions(summer);
        const nyOptionSummer = summerOptions.find((o) => o.value === `America/New_York`);

        clearTimezoneCache();

        const winterOptions = getTimezoneOptions(winter);
        const nyOptionWinter = winterOptions.find((o) => o.value === `America/New_York`);

        // New York is UTC-4 in summer (EDT) and UTC-5 in winter (EST)
        expect(nyOptionSummer).toBeDefined();
        expect(nyOptionWinter).toBeDefined();
        expect(nyOptionSummer!.offsetMinutes).not.toBe(nyOptionWinter!.offsetMinutes);
    });

    it(`uses cache for same-day calls`, () => {
        const date = new Date(2024, 6, 15);
        const first = getTimezoneOptions(date);
        const second = getTimezoneOptions(date);
        expect(first).toBe(second); // Same reference = cached
    });
});
