import * as React from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { AlertTriangle, Github, Menu, Moon, Sun, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HotkeyInput, type Hotkey, formatHotkey } from "@/components/ui/hotkey-input";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { DateTimeRangePicker } from "@/components/ui/date-time-range-picker";
import type { DateTimeRange } from "@/hooks/use-date-time-range-picker";

// ---------------------------------------------------------------------------
// Navigation items
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
    { path: `/`, label: `Getting Started` },
    { path: `/date-time-picker`, label: `Date Time Picker` },
    { path: `/date-time-range-picker`, label: `Date Time Range Picker` },
    { path: `/hotkey-input`, label: `Hotkey Input` },
] as const;

// ---------------------------------------------------------------------------
// ErrorBoundary
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
                        <Button variant={`outline`} onClick={() => window.location.reload()}>
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
// Layout Components
// ---------------------------------------------------------------------------

const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className={`space-y-1`}>
        <div className={`mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground`}>
            Components
        </div>
        {NAV_ITEMS.map((item) => (
            <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                    cn(
                        `block rounded-md px-3 py-2 text-sm transition-colors`,
                        isActive
                            ? `bg-accent text-accent-foreground font-medium`
                            : `text-muted-foreground hover:bg-accent/50 hover:text-foreground`
                    )
                }
            >
                {item.label}
            </NavLink>
        ))}
    </nav>
);

