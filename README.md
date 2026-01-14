# Habous Prayer Times Userscripts

Two beautiful themes that transform the Habous Morocco prayer times website into a modern, real-time dashboard:
- **Glassmorphism Theme**: Frosted glass design with 10 customizable color palettes
- **Terminal Theme**: Developer-inspired with 15 customizable color palettes

Before :
<img width="1342" height="530" alt="image" src="https://github.com/user-attachments/assets/b50b06ff-46f5-46e8-a05a-7768d335b887" />
After :

**Glassmorphism**

<img width="858" height="684" alt="image" src="https://github.com/user-attachments/assets/86ed1542-a4a5-44e6-a44f-38179bf2a254" />


**Terminal**

<img width="844" height="533" alt="image" src="https://github.com/user-attachments/assets/dd5de832-f560-4e24-933b-7b7d4da75ef1" />


## Highlights

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Themes](https://img.shields.io/badge/themes-2-purple.svg)
![Color Schemes](https://img.shields.io/badge/color_palettes-25_total-green.svg)

- **Two Distinct Themes**: Choose between glassmorphism or terminal aesthetics.
- **25 Total Color Palettes**: 10 glassmorphism themes + 15 terminal themes.
- **Smart Theme Detection**: Automatically detects your system's dark/light mode preference.
- **Dual Mode System**: Separate dark and light theme collections with independent memory.
- **Focus on Today**: Declutters the interface to show only the essential info: today's prayers.
- **Smart Navigation**: Cycle through your favorite cities directly from the header.
- **Real-Time Updates**: Live countdowns and automatic synchronization when waking from sleep.

## Features

### Two Beautiful Themes

#### Glassmorphism Theme (`habous_prayer_userscript.user.js`)
- **Frosted Glass Design**: Beautiful translucent cards with blur effects and subtle gradients.
- **10 Color Palettes**: Switch between carefully crafted light and dark themes:
  - **Dark Themes** (5):
    - **Midnight Purple** (default dark) - Deep purple and pink ambient gradients
    - **Deep Ocean** - Cool blue oceanic tones
    - **Forest Night** - Fresh green forest vibes
    - **Amethyst Dark** - Rich purple gemstone colors
    - **Royal Blue** - Classic deep blue elegance
  - **Light Themes** (5):
    - **Cloud White** (default light) - Clean slate gray tones
    - **Soft Peach** - Warm peachy orange hues
    - **Mint Fresh** - Cool mint green freshness
    - **Lavender Light** - Soft purple lavender tones
    - **Rose Gold** - Elegant rose pink accents
- **Theme Mode Toggle**: Switch between dark and light mode collections with a single button.
- **System Theme Detection**: Automatically matches your operating system's dark/light preference on first load.
- **Theme Memory**: Remembers your preferred theme separately for dark and light modes.
- **Smooth Animations**: Elegant hover effects and transitions.
- **Ambient Background**: Dynamic gradient background that changes with each theme.
- **Liquid Glass Active State**: The next prayer tile glows and pulses with its unique color.

#### Terminal Theme (`habous_prayer_userscript_terminal.user.js`)
- **Developer-Inspired Design**: Monospace fonts (JetBrains Mono) and clean rectangular layouts.
- **15 Color Palettes**: Switch between popular terminal themes:
  - **Dark Themes** (10):
    - **Catppuccin Mocha** (default dark) - Warm, soothing purple tones
    - **Catppuccin Macchiato** - Fresh green accents
    - **Dracula** - Classic purple and green
    - **Gruvbox** - Retro warm colors
    - **Nord** - Cool blue Arctic palette
    - **Tokyo Night** - Vibrant blue tones
    - **Kanagawa** - Inspired by Japanese art
    - **Monokai Pro** - Modern twist on classic Monokai
    - **Rose Pine** - Earthy rose tones
    - **Rose Pine Moon** - Deeper rose moon variant
  - **Light Themes** (5):
    - **Rose Pine Dawn** (default light) - Soft rose dawn palette
    - **Gruvbox Light** - Warm retro light variant
    - **Nord Light** - Cool Arctic light tones
    - **Tokyo Night Day** - Bright Tokyo day theme
    - **Catppuccin Latte** - Soft latte colors
- **Theme Mode Toggle**: Switch between dark and light mode collections with moon/sun icon button.
- **System Theme Detection**: Automatically matches your operating system's dark/light preference on first load.
- **Theme Memory**: Remembers your preferred theme separately for dark and light modes.
- **Theme Selector Dropdown**: Select from filtered themes with color-coded previews.
- **Terminal Aesthetics**: Sharp corners, monospace fonts, and minimalist borders.

### Universal Features (Both Themes)
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
- **Favorites Bar**: A dedicated panel appears at the top showing all your favorite cities for quick access.
  - Click any city in the bar to instantly switch to it.
  - Hover over a city to reveal a remove (×) button.
  - The bar automatically hides when you have no favorites.
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
3. **Choose your theme:**
   - For glassmorphism: Copy `habous_prayer_userscript.user.js`
   - For terminal: Copy `habous_prayer_userscript_terminal.user.js`
4. Paste the content into the editor.
5. Save the script (Ctrl+S).
6. Visit [Habous Prayer Times](https://habous.gov.ma/prieres/horaire_hijri_2.php).

**Note**: Only install one theme at a time to avoid conflicts.

## How to Use

### Navigation
- **Favorites Bar**: Quick-access panel displaying all your favorite cities at the top.
  - Click any city to instantly switch to it.
  - Hover to reveal the remove (×) button.
- **Header Arrows**: Click `<` or `>` in the header to cycle through your favorite cities.
- **Keyboard Shortcuts**: Press `←` (Left Arrow) or `→` (Right Arrow) to navigate between favorite cities.
  - Only works when you have 2+ favorites and the current city is in your favorites.
  - Navigation wraps around (first ↔ last).
  - Prevents page scrolling while navigating.
- **Dropdown**: Use the standard dropdown menu to select a new city not in your favorites.

### Favorites
- **Add**: Click the outline star icon next to the city name.
- **Remove**: Click the filled gold star icon.
- **Navigate**: Use the arrows that appear once you have 2 or more favorites.

### Settings
- **Time Format**: Click the clock button to toggle between 12-hour and 24-hour formats (both themes).
- **Theme Mode Toggle** (both themes): Click the moon/sun button to switch between dark and light mode collections.
- **Color Palette Selector**:
  - **Glassmorphism**: Dropdown showing 5 themes filtered by current mode (dark or light).
  - **Terminal**: Dropdown showing 10 (dark) or 5 (light) themes filtered by current mode.
- **Automatic Persistence**: All preferences (time format, theme mode, and selected palette) are automatically saved to your browser.

## Version History

### v2.0.0 (Current)
- **Theme System Overhaul**:
  - **Glassmorphism**: Now features 10 color palettes (5 dark + 5 light themes).
  - **Terminal**: Expanded to 15 color palettes (10 dark + 5 light themes).
  - **System Theme Detection**: Automatically detects and uses your OS dark/light mode preference on first load.
  - **Theme Mode Toggle**: New button to switch between dark and light mode collections.
  - **Separate Theme Memory**: Remembers your preferred palette independently for dark and light modes.
  - **Smart Theme Selector**: Dropdown now shows only themes relevant to current mode (dark/light).
- **Enhanced UI**:
  - All colors (backgrounds, borders, text) now adapt to the selected theme.
  - Improved contrast and readability across all 25 color palettes.
  - Seamless transitions when switching themes or modes.
- **Keyboard Navigation**:
  - Press `←` or `→` arrow keys to quickly switch between favorite cities.
  - Works in both glassmorphism and terminal themes.
  - Circular navigation with wraparound support.

### v1.0.0
- **Two Themes Available**: 
  - Glassmorphism theme with frosted glass design
  - Terminal theme with 8 color schemes
- **Favorites Bar**: Added a quick-access favorites panel at the top of the page (both themes).
  - Shows all your favorite cities in one place.
  - Click to instantly switch between cities.
  - Hover to reveal remove buttons.
  - Automatically hides when empty.
- **Terminal Theme**: 
  - 8 professional color schemes (Catppuccin, Dracula, Gruvbox, Nord, TokyoNight, Kanagawa, Monokai Pro)
  - Theme switcher button with saved preferences
  - Monospace fonts and developer-inspired design
- **Navigation**: Smart header arrows to cycle through favorite cities (both themes).
- **Smart Header**: Centers city name and shows "Favorites (x/y)" status (both themes).
- **Favicon**: Added adaptive dynamic SVG favicon (both themes).
- **Website Title**: Renamed page title to "Prayer Times" (both themes).

### v0.5.0
- Glassmorphism redesign.
- Added dynamic gradients for each prayer.

### v0.4.0
- Automatic sleep/wake detection and sync.

---

**Source**: Data retrieved directly from the [Ministry of Habous](https://habous.gov.ma).

**Note**: This project was created with the assistance of AI.
