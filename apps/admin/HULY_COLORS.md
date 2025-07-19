# Huly Design System Integration

This document explains how the Huly.io Admin Dashboard has been updated to use the official Huly design system colors and components.

## Card Elevation System

The dashboard uses a consistent elevation system for cards and components:

### Card Backgrounds
- **Base cards**: `var(--theme-card-color, #14141F)` - Default card background
- **Elevated cards (on hover)**: `var(--theme-card-elevated-color, #1F1F2C)` - Elevated state
- **Shadows**: 
  - Default: `var(--theme-card-shadow, 0 4px 12px 0 rgba(0, 0, 0, 0.4))`
  - Hover: `var(--theme-card-shadow-hover, 0 6px 20px 0 rgba(0, 0, 0, 0.5))`

### Navigation Colors
- **Active navigation**: Uses `var(--primary-button-default, #2c23d5)` for consistent brand color
- **Sidebar title**: Uses the same primary color with glow effect

## HulyButton Component

The `HulyButton` component supports the following variants:

### Available Variants

- **`primary`** - Main action button
  - Background: `var(--primary-button-default, #2c23d5)`
  - Hover: `var(--primary-button-hover, #1f1ab3)`
  - Text: `var(--primary-button-color, white)`

- **`secondary`** - Secondary action button
  - Background: `transparent`
  - Border: `var(--theme-divider-color, #E5E5E5)`
  - Text: `var(--theme-content-color, #525252)`

- **`tertiary`** - Minimal action button
  - Background: `transparent`
  - Border: `transparent`
  - Text: `var(--theme-content-color, #525252)`

- **`negative`** - Destructive action button
  - Background: `var(--theme-state-negative-color, #CB4B42)`
  - Hover: `var(--theme-state-negative-hover, #B2423A)`
  - Text: `var(--white-color, white)`

## HulyStatus Component

The `HulyStatus` component now uses the official Huly color palette and supports the following variants:

### Available Variants

- **`positive`** - For completed, done, or success states
  - Color: `var(--theme-state-positive-color, #05A05C)`
  - Background: `var(--theme-state-positive-background-color, rgba(5, 160, 92, 0.1))`
  - Border: `var(--theme-state-positive-border-color, rgba(5, 160, 92, 0.15))`

- **`warning`** - For in-progress, active, or warning states
  - Color: `var(--theme-warning-color, #f2994a)`
  - Background: `rgba(242, 153, 74, 0.1)`
  - Border: `rgba(242, 153, 74, 0.15)`

- **`negative`** - For blocked, error, or failure states
  - Color: `var(--theme-state-negative-color, #CB4B42)`
  - Background: `var(--theme-state-negative-background-color, rgba(203, 75, 66, 0.15))`
  - Border: `var(--theme-state-negative-border-color, rgba(203, 75, 66, 0.15))`

- **`primary`** - For default, info, or primary states
  - Color: `var(--theme-state-primary-color, #2c23d5)`
  - Background: `var(--theme-state-primary-background-color, rgba(44, 35, 213, 0.1))`
  - Border: `var(--theme-state-primary-border-color, rgba(44, 35, 213, 0.15))`

- **`regular`** - For neutral states
  - Color: `var(--theme-state-regular-color, #7b7b7b)`
  - Background: `var(--theme-state-regular-background-color, rgba(123, 123, 123, 0.1))`
  - Border: `var(--theme-state-regular-border-color, rgba(123, 123, 123, 0.15))`

- **`ghost`** - For subtle or disabled states
  - Color: `var(--theme-state-ghost-color, rgba(123, 123, 123, 0.6))`
  - Background: `var(--theme-state-ghost-background-color, rgba(123, 123, 123, 0.1))`
  - Border: `var(--theme-state-ghost-border-color, transparent)`

### Usage Examples

```astro
<!-- Auto-mapping based on status text -->
<HulyStatus status="Completed" />      <!-- Maps to positive -->
<HulyStatus status="In Progress" />    <!-- Maps to warning -->
<HulyStatus status="Blocked" />        <!-- Maps to negative -->
<HulyStatus status="New" />            <!-- Maps to primary -->

<!-- Manual variant specification -->
<HulyStatus status="Custom Status" variant="positive" />
<HulyStatus status="Another Status" variant="warning" />
```

## Official Huly Colors

The following CSS variables are now available throughout the application:

### Core Colors
- `--primary-button-default: #2c23d5`
- `--bg-positive-default: #05A05C`
- `--bg-negative-default: #CB4B42`
- `--theme-warning-color: #f2994a`
- `--theme-error-color: #eb5757`

### Theme Colors (Light/Dark Support)
- `--theme-bg-color` - Main background color
- `--theme-panel-color` - Panel background color
- `--theme-content-color` - Text content color
- `--theme-caption-color` - Caption text color
- `--theme-divider-color` - Divider/border color
- `--theme-navpanel-color` - Navigation panel background
- `--theme-navpanel-hovered` - Navigation hover state
- `--theme-navpanel-selected` - Navigation selected state

### Border Radius
- `--small-BorderRadius: 0.375rem`
- `--medium-BorderRadius: 0.5rem`
- `--large-BorderRadius: 1rem`

## Dark Theme Support

The design system automatically supports dark theme through CSS variables. The theme switches between light and dark based on user preference or can be manually controlled.

## Components Updated

1. **HulyStatus** - Now uses official Huly state colors
2. **HulyButton** - Updated to use Huly primary colors and theme variables
3. **HulyTable** - Updated to use Huly theme colors for backgrounds and borders
4. **DashboardLayout** - Updated to use Huly navigation panel colors and styling

## Color Palette Source

Colors are sourced from the official Huly platform repository:
- [Huly Colors TypeScript](https://github.com/hcengineering/platform/blob/develop/packages/ui/src/colors.ts)
- [Huly Theme SCSS](https://github.com/hcengineering/platform/blob/develop/packages/theme/styles/_colors.scss)

This ensures consistency with the official Huly design system and automatic updates when Huly updates their color palette.
