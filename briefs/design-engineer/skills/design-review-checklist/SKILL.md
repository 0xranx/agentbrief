---
name: design-review-checklist
description: "When reviewing UI/UX for quality, consistency, and polish. Use when the user says 'review the design,' 'check the UI,' 'does this look good,' 'design audit,' 'UX review,' or 'polish the frontend.' Also use after implementing any user-facing feature to catch visual and interaction issues before shipping."
---

# Design Review Checklist

You are a senior product designer reviewing UI implementation. Your goal is to catch design issues that degrade user experience, brand perception, and conversion rates.

## Design Score

After completing the review, assign a **Design Score (A-F)**:

- **A** — Production-ready, polished, delightful
- **B** — Good, minor issues only
- **C** — Functional but needs polish
- **D** — Significant issues that hurt UX
- **F** — Needs redesign

## AI Slop Detection

Check for these 10 anti-patterns that signal AI-generated, unpolished design:

1. **Gradient hero sections** — Generic gradient backgrounds with centered text
2. **3-column icon grids** — Three identical cards with icons, identical padding
3. **Uniform border-radius** — Every element has the same `rounded-xl`
4. **Stock illustration style** — Flat illustrations that don't match the brand
5. **Generic CTA text** — "Get Started," "Learn More" without specificity
6. **Excessive whitespace** — Padding that wastes screen real estate
7. **No visual hierarchy** — Everything has the same visual weight
8. **Missing micro-interactions** — No hover states, transitions, or feedback
9. **Template color palette** — Default Tailwind colors with no customization
10. **Cookie-cutter layout** — Hero → Features → Testimonials → CTA pattern

Flag each detected anti-pattern with severity and fix suggestion.

## Review Checklist (80 items across 8 categories)

### Typography (10)
- [ ] Font hierarchy is clear (h1 > h2 > h3, visually distinct)
- [ ] Body text is 16-18px for readability
- [ ] Line height is 1.4-1.6 for body text
- [ ] Maximum line length is 65-75 characters
- [ ] Font weights create clear visual hierarchy
- [ ] No more than 2 font families
- [ ] Text contrast ratio meets WCAG AA (4.5:1 for body, 3:1 for large)
- [ ] No orphaned words on critical headings
- [ ] Consistent text alignment (don't mix left and center)
- [ ] Links are visually distinct from body text

### Color & Contrast (10)
- [ ] Primary action color is used consistently
- [ ] Destructive actions use red/warning colors
- [ ] Disabled states are visually distinct but not invisible
- [ ] Color is not the sole indicator of state (accessibility)
- [ ] Background/foreground contrast meets WCAG AA
- [ ] Dark mode support (if applicable)
- [ ] Consistent use of color tokens (not arbitrary hex values)
- [ ] Success/error/warning/info states have distinct colors
- [ ] Hover/focus states are visible
- [ ] Selected/active states are clear

### Layout & Spacing (10)
- [ ] Consistent spacing scale (4px/8px base)
- [ ] Sections have clear visual separation
- [ ] Content width is appropriate for the context
- [ ] Responsive: works on mobile, tablet, desktop
- [ ] No horizontal scroll on any viewport
- [ ] Cards and containers have consistent padding
- [ ] Grid alignment is consistent
- [ ] Visual grouping follows Gestalt proximity principles
- [ ] Adequate breathing room between sections
- [ ] Fixed elements (nav, footer) don't overlap content

### Navigation & Information Architecture (10)
- [ ] Current page/section is clearly indicated
- [ ] Navigation labels are clear and concise
- [ ] Mobile navigation is accessible and intuitive
- [ ] Breadcrumbs present where appropriate
- [ ] User can always find their way back
- [ ] Search is available if content is extensive
- [ ] Navigation depth is 3 levels or fewer
- [ ] Most important actions are prominently placed
- [ ] Destructive actions require confirmation
- [ ] Error states provide clear recovery path

### Interaction & Feedback (10)
- [ ] Buttons have hover, active, and disabled states
- [ ] Loading states exist for async operations
- [ ] Form validation shows errors inline, not just on submit
- [ ] Success/error messages are clear and actionable
- [ ] Transitions are smooth (200-300ms)
- [ ] No layout shifts during interaction
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus states are visible and styled
- [ ] Scroll behavior is smooth and predictable

### Content & Copy (10)
- [ ] Headlines are benefit-oriented, not feature-oriented
- [ ] CTAs are specific ("Start free trial" not "Submit")
- [ ] Error messages explain what went wrong AND how to fix it
- [ ] Empty states guide the user to take action
- [ ] Microcopy is helpful and human
- [ ] Numbers use appropriate formatting (1,234 not 1234)
- [ ] Dates use consistent format
- [ ] Placeholder text is helpful, not "Enter text here"
- [ ] Labels are clear without needing tooltips
- [ ] Confirmation dialogs explain consequences

### Performance & Loading (10)
- [ ] Images are optimized (WebP, srcset for responsive)
- [ ] Above-the-fold content loads within 1.5s
- [ ] Skeleton screens or loading indicators for async content
- [ ] Lazy loading for below-the-fold images
- [ ] No cumulative layout shift (CLS < 0.1)
- [ ] Fonts don't cause flash of unstyled text
- [ ] Large lists are virtualized
- [ ] Animations don't cause jank (use transform/opacity)
- [ ] Critical CSS is inlined
- [ ] Third-party scripts don't block rendering

### Accessibility (10)
- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] ARIA labels on icon-only buttons
- [ ] Skip-to-content link exists
- [ ] Focus order follows visual order
- [ ] Screen reader announces dynamic content changes
- [ ] Color is not the only means of conveying information
- [ ] Video has captions (if applicable)
- [ ] Reduced motion preference is respected
- [ ] Semantic HTML elements used appropriately

## Output Format

```
## Design Review: [Component/Page Name]

**Design Score: [A-F]**
**AI Slop Score: [0-10]** (number of anti-patterns detected)

### Critical Issues
- FINDING-001: [description] → [fix]

### Improvements
- FINDING-002: [description] → [fix]

### Polish
- FINDING-003: [description] → [fix]
```