const DemoSection = ({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) => (
    <section className={`rounded-lg border bg-card p-6 shadow-sm`}>
        <h2 className={`mb-1 text-lg font-semibold`}>{title}</h2>
        {description && <p className={`text-muted-foreground mb-4 text-sm`}>{description}</p>}
        <div>{children}</div>
    </section>
);

const PropTag = ({ children }: { children: React.ReactNode }) => (
    <span className={`text-muted-foreground mt-2 inline-block rounded-md bg-muted px-2 py-0.5 font-mono text-xs`}>
        {children}
    </span>
);

const StateDisplay = ({ label, value }: { label: string; value: string }) => (
    <div className={`mt-3`}>
        <div className={`text-muted-foreground mb-1 text-xs font-medium`}>{label}</div>
        <div className={`text-muted-foreground rounded-md bg-muted px-3 py-2 font-mono text-xs break-all whitespace-pre-wrap`}>
            {value}
        </div>
    </div>
);

const CodeBlock = ({ children }: { children: string }) => (
    <div className={`rounded-md bg-muted px-4 py-3 font-mono text-xs overflow-x-auto`}>
        <code>{children}</code>
    </div>
);

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

const GettingStartedPage = () => (
    <div className={`space-y-6`}>
        <div>
            <h1 className={`text-3xl font-bold tracking-tight`}>Components</h1>
            <p className={`mt-2 text-muted-foreground`}>
                A collection of components built with shadcn/ui, react-day-picker, and Tailwind CSS.
            </p>
            <p className={`mt-4 text-sm text-muted-foreground`}>
                Select a component from the sidebar to view its documentation and installation instructions.
            </p>
        </div>
    </div>
);

const DateTimePickerPage = () => {
    const [controlledDate, setControlledDate] = React.useState<Date | undefined>(undefined);
    const [timezone, setTimezone] = React.useState(`UTC`);
    const [disabledDemoDate] = React.useState(() => new Date());

    return (
        <div className={`space-y-6`}>
            <div>
                <h1 className={`text-3xl font-bold tracking-tight`}>Date Time Picker</h1>
                <p className={`mt-2 text-muted-foreground`}>
                    A date and time picker with calendar popover, timezone support, and configurable time format.
                </p>
            </div>

            <DemoSection title={`Installation`}>
                <CodeBlock>pnpm dlx shadcn@latest add https://firstdorsal.github.io/shadcn-components/r/date-time-picker.json</CodeBlock>
            </DemoSection>

            <DemoSection title={`Basic Usage`} description={`Default date-time picker with 24-hour format.`}>
                <DateTimePicker timeFormat={`24h`} />
                <PropTag>{`timeFormat="24h"`}</PropTag>
            </DemoSection>

            <DemoSection title={`Time Formats`} description={`12-hour and 24-hour time display.`}>
                <div className={`grid gap-6 sm:grid-cols-2`}>
                    <div>
                        <div className={`text-muted-foreground mb-2 text-xs font-medium`}>12-hour</div>
                        <DateTimePicker timeFormat={`12h`} />
                        <PropTag>{`timeFormat="12h"`}</PropTag>
                    </div>
                    <div>
                        <div className={`text-muted-foreground mb-2 text-xs font-medium`}>24-hour</div>
                        <DateTimePicker timeFormat={`24h`} />
                        <PropTag>{`timeFormat="24h"`}</PropTag>
                    </div>
                </div>
            </DemoSection>

            <DemoSection title={`With Seconds`} description={`Optional seconds display for precise time selection.`}>
                <DateTimePicker timeFormat={`24h`} showSeconds={true} />
                <PropTag>{`showSeconds={true}`}</PropTag>
            </DemoSection>

            <DemoSection title={`Timezone Support`} description={`Built-in timezone selector.`}>
                <DateTimePicker
                    timeFormat={`24h`}
                    showTimezone={true}
                    timeZone={timezone}
                    onTimezoneChange={setTimezone}
                />
                <PropTag>{`showTimezone timeZone="${timezone}"`}</PropTag>
            </DemoSection>

            <DemoSection title={`Disable Future Dates`} description={`Prevent selecting dates in the future.`}>
                <DateTimePicker timeFormat={`24h`} disableFuture={true} />
                <PropTag>disableFuture</PropTag>
            </DemoSection>

            <DemoSection title={`Layout Options`} description={`Time picker placement relative to the calendar.`}>
                <div className={`grid gap-6 sm:grid-cols-2`}>
                    <div>
                        <div className={`text-muted-foreground mb-2 text-xs font-medium`}>Time below</div>
                        <DateTimePicker timeFormat={`24h`} timeLayout={`below`} />
                        <PropTag>{`timeLayout="below"`}</PropTag>
                    </div>
                    <div>
                        <div className={`text-muted-foreground mb-2 text-xs font-medium`}>Time beside</div>
                        <DateTimePicker timeFormat={`24h`} timeLayout={`beside`} />
                        <PropTag>{`timeLayout="beside"`}</PropTag>
                    </div>
                </div>
            </DemoSection>

            <DemoSection title={`Controlled`} description={`Fully controlled via value/onChange.`}>
                <DateTimePicker value={controlledDate} onChange={setControlledDate} timeFormat={`24h`} />
                <StateDisplay label={`State`} value={controlledDate ? controlledDate.toISOString() : `undefined`} />
                <div className={`mt-2 flex gap-2`}>
                    <Button variant={`outline`} size={`sm`} onClick={() => setControlledDate(new Date())}>
                        Set to now
                    </Button>
                    <Button variant={`outline`} size={`sm`} onClick={() => setControlledDate(undefined)}>
                        Clear
                    </Button>
                </div>
            </DemoSection>

            <DemoSection title={`Disabled`} description={`Disabled state.`}>
                <DateTimePicker timeFormat={`24h`} disabled={true} defaultValue={disabledDemoDate} />
                <PropTag>disabled</PropTag>
            </DemoSection>
        </div>
    );
};

const DateTimeRangePickerPage = () => {
    const [controlledRange, setControlledRange] = React.useState<DateTimeRange>({
        from: undefined,
        to: undefined,
    });
    const [timezone, setTimezone] = React.useState(`UTC`);
    const [disabledDemoRange] = React.useState(() => {
        const now = new Date();
        return { from: now, to: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) };
    });

    return (
        <div className={`space-y-6`}>
            <div>
                <h1 className={`text-3xl font-bold tracking-tight`}>Date Time Range Picker</h1>
                <p className={`mt-2 text-muted-foreground`}>
                    Select a date range with drag-to-resize functionality and duration display.
                </p>
            </div>

            <DemoSection title={`Installation`}>
                <CodeBlock>pnpm dlx shadcn@latest add https://firstdorsal.github.io/shadcn-components/r/date-time-picker.json</CodeBlock>
            </DemoSection>

            <DemoSection title={`Basic Usage`} description={`Default range picker with drag support.`}>
                <DateTimeRangePicker timeFormat={`24h`} />
            </DemoSection>

            <DemoSection title={`Duration Display`} description={`Show the number of days and nights.`}>
                <DateTimeRangePicker timeFormat={`24h`} showDuration={true} />
                <PropTag>showDuration</PropTag>
            </DemoSection>

            <DemoSection title={`With Timezone`} description={`Timezone selector for range picker.`}>
                <DateTimeRangePicker
                    timeFormat={`24h`}
                    showTimezone={true}
                    timeZone={timezone}
                    onTimezoneChange={setTimezone}
                />
                <PropTag>{`showTimezone timeZone="${timezone}"`}</PropTag>
            </DemoSection>

            <DemoSection title={`Disable Future`} description={`Prevent selecting future dates.`}>
                <DateTimeRangePicker timeFormat={`24h`} disableFuture={true} />
                <PropTag>disableFuture</PropTag>
            </DemoSection>

            <DemoSection title={`Custom Placeholders`} description={`Override default placeholder text.`}>
                <DateTimeRangePicker timeFormat={`24h`} startPlaceholder={`Check-in`} endPlaceholder={`Check-out`} />
                <PropTag>{`startPlaceholder="Check-in" endPlaceholder="Check-out"`}</PropTag>
            </DemoSection>

            <DemoSection title={`Controlled`} description={`Fully controlled via value/onChange.`}>
                <DateTimeRangePicker value={controlledRange} onChange={setControlledRange} timeFormat={`24h`} />
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
                                to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                            })
                        }
                    >
                        Set week
                    </Button>
                    <Button
                        variant={`outline`}
                        size={`sm`}
                        onClick={() => setControlledRange({ from: undefined, to: undefined })}
                    >
                        Clear
                    </Button>
                </div>
            </DemoSection>

            <DemoSection title={`Disabled`} description={`Disabled state.`}>
                <DateTimeRangePicker timeFormat={`24h`} disabled={true} defaultValue={disabledDemoRange} />
                <PropTag>disabled</PropTag>
            </DemoSection>
        </div>
    );
};

