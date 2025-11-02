# InclusiveHub Design Guidelines

## Design Approach

**System Selected:** Material Design 3 with accessibility-first principles
**Justification:** Material Design provides robust accessibility patterns, clear component states, and proven inclusive design patterns. We'll enhance this with references to government accessibility portals (like GOV.UK) and Microsoft's inclusive design principles.

**Core Principles:**
1. Universal Access: Every interaction has multiple pathways (voice, touch, keyboard)
2. Clear Hierarchy: Information structure that works for screen readers and visual scanning
3. Purposeful Simplicity: Reduce cognitive load without sacrificing functionality
4. Consistent Patterns: Predictable layouts across all features

---

## Typography System

**Font Stack:** 
- Primary: Inter (Google Fonts) - exceptional readability at all sizes
- Monospace: JetBrains Mono for code/technical content

**Hierarchy:**
- Hero/Page Titles: text-5xl md:text-6xl, font-bold, tracking-tight
- Section Headers: text-3xl md:text-4xl, font-semibold
- Card/Feature Titles: text-xl md:text-2xl, font-semibold
- Body Large: text-lg, leading-relaxed (for primary content)
- Body: text-base, leading-relaxed
- Small/Meta: text-sm, leading-normal
- Buttons/CTAs: text-base md:text-lg, font-medium

**Accessibility Requirements:**
- Minimum body text: 16px (text-base)
- Line height: 1.75 (leading-relaxed) for all body content
- Letter spacing: Default for body, tracking-tight for headlines only
- Never use all-caps for more than 3 words

---

## Layout System

**Spacing Scale:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Micro spacing (within components): p-2, gap-2
- Component padding: p-4, p-6
- Section spacing: py-12, py-16, py-24
- Container gaps: gap-6, gap-8

**Grid System:**
- Main container: max-w-7xl mx-auto px-4 md:px-6 lg:px-8
- Content areas: max-w-6xl for general content
- Reading content: max-w-4xl for text-heavy sections
- Dashboard grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

**Page Structure:**
- Persistent navigation header (not sticky - keeps content predictable)
- Main content area with clear landmark regions
- Sidebar for filters/navigation (collapsible on mobile)
- Footer with essential links and resources

---

## Component Library

### Navigation
- Top navigation bar with clear labels (Home, Directory, Marketplace, Community, Chat)
- Breadcrumbs for multi-level navigation
- Skip-to-content link (visually hidden, keyboard accessible)
- Search bar prominently featured with voice input icon

### Cards & Containers
- Feature cards: rounded-lg border-2 p-6 with clear hover states
- Directory listings: List view with large touch targets (min-h-20)
- Marketplace items: Image cards with descriptive overlays
- Community posts: Spacious cards with clear author info and interaction buttons

### Forms & Inputs
- Large input fields: h-12 text-lg px-4
- Clear labels positioned above inputs
- Voice input button integrated into text fields
- Generous spacing between form fields (space-y-6)
- Error states with descriptive text and icons
- Multi-step forms with clear progress indicators

### Buttons & CTAs
- Primary: px-6 py-3 rounded-lg text-lg font-medium min-w-[140px]
- Secondary: px-6 py-3 rounded-lg border-2
- Icon buttons: min-h-12 min-w-12 for touch accessibility
- Floating Action Button for voice commands (bottom-right, large)

### Data Display
- Hospital/place listings: Grid layout with accessibility badges
- Filters sidebar: Checkbox groups with large touch targets
- Map integration: Full-width with overlay controls
- Statistics/metrics: Large numbers with descriptive labels

### Modals & Overlays
- AI Chat interface: Slide-in panel from right (lg:w-[480px])
- Image viewer: Full-screen overlay with clear close button
- Accessibility settings modal: Organized in clear sections

### Media Elements
- Audio controls: Large, clearly labeled play/pause buttons
- Image upload zones: Drag-and-drop with large drop area
- Video players: Custom controls with captions always visible

---

## Accessibility Implementation

**Keyboard Navigation:**
- Visible focus indicators: ring-4 ring-offset-2
- Logical tab order following visual hierarchy
- Shortcuts displayed in help modal

**Screen Reader Optimization:**
- Semantic HTML5 structure throughout
- ARIA labels for all interactive elements
- Live regions for dynamic content updates
- Descriptive alt text for all images

**Visual Accessibility:**
- Text maintains 4.5:1 contrast minimum
- Interactive elements 44x44px minimum
- Icons paired with text labels
- Clear visual indicators for all states (hover, focus, active, disabled)

---

## Feature-Specific Layouts

**Homepage/Dashboard:**
- Hero section (h-[400px] md:h-[500px]): Welcome message + voice command prompt
- Quick action tiles (4-column grid on desktop)
- Recent activity feed
- Accessibility tips carousel

**Directory Pages:**
- Left sidebar filters (fixed on desktop, drawer on mobile)
- Main content area with list/grid toggle
- Map view option with accessibility markers
- Each listing shows: amenity icons, distance, rating, quick actions

**Marketplace:**
- Masonry grid for creative works
- Category filtering tabs
- Creator profiles with verification badges
- Product detail pages with multi-image galleries and accessibility descriptions

**Community Feed:**
- Timeline layout with post cards
- Create post button (floating on mobile)
- Comment threads with clear indentation
- Share/react buttons with icon + text labels

**AI Chat:**
- Persistent chat icon in bottom-right
- Expanding panel interface
- Message bubbles with timestamps
- Voice input waveform visualization
- Quick action suggestions

---

## Images

**Hero Image:**
- Homepage: Diverse group of people using accessible technology (1920x500px)
- Placement: Full-width hero section with gradient overlay for text readability
- Alternative: Abstract illustration of connectivity and inclusion

**Feature Icons:**
- Use Heroicons (outline style) via CDN
- Sized at 24px (h-6 w-6) for inline icons, 48px (h-12 w-12) for feature cards
- Always paired with text labels

**Directory Images:**
- Location photos uploaded by community
- Thumbnail size: 400x300px in listings, full-res in detail view
- Gemini Vision badges overlay showing accessibility features detected

**Marketplace Images:**
- Product/artwork images in square or portrait orientation
- Grid thumbnails: 300x300px
- Detail view: Up to 1200px width

---

## Animation Guidelines

**Minimal, Purposeful Motion:**
- Page transitions: Simple fade (300ms)
- Card hovers: Subtle lift (transform: translateY(-2px))
- Loading states: Gentle pulse animation
- Voice input: Waveform visualization only
- NO auto-playing content, NO parallax effects

**Respecting User Preferences:**
- Detect and honor `prefers-reduced-motion`
- Disable all non-essential animations when set