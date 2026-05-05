---
name: Insight Minimalist
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#424754'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#555c6a'
  on-tertiary: '#ffffff'
  tertiary-container: '#6e7583'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#dce2f3'
  tertiary-fixed-dim: '#c0c7d6'
  on-tertiary-fixed: '#151c27'
  on-tertiary-fixed-variant: '#404754'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  h1:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.75'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  2xl: 3rem
  3xl: 4rem
  container-max: 768px
  gutter: 1.5rem
---

## Brand & Style

This design system embodies a **Corporate / Modern** aesthetic with a heavy leaning toward **Minimalism**. It is designed for high-readability content platforms, such as technical blogs and personal portfolios. The brand personality is professional, systematic, and intellectual. 

The visual narrative prioritizes content over container, utilizing generous whitespace and a restricted color palette to reduce cognitive load. The UI evokes a sense of clarity and reliability, making it ideal for readers who seek structured information without distraction.

## Colors

The palette is anchored by a high-contrast foundation of deep ink and pure white. **#3B82F6 (Blue)** serves as the primary action color, used sparingly for links, active states, and primary call-to-actions to maintain a professional "utility" feel. 

**Neutral Tones:**
- **Primary Text:** #111827 (Rich Black) for maximum legibility.
- **Secondary Text:** #6B7280 (Cool Gray) for metadata and captions.
- **Surface/Background:** #F3F4F6 (Soft Gray) for subtle section differentiation and input backgrounds.

The dark mode implementation inverts the hierarchy, using #111827 as the primary canvas and shifting text to high-contrast whites and light grays.

## Typography

The design system utilizes **Inter** (as the closest high-quality match to the requested Pretendard) to ensure a systematic, utilitarian appearance. The scale is built on a tight ratio to ensure a clear information hierarchy.

- **Headlines:** Use heavy weights (700-800) with slight negative letter-spacing to create a strong visual anchor.
- **Body Text:** Optimized for long-form reading with a generous line-height (1.75) for the large variant.
- **Data/Labels:** Medium weights are used for small labels to maintain legibility against background colors.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** approach for readability, specifically targeting a centered "reading column" for blog content. 

- **Layout Model:** A single-column centered layout with a maximum width of 768px for prose content.
- **Spacing Rhythm:** Based on a 4px/8px incremental scale. 
- **Margins:** Use `xl` (2rem) for page margins on mobile, increasing to `3xl` (4rem) on desktop to provide "breathing room."
- **Component Spacing:** Use `md` (1rem) for internal padding of cards and inputs.

## Elevation & Depth

This design system avoids heavy shadows, opting for **Tonal Layers** and **Low-Contrast Outlines** to define depth.

- **Level 0 (Base):** #FFFFFF background.
- **Level 1 (Surfaces):** #F3F4F6 background with no border (used for code blocks or secondary sections).
- **Level 2 (Interactive):** 1px solid #E5E7EB border for cards and inputs. 
- **Focus States:** When an element is active or focused, use a 2px offset ring in the primary color (#3B82F6).
- **Shadows:** Only used for floating menus or overlays, using a very diffused, low-opacity gray: `0 10px 15px -3px rgba(0, 0, 0, 0.05)`.

## Shapes

The shape language is **Soft** and restrained. Rounded corners are used to subtly modernize the interface without making it feel overly playful or "bubbly."

- **Buttons & Inputs:** Use the standard `rounded` (0.25rem/4px) setting.
- **Cards & Containers:** Use `rounded-lg` (0.5rem/8px) to create a distinct frame for content blocks.
- **Tags/Pills:** Use a full pill-shape (999px) to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Solid #3B82F6 background with white text. 4px border radius.
- **Secondary:** Transparent background with #3B82F6 text and a subtle #F3F4F6 hover state.
- **Size:** Height should be 40px for standard actions, with `md` horizontal padding.

### Navigation
- **Header:** Fixed or sticky top navigation with a blur-behind effect (backdrop-filter) and a 1px bottom border in #F3F4F6.
- **Links:** Use #6B7280 for inactive states, transitioning to #111827 on hover with a subtle underline or color shift.

### Cards
- **Style:** 1px solid #F3F4F6 border, no shadow.
- **Content:** Padding should follow the `lg` spacing unit (1.5rem).

### Tags & Chips
- **Style:** Small text (label-sm), semi-bold.
- **Color:** #F3F4F6 background with #6B7280 text. 

### Input Fields
- **Style:** #FFFFFF background with 1px #E5E7EB border. On focus, border changes to #3B82F6 with a subtle outer glow.