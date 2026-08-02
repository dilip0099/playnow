---
name: Kinetic Obsidian
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#dcb8ff'
  on-secondary: '#480081'
  secondary-container: '#7701d0'
  on-secondary-container: '#dcb7ff'
  tertiary: '#ffffff'
  on-tertiary: '#303030'
  tertiary-container: '#e5e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#efdbff'
  secondary-fixed-dim: '#dcb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6700b5'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1b1b1c'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 20px
  margin: 24px
---

## Brand & Style
The design system is engineered for a high-octane gaming environment, prioritizing speed, immersion, and prestige. The aesthetic is rooted in **Modern Glassmorphism** layered over a **Minimalist Dark** foundation. 

The visual narrative focuses on "Power through Precision." By utilizing deep blacks and charcoal surfaces, the UI recedes to let content and neon accents command the user's focus. High-energy interactions are fueled by glowing states and vibrant gradients, creating a sense of live, reactive technology. The target audience expects a "pro-grade" interface that feels as responsive as their hardware.

## Colors
The palette centers on an ultra-high contrast relationship between the void-black backgrounds and the **Neon Lime** primary accent.

- **Primary (Neon Lime):** Reserved strictly for critical actions, primary buttons, and active navigation indicators. It represents energy and "Go" states.
- **Secondary (Electric Violet):** Used for supplementary information, such as ranking badges, streamer tiers, or rare item highlights.
- **Surface Strategy:** Use `#121212` (Charcoal) for container backgrounds to distinguish them from the `#000000` (Black) page base. 
- **Functional Accents:** Success states should lean into the Neon Lime, while destructive actions should use a high-chroma red (#FF3B30).

## Typography
The typography system uses a tri-font approach to balance personality and utility.

1.  **Sora (Headlines):** A geometric, wide-aperture sans-serif that provides a futuristic, high-tech appearance. Use heavy weights (700+) for all headings.
2.  **Inter (Body):** Selected for its exceptional legibility at small sizes and neutral tone, ensuring that long-form content or chat logs remain readable during high-intensity sessions.
3.  **JetBrains Mono (Labels/Data):** Used for technical metadata (e.g., ping rate, player counts, timestamps). This reinforces the "gaming host/server" technical utility.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a maximum content width of 1440px. 

- **Desktop (12 Columns):** 24px margins and 20px gutters. Use wide gutters to maintain a clean, airy feel despite the dark theme.
- **Mobile (4 Columns):** 16px margins. Content should stack vertically, with horizontal scrolling allowed for "Game Categories" or "Live Streamer" lists.
- **Rhythm:** Use an 8px base grid. All component heights and internal padding must be multiples of 8 to ensure visual mathematical harmony.

## Elevation & Depth
Depth is communicated through **Glassmorphism** and **Luminescent Glows** rather than traditional drop shadows.

- **Level 1 (Base):** Pure Black (#000000).
- **Level 2 (Containers):** Deep Charcoal (#121212) with a subtle 1px border (#FFFFFF with 10% opacity).
- **Level 3 (Interactive Cards):** Semi-transparent background (RGBA 255, 255, 255, 0.05) with a 20px backdrop blur.
- **Active State:** Elements in a focused or active state should emit a soft outer glow (drop-shadow) using the primary color at 30% opacity, creating a "powered-on" effect.

## Shapes
The design system uses **Rounded (0.5rem / 8px)** as the standard radius for small components like inputs and buttons. 

- **Cards & Thumbnails:** Must use `rounded-lg` (16px) to create a premium, approachable feel that contrasts against the sharp, aggressive typography.
- **Interactive Elements:** Buttons and tags use the standard 8px radius. 
- **Iconography:** Use linear, 2px stroke icons with slightly rounded terminals to match the shape language.

## Components

- **Buttons:** 
  - *Primary:* Solid Neon Lime (#CCFF00) with Black text. No shadow in rest state; 12px Lime glow on hover.
  - *Secondary:* Ghost style with 1px Electric Violet border and Violet text. 
- **Cards:** Glassmorphic fill (5% white, 20px blur). On hover, the border color shifts from subtle grey to Neon Lime.
- **Thumbnails:** Always 16px corner radius. Include a subtle inner-shadow gradient at the bottom to ensure white text overlay (e.g., game titles) remains legible.
- **Inputs:** Darker than the container background. Use JetBrains Mono for placeholder text. The focus state is a 2px Neon Lime bottom-border.
- **Chips/Badges:** Use Electric Violet for "Live" or "Featured" statuses. Use a condensed, all-caps JetBrains Mono font for the label.
- **Progress Bars:** Use a linear gradient from Electric Violet to Neon Lime to show "loading" or "XP" progression, suggesting movement and speed.