# shadcn Date Time Picker

A date and time picker component built on [shadcn/ui](https://ui.shadcn.com/), [react-day-picker](https://daypicker.dev/), and Tailwind CSS 4.

## Installation

```bash
npx shadcn@latest add https://shadcn-date-time-picker.paularmstrong.dev/r/date-time-picker.json
```

> **Note:** This component requires a modified `Calendar` component that exports `CalendarDayButton`, adds a `disableFuture` prop, and includes a year picker. The standard shadcn calendar is installed as a dependency but must include these modifications. See the source in `src/components/ui/calendar.tsx` for the full implementation.

## Features

- Single date-time picker and range picker
- 12-hour and 24-hour time format
- Optional seconds display
- Timezone selector with searchable dropdown
- Drag-to-resize range selection (grab range endpoints to resize)
- Disable future dates
- Time picker layout options (below or beside calendar)
- Fully controlled or uncontrolled usage
- Custom placeholders
- Disabled state
- Dark mode support
- Keyboard-accessible text input with validation

## Usage

### Single Date Time Picker

```tsx
import { DateTimePicker } from "@/registry/new-york/date-time-picker/date-time-picker";

<DateTimePicker
    timeFormat="24h"
    showSeconds={false}
    onChange={(date) => console.log(date)}
/>
```

### Range Date Time Picker

```tsx
import { DateTimeRangePicker } from "@/registry/new-york/date-time-picker/date-time-range-picker";

<DateTimeRangePicker
    timeFormat="24h"
    onChange={(range) => console.log(range.from, range.to)}
/>
```

### Controlled

```tsx
const [date, setDate] = useState<Date | undefined>(undefined);

<DateTimePicker value={date} onChange={setDate} timeFormat="24h" />
```

### With Timezone

```tsx
const [tz, setTz] = useState("UTC");

<DateTimePicker
    timeFormat="24h"
    showTimezone
    timeZone={tz}
    onTimezoneChange={setTz}
/>
```

## Props

### DateTimePicker

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date` | — | Controlled date value |
| `defaultValue` | `Date` | — | Initial date (uncontrolled) |
| `onChange` | `(date: Date \| undefined) => void` | — | Change callback |
| `timeFormat` | `"12h" \| "24h"` | Locale | Time display format |
| `showSeconds` | `boolean` | `false` | Show seconds column |
| `showTimezone` | `boolean` | `false` | Show timezone selector |
| `timeZone` | `string` | — | IANA timezone string |
| `onTimezoneChange` | `(tz: string) => void` | — | Timezone change callback |
| `timeLayout` | `"below" \| "beside"` | `"below"` | Time picker position |
| `placeholder` | `string` | Auto-generated | Input placeholder |
| `disabled` | `boolean` | `false` | Disable the picker |
| `disableFuture` | `boolean` | `false` | Prevent future dates |

### DateTimeRangePicker

Same props as `DateTimePicker` except:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `DateTimeRange` | — | Controlled range value |
| `defaultValue` | `DateTimeRange` | — | Initial range (uncontrolled) |
| `onChange` | `(range: DateTimeRange) => void` | — | Change callback |
| `startPlaceholder` | `string` | Auto-generated | Start input placeholder |
| `endPlaceholder` | `string` | Auto-generated | End input placeholder |

## Development

```bash
pnpm install
pnpm dev        # Start dev server
pnpm test       # Run tests
pnpm build      # Production build
pnpm lint       # Lint
pnpm registry:build  # Build shadcn registry JSON
```

## Deployment

```bash
cp .env.example .env
# Edit .env with your values
bash build.sh   # Build Docker image
```

The Docker image uses [feoco](https://github.com/pektin-dns/feoco) as a static file server with strict Content Security Policy headers configured in `server/config.yml`. The config file is mounted at runtime via `docker-compose.yaml`.
