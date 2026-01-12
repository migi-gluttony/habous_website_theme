# Habous Prayer Times Userscript

A sleek, modern glassmorphism userscript that transforms the Habous Morocco prayer times website into a beautiful, real-time dashboard.

Before :
<img width="1342" height="530" alt="image" src="https://github.com/user-attachments/assets/b50b06ff-46f5-46e8-a05a-7768d335b887" />
After :
<img width="1361" height="558" alt="image" src="https://github.com/user-attachments/assets/947cd6df-4758-40e1-b16e-9e0af0cc8c0f" />


## Highlights

![Version](https://img.shields.io/badge/version-0.6.0-blue.svg)
![Theme](https://img.shields.io/badge/theme-Glassmorphism_Dark-purple.svg)

- **Minimalist Glass UI**: Beautiful frosted glass design with smooth animations.
- **Focus on Today**: Declutters the interface to show only the essential info: today's prayers.
- **Smart Navigation**: Cycle through your favorite cities directly from the header.
- **Real-Time Updates**: Live countdowns and automatic synchronization when waking from sleep.

## Features

### Modern Interface
- **Glassmorphism Design**: Frosted glass cards, subtle gradients, and glowing effects.
- **Dynamic Layout**: Centers the city name and adapts navigation controls based on your favorites.
- **Responsive**: Works beautifully on various screen sizes.
- **Custom Favicon & Title**: Sets the page title to "Prayer Times" and adds a dynamic adaptive mosque icon to your tab.

### Time & Date
- **Live Countdown**: Shows exactly how much time is left until the next prayer.
- **Elapsed Time**: Displays time passed since the last prayer.
- **12h/24h Toggle**: Switch between 12-hour (AM/PM) and 24-hour formats with one click (preference saved).
- **Hijri & Gregorian**: Displays both dates clearly in the header.

### Favorites System
- **Quick Favorites**: Click the star icon to add/remove the current city.
- **Cycling Navigation**: 
  - Arrows appear next to the city name when you have multiple favorites.
  - Clicking arrows (`<` or `>`) instantly loads the next/previous city in your list.
  - Hovering over an arrow shows the name of the destination city.
  - "Favorites (x/y)" indicator shows your position in the list.

### Alerts & Smart Sync
- **5-Minute Alerts**: Browser notifications sent 5 minutes before each prayer.
- **Sleep/Wake Detection**: Automatically resyncs timers when you switch tabs or wake your computer from sleep.
- **Smart Notifications**: Prevents duplicate alerts for the same prayer.

## Installation

### Prerequisites
You need a userscript manager extension installed in your browser:
- **Tampermonkey** (Chrome, Firefox, Edge, Opera, Safari)
- **Violentmonkey** (Chrome, Firefox, Edge, Opera)
- **Greasemonkey** (Firefox only)

### Install Steps
1. Install a userscript manager (e.g., Tampermonkey).
2. Create a new script.
3. Copy the content of `habous_prayer_userscript.user.js` into the editor.
4. Save the script (Ctrl+S).
5. Visit [Habous Prayer Times](https://habous.gov.ma/prieres/horaire_hijri_2.php).

## How to Use

### Navigation
- **Left/Right Arrows**: Use these in the header to cycle through your favorite cities.
- **Dropdown**: Use the standard dropdown menu to select a new city not in your favorites.

### Favorites
- **Add**: Click the outline star icon next to the city name.
- **Remove**: Click the filled gold star icon.
- **Navigate**: Use the arrows that appear once you have 2 or more favorites.

### Settings
- **Time Format**: Click the "12H/24H" button to toggle.

## Version History

### v0.6.0 (Current)
- **New Navigation**: Replaced favorites panel with intuitive header arrows to cycle through cities.
- **Smart Header**: Centers city name and shows "Favorites (x/y)" status.
- **Favicon**: Added adaptive dynamic SVG favicon (changes color for light/dark mode).
- **Website Title**: Renamed page title to "Prayer Times".
- **UI Update**: Refined glassmorphism scaling and layout.

### v0.5.0
- Glassmorphism redesign.
- Added dynamic gradients for each prayer.

### v0.4.0
- Automatic sleep/wake detection and sync.

---

**Source**: Data retrieved directly from the [Ministry of Habous](https://habous.gov.ma).

**Note**: This project was created with the assistance of AI.
