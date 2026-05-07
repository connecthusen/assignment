# KuttyAI — Chat UI Assignment

**Assignment:** Chat UI Development | CampusPe Gen AI Assignment  
**Student:** Husen  
**Date:** April 2026  
**Max Marks:** 110

---

## Project Overview

KuttyAI is a modern, responsive chat user interface inspired by Claude and ChatGPT.  
Built entirely with **HTML5, CSS3, JavaScript ES6+, jQuery 3.7, and Bootstrap 5**.  
No backend required — all AI responses are mocked with realistic delays.

---

## File Structure

```
StudentName_ChatUI/
├── index.html          ← Main HTML (semantic HTML5, intro splash)
├── css/
│   └── style.css       ← All styles (KuttyAI teal theme, Calibri-feel fonts, animations)
├── js/
│   └── chat.js         ← Splash animation + full chat functionality (jQuery)
├── screenshots/
│   ├── desktop.png
│   ├── tablet.png
│   └── mobile.png
└── README.md
```

---

## How to Run

1. Unzip `StudentName_ChatUI.zip`
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
3. The KuttyAI intro splash plays automatically, then the chat opens

> Internet required for CDN links (Bootstrap, Font Awesome, Google Fonts, jQuery)

---

## Features

| Area | Feature |
|---|---|
| Intro Splash | Animated logo entry → loading bar → logo flies away → chat reveals |
| HTML | Semantic tags, Bootstrap 5, all required elements |
| CSS | 40+ CSS variables, teal KuttyAI theme, Nunito + Exo 2 fonts |
| Messages | User (Husen) + AI (KuttyAI) bubbles, avatars, timestamps |
| Input | Auto-resize, Enter to send, Shift+Enter newline, disabled state |
| Typing | Bouncing 3-dot indicator with glow |
| Sidebar | 260px fixed, chat history, Husen profile, New Chat |
| Mobile | Off-canvas sidebar, hamburger, responsive cards |
| Dark Mode | Full CSS variable swap, localStorage persistence |
| Formatting | **bold**, *italic*, `code`, code blocks |
| Export | Download chat as .txt via Blob API |
| Scrollbar | Custom styled (webkit + Firefox) |

---

## Design Choices

- **Brand:** KuttyAI teal (`#00cfc8`) on dark sidebar (`#0d2626`)
- **Fonts:** Exo 2 (display/headings) + Nunito (body) — Calibri-feel professional
- **Profile:** H avatar, username "Husen", gradient teal avatar
- **Splash:** Canvas particle field + SVG logo spin-in → float → fly-to-sidebar exit
- **WCAG AA:** All text/background pairs meet 4.5:1 contrast ratio

---

## Academic Integrity

All code written by Husen. Documentation and tutorials referenced for learning only.
