---
name: Laughing Seed
description: Thai-first, chaotic laughter made from weighted random digits.
colors:
  ink: "#0a0908"
  acid-yellow: "#e9f83a"
  laughter-pink: "#f873bb"
  pink-hover: "#ff9ace"
  paper-white: "#ffffff"
typography:
  display:
    fontFamily: "Lilita One, Kanit, sans-serif"
    fontSize: "17.4cqw (mobile); 8.8cqw (wide); 22cqw (large portrait)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Mitr, Kanit, sans-serif"
    fontSize: "22cqw (mobile); 104px (wide); 22cqw (large portrait)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Kanit, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Kanit, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  tag: "8px"
  input: "8px"
  button: "9px"
spacing:
  sheet-mobile: "20px 22px 18px"
  sheet-wide: "30px 36px 24px"
  control: "8px 14px"
components:
  button-primary:
    backgroundColor: "{colors.laughter-pink}"
    textColor: "{colors.ink}"
    typography: "600 22px/1.2 Kanit, sans-serif"
    rounded: "{rounded.button}"
    padding: "8px 14px"
    height: "47px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "600 22px/1.2 Kanit, sans-serif"
    rounded: "{rounded.button}"
    padding: "8px 14px"
    height: "47px"
  length-input:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    typography: "400 23px/1.25 Kanit, sans-serif"
    rounded: "{rounded.input}"
    padding: "8px 13px"
---

# Design System: Laughing Seed

## Overview

**Creative North Star: "The Chaotic Internet Sticker Sheet"**

Laughing Seed treats its generated digits as the punchline: oversized, tightly set, and playfully skewed on one continuous acid-yellow field. Thai copy leads; pink accents and hand-lettered English details give the utility the energy of a chat sticker without turning it into a dashboard.

The current interface is a single semantic, selectable typographic surface. It keeps the length control and actions close to the output, lets long results scroll inside their own region, and adapts the same sheet to narrow phones, wide screens, and tall portrait displays. A brief output jolt accompanies regeneration and respects reduced-motion preferences.

**Key Characteristics:**
- Acid yellow, near-black, and hot pink carry the full visual identity.
- Thai headlines and body copy pair with a rounded Latin display face for digits.
- Oversized type, slight rotation, and skew create the controlled-chaos effect.
- One continuous sheet keeps the generator direct and mobile-first.

## Colors

The palette uses one bright ground, near-black ink, and pink for emphasis and action; white is reserved for the editable length field.

### Primary
- **Acid Yellow**: The full-page ground and the contrast color for the secondary action's hover state.
- **Laughter Pink**: The primary action, the “5 ไปไหน” tag, and selected text.
- **Pink Hover**: A lighter interaction state for the primary action.

### Neutral
- **Near-Black Ink**: Main text, outlines, focus rings, and the secondary action's hover surface.
- **Paper White**: The length-entry field.

**The Three-Ink Rule.** Keep the yellow, near-black, and pink relationship dominant; white belongs to the input surface.

## Typography

**Display Font:** Lilita One (with sans-serif fallback)
**Body Font:** Kanit (with sans-serif fallback)
**Thai Headline Font:** Mitr (with Kanit fallback)

**Character:** Rounded Latin display lettering makes the digits feel like the joke, while Mitr gives the Thai headline a dense, forceful silhouette. Kanit carries the functional copy and controls in a clear, consistent voice.

### Hierarchy
- **Display** (400, 17.4cqw mobile / 8.8cqw wide, 0.96 line-height): Generated digits, with tabular numerals and wrapped groups.
- **Headline** (700 loaded face, requested weight 900, 22cqw mobile / 104px wide, 1.04 line-height): The two-line Thai hero statement.
- **Body** (400, 16px, 1.5 line-height): Supporting and explanatory copy.
- **Label** (600, 16px, 1.2 line-height): The length field label and action text.

**The Output-Owns-Type Rule.** Keep the generated number string the largest type on the sheet; reserve the Thai headline as the supporting setup.

## Layout

The centered sheet fills the viewport up to 853px and uses a single column. At 640px and wider, the sheet gains more inset space and the two actions sit side by side. On narrow screens they stack, and screens under 360px reduce horizontal padding. Tall portrait displays use container-relative sizing to preserve the poster proportions. The output region scrolls independently, with a 34svh/310px cap on mobile, 24svh on wide screens, and 38svh on tall portrait screens. Spacing is compact around the brand, heading, counters, and form so the action remains reachable.

## Elevation & Depth

The sheet stays flat: it has no card stack or shadow vocabulary. Depth comes from the contrast between the yellow ground and black ink, thick outlines, small rotations, and the pink accent. Focus and hover states use direct color or outline changes.

## Shapes

Controls use gently rounded corners (8px input and tag; 9px buttons), with a 2px near-black input outline. The tag, headline lines, and digit groups use subtle rotations or skew. No decorative image is needed; all lettering and digits stay semantic text.

## Components

### Buttons
- **Character:** Bold, high-contrast actions with large touch targets.
- **Primary:** Pink fill, near-black Kanit text, 8px 14px padding, 47px minimum height; at 640px and wider, 24px type and 58px minimum height.
- **Hover / Focus:** Primary lightens on hover; all keyboard focus uses a 3px ink outline offset by 5px. Active buttons shift down 1px.
- **Secondary:** Transparent fill with a 2px ink border; hover fills with ink and changes text to yellow.

### Inputs / Fields
- **Style:** White field, 2px ink outline, gently rounded corners (8px), and Kanit text.
- **Focus:** Shared ink focus outline (3px, 5px offset).
- **Error:** Invalid input changes the border to dashed and shows the associated alert text.

### Chips
- **Style:** “5 ไปไหน” is a pink, rounded label with a slight rotation; it is a visual annotation, not a control.

### Signature: Generated Output
- **Style:** Oversized Lilita One and Kanit digits on the yellow ground, tabular numerals, tightly spaced and subtly skewed in five-character groups.
- **Behavior:** The region is keyboard-focusable and independently scrollable. Regeneration gives it a brief typographic jolt; reduced-motion preferences suppress animation.

## Do's and Don'ts

### Do:
- **Do** keep the main lettering and generated digits as selectable semantic text.
- **Do** preserve the yellow ground, near-black ink, and pink action relationship.
- **Do** keep the output scrollable and the actions reachable at every viewport size.
- **Do** retain visible keyboard focus and reduced-motion behavior.

### Don't:
- **Don't** add card stacks, decorative glass, or dashboard framing to this single-sheet utility.
- **Don't** replace the actual generated digits or Thai lettering with raster artwork.
- **Don't** claim screenshot-level numeric hero fidelity is complete while the review gate remains open.
