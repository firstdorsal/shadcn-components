# @firstdorsal/shadcn-components

A production-ready shadcn component registry with date-time picker, hotkey input, and enhanced calendar components.

**Live Demo:** [firstdorsal.github.io/shadcn-components](https://firstdorsal.github.io/shadcn-components)

## Installation

Install components directly via the shadcn CLI:

```bash
# Date Time Picker (includes range picker and enhanced calendar)
pnpm dlx shadcn@latest add https://firstdorsal.github.io/shadcn-components/r/date-time-picker.json

# Hotkey Input
pnpm dlx shadcn@latest add https://firstdorsal.github.io/shadcn-components/r/hotkey-input.json

# Enhanced Calendar (standalone)
pnpm dlx shadcn@latest add https://firstdorsal.github.io/shadcn-components/r/calendar.json
```

## Components

### Date Time Picker

A full-featured date and time picker with calendar popover, timezone support, and keyboard-accessible input.

#### Features

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

#### Usage

```tsx
import { DateTimePicker } from "@/registry/new-york/date-time-picker/date-time-picker"

// Basic usage
<DateTimePicker
  timeFormat="24h"
  showSeconds={false}
  onChange={(date) => console.log(date)}
/>

// Controlled with timezone
const [date, setDate] = useState<Date | undefined>(undefined)
const [tz, setTz] = useState("UTC")

<DateTimePicker
  value={date}
  onChange={setDate}
  timeFormat="24h"
  showTimezone
  timeZone={tz}
  onTimezoneChange={setTz}
/>
```

#### Range Picker

```tsx
import { DateTimeRangePicker } from "@/registry/new-york/date-time-picker/date-time-range-picker"

<DateTimeRangePicker
  timeFormat="24h"
  onChange={(range) => console.log(range.from, range.to)}
/>
```

#### Props

##### DateTimePicker

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

##### DateTimeRangePicker

Same props as `DateTimePicker` except:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `DateTimeRange` | — | Controlled range value |
| `defaultValue` | `DateTimeRange` | — | Initial range (uncontrolled) |
| `onChange` | `(range: DateTimeRange) => void` | — | Change callback |
| `startPlaceholder` | `string` | Auto-generated | Start input placeholder |
| `endPlaceholder` | `string` | Auto-generated | End input placeholder |

---

### Hotkey Input

A keyboard shortcut input component for capturing key combinations.

#### Features

- Captures key combinations with modifier keys (Ctrl, Alt, Shift, Meta)
- Displays formatted hotkey (e.g., "Ctrl + Shift + K")
- Optional modifier-only mode
- Controlled and uncontrolled modes
- Clear button
- Disabled state

#### Usage

```tsx
import { HotkeyInput, type Hotkey } from "@/components/ui/hotkey-input"

// Uncontrolled
<HotkeyInput
  onChange={(hotkey) => console.log(hotkey)}
  placeholder="Press a key combination..."
/>

// Controlled
const [hotkey, setHotkey] = useState<Hotkey | null>(null)

<HotkeyInput
  value={hotkey}
  onChange={setHotkey}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Hotkey \| null` | — | Controlled hotkey value |
| `defaultValue` | `Hotkey \| null` | `null` | Initial hotkey (uncontrolled) |
| `onChange` | `(hotkey: Hotkey \| null) => void` | — | Change callback |
| `disabled` | `boolean` | `false` | Disable the input |
| `placeholder` | `string` | `"Press a key combination..."` | Placeholder text |
| `allowModifierOnly` | `boolean` | `false` | Allow modifier-only shortcuts |
| `className` | `string` | — | Additional CSS classes |

#### Hotkey Type

```typescript
interface Hotkey {
  key: string       // The key pressed (e.g., "k", "Enter")
  code: string      // The key code (e.g., "KeyK", "Enter")
  ctrlKey: boolean  // Ctrl modifier
  shiftKey: boolean // Shift modifier
  altKey: boolean   // Alt modifier
  metaKey: boolean  // Meta (Cmd/Win) modifier
}
```

#### Utilities

```tsx
import { formatHotkey, hotkeyEquals } from "@/components/ui/hotkey-input"

// Format hotkey for display
formatHotkey(hotkey) // "Ctrl + Shift + K"

// Compare hotkeys
hotkeyEquals(hotkey1, hotkey2) // true/false
```

---

### Enhanced Calendar

An extended shadcn calendar with year picker and future date restriction.

#### Features

- Clickable year in caption opens year picker
- Year picker with decade navigation
- `disableFuture` prop to prevent future date selection
- All standard react-day-picker features

#### Usage

```tsx
import { Calendar } from "@/components/ui/calendar"

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  disableFuture
/>
```

#### Additional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disableFuture` | `boolean` | `false` | Disable future dates |
| `buttonVariant` | `ButtonVariant` | `"ghost"` | Navigation button variant |

---

## Development

```bash
pnpm install
pnpm dev          # Start dev server on port 5174
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm typecheck    # Type check
pnpm lint         # Lint
pnpm build        # Build demo + registry
```

## Deployment

Deployed automatically to GitHub Pages on push to `main` branch via GitHub Actions.

## License

MIT
