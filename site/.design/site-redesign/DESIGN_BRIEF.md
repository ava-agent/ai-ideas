# Design Brief: AI Ideas Showcase Redesign

## Problem

The current site feels flat, generic, and lacks visual personality. Despite matching WayToAGI's color system (#674DFF purple), the implementation reads as "competent template" rather than "premium product showcase." Cards are visually monotonous, typography lacks hierarchy, and there's no sense of delight or craftsmanship.

## Solution

Transform the site from a "database viewer" into a curated gallery experience. Make the 212 AI ideas feel like a premium collection worth exploring — with better visual hierarchy, richer card designs, polished interactions, and page layouts that reward browsing.

## Experience Principles

1. **Gallery over grid** -- Top ideas get prominent placement. Feature cards are larger, detailed, and visually distinct from standard cards. Not everything is equal size.
2. **Craft over decoration** -- Polish comes from precise spacing, refined typography, and thoughtful micro-interactions — not gradients or animations for their own sake.
3. **Confidence over clutter** -- Every element earns its place. Generous whitespace, limited color palette, clear visual hierarchy. Reduce noise, increase signal.

## Aesthetic Direction

- **Philosophy**: Refined minimal with editorial touches (think Linear.app meets Notion's marketing pages)
- **Tone**: Confident, clean, quietly premium
- **Reference points**: Linear.app, Notion marketing pages, Stripe's product pages, Vercel's design system
- **Anti-references**: Generic Tailwind templates, Material Design, busy dashboards

## Existing Patterns

- Typography: System font stack, Geist Mono for monospace
- Colors: Purple brand `#674DFF`, tag palette `#F4F2FF`/`#D8D1FF`/`#2D14B8`
- Spacing: Default Tailwind scale
- Components: IdeaCard, ScoreBar, ScoreRadar, Navbar
- Stack: Next.js 16, Tailwind CSS v4, React 19, no component library

## Component Inventory

| Component | Status   | Notes |
|-----------|----------|-------|
| Navbar    | Modify   | Add sticky blur, mobile menu, better brand lockup |
| IdeaCard  | Modify   | Better cover, subtle border, refined hover |
| ScoreBar  | Keep     | Minor color tweaks |
| ScoreRadar| Keep     | Minor polish |
| Home page | Modify   | Featured hero card, better section rhythm |
| Ideas page| Modify   | Better filter UX, featured first card |
| Detail page| Keep    | Minor spacing improvements |
| Leaderboard| Modify  | Better table styling, visual chart |
| globals.css| Rewrite | New token system, refined base styles |

## Key Interactions

- Cards: subtle lift + border highlight on hover (not shadow bomb)
- Navigation: backdrop-blur when scrolled
- Hero: subtle gradient animation on brand accent
- Page transitions: none (keep SSG-fast)
- Filter pills: smooth active state transition

## Responsive Behavior

- Desktop (1280+): 4-column grid, full sidebar on detail
- Tablet (768-1279): 2-column grid, stacked sidebar
- Mobile (<768): Single column, hamburger nav, compact cards

## Accessibility Requirements

- WCAG 2.1 AA contrast ratios
- Keyboard-navigable filters and cards
- Proper heading hierarchy
- Focus visible on interactive elements

## Out of Scope

- Dark mode
- Authentication
- Backend changes
- New pages or routes
- Data pipeline changes
