# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-08

### Added

- **Date Time Picker**: Full-featured date and time picker with calendar popover
  - 12-hour and 24-hour time format support
  - Optional seconds display
  - Timezone selector with searchable dropdown
  - Keyboard-accessible text input with validation
  - Fully controlled or uncontrolled usage
- **Date Time Range Picker**: Range selection variant
  - Drag-to-resize range endpoints
  - Independent start/end time selection
- **Calendar (Enhanced)**: Extended shadcn calendar
  - Clickable year picker with decade navigation
  - `disableFuture` prop to prevent future date selection
- **Hotkey Input**: Keyboard shortcut capture component
  - Supports modifier keys (Ctrl, Alt, Shift, Meta)
  - Formatted hotkey display
  - Optional modifier-only mode
  - Controlled/uncontrolled modes
