import * as React from "react";
import { AlertTriangle, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/registry/new-york/date-time-picker/date-time-picker";
import { DateTimeRangePicker } from "@/registry/new-york/date-time-picker/date-time-range-picker";
import type { DateTimeRange } from "@/registry/new-york/date-time-picker/hooks/use-date-time-range-picker";

// ---------------------------------------------------------------------------
// ErrorBoundary — catches component errors and displays fallback UI
// ---------------------------------------------------------------------------

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    ErrorBoundaryState
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={`flex min-h-screen items-center justify-center bg-background p-8`}>
                    <div className={`max-w-md rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center`}>
                        <AlertTriangle className={`mx-auto mb-4 h-12 w-12 text-destructive`} />
                        <h1 className={`mb-2 text-xl font-semibold text-destructive`}>
                            Something went wrong
                        </h1>
                        <p className={`mb-4 text-sm text-muted-foreground`}>
                            {this.state.error?.message ?? `An unexpected error occurred`}
                        </p>
                        <Button
                            variant={`outline`}
                            onClick={() => window.location.reload()}
                        >
                            Reload page
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// ---------------------------------------------------------------------------
// DemoSection — reusable card for each showcase
// ---------------------------------------------------------------------------

const DemoSection = ({
    title,
    description,
    children,
    className
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}) => (
    <section className={cn(`rounded-lg border bg-card p-6 shadow-sm`, className)}>
        <h2 className={`mb-1 text-lg font-semibold`}>{title}</h2>
        {description && (
            <p className={`text-muted-foreground mb-4 text-sm`}>{description}</p>
        )}
        {children}
    </section>
);

// ---------------------------------------------------------------------------
// PropTag — small badge showing what prop config is active
// ---------------------------------------------------------------------------

const PropTag = ({ children }: { children: React.ReactNode }) => (
    <span
        className={`text-muted-foreground mt-2 inline-block rounded-md bg-muted px-2 py-0.5 font-mono text-xs`}
    >
        {children}
    </span>
);

// ---------------------------------------------------------------------------
// StateDisplay — shows live JSON state
// ---------------------------------------------------------------------------

const StateDisplay = ({ label, value }: { label: string; value: string }) => (
    <div className={`mt-3`}>
        <div className={`text-muted-foreground mb-1 text-xs font-medium`}>{label}</div>
        <div
            className={`text-muted-foreground rounded-md bg-muted px-3 py-2 font-mono text-xs break-all`}
        >
            {value}
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const App = () => {
    // Dark mode
    const [isDark, setIsDark] = React.useState(() =>
        document.documentElement.classList.contains(`dark`)
    );
    const toggleDarkMode = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle(`dark`, next);
    };

    // Controlled state for "Controlled" section
    const [controlledDate, setControlledDate] = React.useState<Date | undefined>(
        undefined
    );
    const [controlledRange, setControlledRange] = React.useState<DateTimeRange>({
        from: undefined,
        to: undefined
    });

    // Timezone state (shared across demos that use it)
    const [singleTimezone, setSingleTz] = React.useState(`UTC`);
    const [rangeTimezone, setRangeTz] = React.useState(`UTC`);

    // Stable dates for the disabled demo — created once via useState initializer
    const [disabledDemoDate] = React.useState(() => new Date());
    const [disabledDemoRange] = React.useState(() => {
        const now = new Date();
        return {
            from: now,
            to: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
        };
    });

    return (
        <div className={`min-h-screen bg-background text-foreground`}>
            {/* Header */}
            <header
                className={`sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
            >
                <div
                    className={`mx-auto flex max-w-4xl items-center justify-between px-6 py-4`}
                >
                    <div>
                        <h1 className={`text-xl font-bold tracking-tight`}>
                            shadcn Date Time Picker
                        </h1>
                        <p className={`text-muted-foreground text-sm`}>
                            A date &amp; time picker built on shadcn/ui, react-day-picker, and
                            Tailwind CSS 4.
                        </p>
                    </div>
                    <Button
                        variant={`outline`}
                        size={`icon`}
                        onClick={toggleDarkMode}
                        aria-label={`Toggle dark mode`}
                    >
                        {isDark ? <Sun /> : <Moon />}
                    </Button>
                </div>
            </header>

            {/* Content */}
            <main className={`mx-auto max-w-4xl space-y-8 px-6 py-8`}>
                {/* ---------------------------------------------------------- */}
                {/* Getting Started */}
                {/* ---------------------------------------------------------- */}
                <DemoSection title={`Getting Started`}>
                    <div className={`rounded-md bg-muted px-4 py-3 font-mono text-sm`}>
                        npx shadcn@latest add
                        https://shadcn-date-time-picker.paularmstrong.dev/r/date-time-picker.json
                    </div>
                </DemoSection>

                {/* ---------------------------------------------------------- */}
                {/* Basic Usage */}
                {/* ---------------------------------------------------------- */}
                <DemoSection
                    title={`Basic Usage`}
                    description={`Single date-time picker and range picker with default settings.`}
                >
                    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2`}>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Single
                            </div>
                            <DateTimePicker timeFormat={`24h`} />
                            <PropTag>{`timeFormat="24h"`}</PropTag>
                        </div>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Range
                            </div>
                            <DateTimeRangePicker timeFormat={`24h`} />
                            <PropTag>{`timeFormat="24h"`}</PropTag>
                        </div>
                    </div>
                </DemoSection>

                {/* ---------------------------------------------------------- */}
                {/* Time Formats */}
                {/* ---------------------------------------------------------- */}
                <DemoSection
                    title={`Time Formats`}
                    description={`12-hour and 24-hour time display.`}
                >
                    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2`}>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                12-hour
                            </div>
                            <DateTimePicker timeFormat={`12h`} />
                            <PropTag>{`timeFormat="12h"`}</PropTag>
                        </div>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                24-hour
                            </div>
                            <DateTimePicker timeFormat={`24h`} />
                            <PropTag>{`timeFormat="24h"`}</PropTag>
                        </div>
                    </div>
                </DemoSection>

                {/* ---------------------------------------------------------- */}
                {/* Seconds */}
                {/* ---------------------------------------------------------- */}
                <DemoSection
                    title={`Seconds`}
                    description={`Optional seconds display for precise time selection.`}
                >
                    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2`}>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Without seconds
                            </div>
                            <DateTimePicker timeFormat={`24h`} showSeconds={false} />
                            <PropTag>{`showSeconds={false}`}</PropTag>
                        </div>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                With seconds
                            </div>
                            <DateTimePicker timeFormat={`24h`} showSeconds={true} />
                            <PropTag>{`showSeconds={true}`}</PropTag>
                        </div>
                    </div>
                </DemoSection>

                {/* ---------------------------------------------------------- */}
                {/* Timezone Support */}
                {/* ---------------------------------------------------------- */}
                <DemoSection
                    title={`Timezone Support`}
                    description={`Timezone selector for both single and range pickers.`}
                >
                    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2`}>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Single + Timezone
                            </div>
                            <DateTimePicker
                                timeFormat={`24h`}
                                showTimezone={true}
                                timeZone={singleTimezone}
                                onTimezoneChange={setSingleTz}
                            />
                            <PropTag>{`showTimezone timeZone="${singleTimezone}"`}</PropTag>
                        </div>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Range + Timezone
                            </div>
                            <DateTimeRangePicker
                                timeFormat={`24h`}
                                showTimezone={true}
                                timeZone={rangeTimezone}
                                onTimezoneChange={setRangeTz}
                            />
                            <PropTag>{`showTimezone timeZone="${rangeTimezone}"`}</PropTag>
                        </div>
                    </div>
                </DemoSection>

                {/* ---------------------------------------------------------- */}
                {/* Disable Future Dates */}
                {/* ---------------------------------------------------------- */}
                <DemoSection
                    title={`Disable Future Dates`}
                    description={`Prevent selecting dates in the future.`}
                >
                    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2`}>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Single
                            </div>
                            <DateTimePicker
                                timeFormat={`24h`}
                                disableFuture={true}
                            />
                            <PropTag>disableFuture</PropTag>
                        </div>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Range
                            </div>
                            <DateTimeRangePicker
                                timeFormat={`24h`}
                                disableFuture={true}
                            />
                            <PropTag>disableFuture</PropTag>
                        </div>
                    </div>
                </DemoSection>

                {/* ---------------------------------------------------------- */}
                {/* Layout Options */}
                {/* ---------------------------------------------------------- */}
                <DemoSection
                    title={`Layout Options`}
                    description={`Time picker placement relative to the calendar.`}
                >
                    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2`}>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Time below (default)
                            </div>
                            <DateTimePicker
                                timeFormat={`24h`}
                                timeLayout={`below`}
                            />
                            <PropTag>{`timeLayout="below"`}</PropTag>
                        </div>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Time beside
                            </div>
                            <DateTimePicker
                                timeFormat={`24h`}
                                timeLayout={`beside`}
                            />
                            <PropTag>{`timeLayout="beside"`}</PropTag>
                        </div>
                    </div>
                </DemoSection>

                {/* ---------------------------------------------------------- */}
                {/* Draggable Range */}
                {/* ---------------------------------------------------------- */}
                <DemoSection
                    title={`Draggable Range`}
                    description={`Select a range, then drag the start or end marker to resize. Works with both mouse and touch. You can also click-drag to create a new range from scratch.`}
                >
                    <DateTimeRangePicker timeFormat={`24h`} />
                    <PropTag>(drag built-in for range picker)</PropTag>
                </DemoSection>

                {/* ---------------------------------------------------------- */}
                {/* Duration Display */}
                {/* ---------------------------------------------------------- */}
                <DemoSection
                    title={`Duration Display`}
                    description={`Show the number of days and nights below the range inputs.`}
                >
                    <DateTimeRangePicker
                        timeFormat={`24h`}
                        showDuration={true}
                    />
                    <PropTag>showDuration</PropTag>
                </DemoSection>

                {/* ---------------------------------------------------------- */}
                {/* Disabled State */}
                {/* ---------------------------------------------------------- */}
                <DemoSection
                    title={`Disabled State`}
                    description={`Both pickers support a disabled prop.`}
                >
                    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2`}>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Single (disabled)
                            </div>
                            <DateTimePicker
                                timeFormat={`24h`}
                                disabled={true}
                                defaultValue={disabledDemoDate}
                            />
                            <PropTag>disabled</PropTag>
                        </div>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Range (disabled)
                            </div>
                            <DateTimeRangePicker
                                timeFormat={`24h`}
                                disabled={true}
                                defaultValue={disabledDemoRange}
                            />
                            <PropTag>disabled</PropTag>
                        </div>
                    </div>
                </DemoSection>

                {/* ---------------------------------------------------------- */}
                {/* Controlled Values */}
                {/* ---------------------------------------------------------- */}
                <DemoSection
                    title={`Controlled Values`}
                    description={`Fully controlled via value/onChange with live state display and programmatic control.`}
                >
                    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2`}>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Single (controlled)
                            </div>
                            <DateTimePicker
                                value={controlledDate}
                                onChange={setControlledDate}
                                timeFormat={`24h`}
                            />
                            <StateDisplay
                                label={`State`}
                                value={
                                    controlledDate
                                        ? controlledDate.toISOString()
                                        : `undefined`
                                }
                            />
                            <div className={`mt-2 flex gap-2`}>
                                <Button
                                    variant={`outline`}
                                    size={`sm`}
                                    onClick={() => setControlledDate(new Date())}
                                >
                                    Set to now
                                </Button>
                                <Button
                                    variant={`outline`}
                                    size={`sm`}
                                    onClick={() => setControlledDate(undefined)}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Range (controlled)
                            </div>
                            <DateTimeRangePicker
                                value={controlledRange}
                                onChange={setControlledRange}
                                timeFormat={`24h`}
                            />
                            <StateDisplay
                                label={`State`}
                                value={`from: ${controlledRange.from?.toISOString() ?? `undefined`}\nto: ${controlledRange.to?.toISOString() ?? `undefined`}`}
                            />
                            <div className={`mt-2 flex gap-2`}>
                                <Button
                                    variant={`outline`}
                                    size={`sm`}
                                    onClick={() =>
                                        setControlledRange({
                                            from: new Date(),
                                            to: new Date(
                                                Date.now() + 7 * 24 * 60 * 60 * 1000
                                            )
                                        })
                                    }
                                >
                                    Set week
                                </Button>
                                <Button
                                    variant={`outline`}
                                    size={`sm`}
                                    onClick={() =>
                                        setControlledRange({
                                            from: undefined,
                                            to: undefined
                                        })
                                    }
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </div>
                </DemoSection>

                {/* ---------------------------------------------------------- */}
                {/* Custom Placeholders */}
                {/* ---------------------------------------------------------- */}
                <DemoSection
                    title={`Custom Placeholders`}
                    description={`Override default placeholder text on the inputs.`}
                >
                    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2`}>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Single
                            </div>
                            <DateTimePicker
                                timeFormat={`24h`}
                                placeholder={`Pick a date...`}
                            />
                            <PropTag>{`placeholder="Pick a date..."`}</PropTag>
                        </div>
                        <div>
                            <div
                                className={`text-muted-foreground mb-2 text-xs font-medium`}
                            >
                                Range
                            </div>
                            <DateTimeRangePicker
                                timeFormat={`24h`}
                                startPlaceholder={`Check-in`}
                                endPlaceholder={`Check-out`}
                            />
                            <PropTag>
                                {`startPlaceholder="Check-in" endPlaceholder="Check-out"`}
                            </PropTag>
                        </div>
                    </div>
                </DemoSection>
            </main>

            {/* Footer */}
            <footer className={`border-t py-6 text-center`}>
                <p className={`text-muted-foreground text-sm`}>
                    Built with shadcn/ui, react-day-picker, and Tailwind CSS.
                </p>
            </footer>
        </div>
    );
};

const AppWithErrorBoundary = () => (
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);

export default AppWithErrorBoundary;
