# AuraChat — Chat UI Assignment

**Assignment:** Chat UI Development | CampusPe Gen AI Assignment  
**Student:** Student User  
**Date:** April 2026  
**Max Marks:** 110

---

## Project Overview

AuraChat is a modern, responsive chat user interface inspired by Claude and ChatGPT. Built entirely with **HTML5, CSS3, JavaScript (ES6+), jQuery 3.7, and Bootstrap 5**. No backend required — all AI responses are mocked with realistic delays and random selection.

---

## File Structure

```
StudentName_ChatUI/
├── index.html          ← Main HTML file (semantic HTML5)
├── css/
│   └── style.css       ← All custom styles (CSS variables, animations, responsive)
├── js/
│   └── chat.js         ← All JavaScript + jQuery functionality
├── screenshots/
│   ├── desktop.png     ← Desktop screenshot
│   ├── tablet.png      ← Tablet screenshot
│   └── mobile.png      ← Mobile screenshot
└── README.md           ← This file
```

---

## How to Run

1. **Unzip** the submission zip file.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
3. No installation, no server, no dependencies to install — everything loads from CDN.

> Works offline for layout/functionality. CDN links (Bootstrap, Font Awesome, Google Fonts, jQuery) require an internet connection.

---

## Features Implemented

### Task 1 — HTML Structure (25 pts)
- Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`, `<aside>`)
- Bootstrap 5 + Font Awesome + Google Fonts linked
- Welcome screen with 4 suggestion cards in a grid
- Message container, typing indicator, input area with textarea + buttons

### Task 2 — CSS Styling (35 pts)
- 30+ CSS custom properties for colors, spacing, shadows, transitions
- User messages (right-aligned, purple gradient) vs AI messages (left-aligned, soft bg)
- Circular gradient avatars for both user and AI
- Focus state with accent border on input
- Keyframe animations: `fadeInUp`, `slideInUp`, `bounceDot`, `floatPulse`
- Typing indicator with 3 bouncing dots
- Custom scrollbar styling

### Task 3 — JavaScript & jQuery (25 pts)
- `addMessage(text, sender)` — creates and appends message bubbles with timestamp
- `sendMessage()` — validates, displays, clears, and triggers AI response
- Auto-resize textarea as user types
- Enter key to send, Shift+Enter for new line
- Disabled send button when input is empty
- Typing indicator shown for 1–2 seconds before AI response
- Welcome screen hidden after first message
- Array of 8 sample AI responses

### Task 4 — Sidebar & Mobile (15 pts)
- Fixed 260px sidebar with New Chat button, scrollable history, user profile
- Hamburger menu (hidden on desktop, visible on mobile)
- Off-canvas slide-in sidebar on mobile with overlay backdrop
- Responsive grid: 2-column cards → 1-column on mobile
- Tested from 320px to 1920px

### Bonus Features (10 pts)
- ✅ **Dark mode toggle** with smooth theme transition (localStorage persistence)
- ✅ **Message formatting** — `**bold**`, `*italic*`, `` `code` ``, ` ```code blocks``` `
- ✅ **Export chat** as `.txt` file using Blob API
- ✅ **Custom scrollbar** styling (webkit + Firefox)

---

## Design Decisions

- **Typography:** Syne (display, headings) + DM Sans (body) — distinctive pairing
- **Color palette:** Purple accent (`#7c6af7`) on clean whites/soft greys
- **Dark mode:** Full CSS variable swap on `body.dark-mode`
- **Animations:** Subtle — `fadeInUp` on messages, `floatPulse` on logo, `bounceDot` on typing dots
- **WCAG AA compliance:** All text/background pairs meet 4.5:1 contrast ratio

---

## Testing Checklist

- [x] Messages appear correctly when sent
- [x] User and AI messages are visually different
- [x] Send button disabled when input is empty
- [x] Send button enabled when there is text
- [x] Enter key sends; Shift+Enter = new line
- [x] Typing indicator shows and hides correctly
- [x] Auto-scroll on new messages
- [x] Textarea auto-resizes
- [x] Suggestion cards populate and send
- [x] Welcome screen hides after first message
- [x] Sidebar slides in/out on mobile
- [x] Responsive on 320px–1920px
- [x] No console errors

---

## External Libraries

| Library | Version | CDN |
|---|---|---|
| Bootstrap 5 | 5.3.3 | jsdelivr.net |
| Font Awesome | 6.5.1 | cdnjs.cloudflare.com |
| Google Fonts | — | fonts.googleapis.com |
| jQuery | 3.7.1 | code.jquery.com |

---

## Academic Integrity

All code in this submission was written by the student. External documentation and tutorials were referenced for learning, but no code was copied from classmates or online sources.