const HotkeyInputPage = () => {
    const [hotkey, setHotkey] = React.useState<Hotkey | null>(null);

    return (
        <div className={`space-y-6`}>
            <div>
                <h1 className={`text-3xl font-bold tracking-tight`}>Hotkey Input</h1>
                <p className={`mt-2 text-muted-foreground`}>
                    A keyboard shortcut input component for capturing key combinations.
                </p>
            </div>

            <DemoSection title={`Installation`}>
                <CodeBlock>pnpm dlx shadcn@latest add https://firstdorsal.github.io/shadcn-components/r/hotkey-input.json</CodeBlock>
            </DemoSection>

            <DemoSection title={`Basic Usage`} description={`Click and press a key combination to capture it.`}>
                <HotkeyInput value={hotkey} onChange={setHotkey} placeholder={`Press a key combination...`} />
                <StateDisplay label={`Captured Hotkey`} value={hotkey ? formatHotkey(hotkey) : `None`} />
            </DemoSection>

            <DemoSection title={`Allow Modifier Only`} description={`Capture modifier-only shortcuts like Ctrl+Shift.`}>
                <HotkeyInput allowModifierOnly={true} placeholder={`Try Ctrl+Shift...`} />
                <PropTag>allowModifierOnly</PropTag>
            </DemoSection>

            <DemoSection title={`Disabled`} description={`Disabled state.`}>
                <HotkeyInput
                    disabled={true}
                    defaultValue={{
                        key: `k`,
                        code: `KeyK`,
                        ctrlKey: true,
                        shiftKey: false,
                        altKey: false,
                        metaKey: false,
                    }}
                />
                <PropTag>disabled</PropTag>
            </DemoSection>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Main Layout
// ---------------------------------------------------------------------------

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isDark, setIsDark] = React.useState(() => document.documentElement.classList.contains(`dark`));
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const toggleDarkMode = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle(`dark`, next);
    };

    return (
        <div className={`min-h-screen bg-background text-foreground overflow-x-hidden`}>
            {/* Header */}
            <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
                <div className={`flex h-14 items-center justify-between px-4 lg:px-6`}>
                    <div className={`flex items-center gap-4`}>
                        <Button
                            variant={`ghost`}
                            size={`icon`}
                            className={`lg:hidden`}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label={`Toggle menu`}
                        >
                            {sidebarOpen ? <X className={`h-5 w-5`} /> : <Menu className={`h-5 w-5`} />}
                        </Button>
                        <h1 className={`text-lg font-bold tracking-tight`}>firstdorsal/shadcn-components</h1>
                    </div>
                    <div className={`flex items-center gap-1`}>
                        <a
                            href={`https://github.com/firstdorsal/shadcn-components`}
                            target={`_blank`}
                            rel={`noopener noreferrer`}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors`}
                            aria-label={`GitHub repository`}
                        >
                            <Github className={`h-5 w-5`} />
                        </a>
                        <Button variant={`ghost`} size={`icon`} onClick={toggleDarkMode} aria-label={`Toggle dark mode`}>
                            {isDark ? <Sun className={`h-5 w-5`} /> : <Moon className={`h-5 w-5`} />}
                        </Button>
                    </div>
                </div>
            </header>

            <div className={`flex`}>
                {/* Sidebar - Desktop */}
                <aside className={`hidden lg:block w-64 shrink-0 border-r`}>
                    <div className={`sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 px-4`}>
                        <Sidebar />
                    </div>
                </aside>

                {/* Sidebar - Mobile */}
                {sidebarOpen && (
                    <div className={`fixed inset-0 top-14 z-40 lg:hidden`}>
                        <div className={`absolute inset-0 bg-background/80 backdrop-blur-sm`} onClick={() => setSidebarOpen(false)} />
                        <aside className={`relative w-64 h-full border-r bg-background p-4 overflow-y-auto`}>
                            <Sidebar onNavigate={() => setSidebarOpen(false)} />
                        </aside>
                    </div>
                )}

                {/* Main Content */}
                <main className={`flex-1 min-w-0 overflow-x-hidden`}>
                    <div className={`max-w-3xl mx-auto px-4 py-8 lg:px-8`}>{children}</div>
                </main>
            </div>

            {/* Footer */}
            <footer className={`border-t py-6 text-center`}>
                <p className={`text-muted-foreground text-sm`}>
                    Built with shadcn/ui, react-day-picker, and Tailwind CSS.
                </p>
            </footer>
        </div>
    );
};

// ---------------------------------------------------------------------------
// App with Router
// ---------------------------------------------------------------------------

const App = () => (
    <BrowserRouter basename={`/shadcn-components`}>
        <ErrorBoundary>
            <Layout>
                <Routes>
                    <Route path={`/`} element={<GettingStartedPage />} />
                    <Route path={`/date-time-picker`} element={<DateTimePickerPage />} />
                    <Route path={`/date-time-range-picker`} element={<DateTimeRangePickerPage />} />
                    <Route path={`/hotkey-input`} element={<HotkeyInputPage />} />
                    <Route path={`*`} element={<Navigate to={`/`} replace />} />
                </Routes>
            </Layout>
        </ErrorBoundary>
    </BrowserRouter>
);

export default App;
