// ==UserScript==
// @name         Habous Prayer Times - Terminal Theme (15 Color Palettes)
// @namespace    https://github.com/your-namespace
// @version      1.0.0
// @description  Developer-inspired terminal design with 15 customizable color schemes: Dark themes (CatppuccinMocha, Macchiato, Dracula, Gruvbox, Nord, TokyoNight, Kanagawa, MonokaiPro, RosePine, RosePineMoon) and Light themes (RosePineDawn, GruvboxLight, NordLight, TokyoNightDay, CatppuccinLatte).
// @match        https://habous.gov.ma/prieres/horaire_hijri_2.php*
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  function safeText(el) { return el ? (el.textContent || "").trim() : ""; }
  function isTimeStr(s) { return /\b\d{1,2}:\d{2}\b/.test(s || ""); }

  const uiIcons = {
    starFilled: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    starOutline: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9 27 8.91 8.26 12 2"/></svg>'
  };

  // Time format preference (default: 24-hour)
  let use12Hour = localStorage.getItem('tmk-time-format') === '12';
  
  // Detect system theme preference on first load
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Theme mode preference (default: system preference)
  let themeMode = localStorage.getItem('tmk-theme-mode');
  if (!themeMode) {
    themeMode = systemPrefersDark ? 'dark' : 'light';
    localStorage.setItem('tmk-theme-mode', themeMode);
  }
  
  // Separate theme preferences for dark and light modes
  const defaultDarkTheme = 'CatppuccinMocha';
  const defaultLightTheme = 'RosePineDawn';
  
  let darkTheme = localStorage.getItem('tmk-terminal-theme-dark') || defaultDarkTheme;
  let lightTheme = localStorage.getItem('tmk-terminal-theme-light') || defaultLightTheme;
  
  // Current theme based on mode
  let currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  // Theme categorization
  const themeCategories = {
    dark: ['CatppuccinMocha', 'CatppuccinMacchiato', 'Dracula', 'Gruvbox', 'Nord', 'TokyoNight', 'Kanagawa', 'MonokaiPro', 'RosePine', 'RosePineMoon'],
    light: ['RosePineDawn', 'GruvboxLight', 'NordLight', 'TokyoNightDay', 'CatppuccinLatte']
  };

  // Color Schemes from Spicetify themes
  const colorSchemes = {
    CatppuccinMocha: {
      name: 'Catppuccin Mocha',
      accent: '#cba6f7',
      accentActive: '#cba6f7',
      main: '#1e1e2e',
      header: '#181825',
      borderInactive: '#313244',
      borderActive: '#cba6f7',
      text: '#cdd6f4',
      subtext: '#a6adc8',
      muted: '#6c7086',
      notification: '#89b4fa',
      notificationError: '#f38ba8'
    },
    CatppuccinMacchiato: {
      name: 'Catppuccin Macchiato',
      accent: '#a6da95',
      accentActive: '#a6da95',
      main: '#24273a',
      header: '#1e2030',
      borderInactive: '#363a4f',
      borderActive: '#a6da95',
      text: '#cad3f5',
      subtext: '#a5adcb',
      muted: '#5b6078',
      notification: '#8aadf4',
      notificationError: '#ed8796'
    },
    Dracula: {
      name: 'Dracula',
      accent: '#50fa7b',
      accentActive: '#50fa7b',
      main: '#282a36',
      header: '#21222c',
      borderInactive: '#44475a',
      borderActive: '#50fa7b',
      text: '#f8f8f2',
      subtext: '#f8f8f2',
      muted: '#6272a4',
      notification: '#8be9fd',
      notificationError: '#ff5555'
    },
    Gruvbox: {
      name: 'Gruvbox',
      accent: '#b8bb26',
      accentActive: '#b8bb26',
      main: '#282828',
      header: '#1d2021',
      borderInactive: '#3c3836',
      borderActive: '#b8bb26',
      text: '#fbf1c7',
      subtext: '#bdae93',
      muted: '#665c54',
      notification: '#458588',
      notificationError: '#cc241d'
    },
    Nord: {
      name: 'Nord',
      accent: '#88c0d0',
      accentActive: '#8fbcbb',
      main: '#2e3440',
      header: '#242933',
      borderInactive: '#3b4252',
      borderActive: '#8fbcbb',
      text: '#eceff4',
      subtext: '#d8dee9',
      muted: '#4c566a',
      notification: '#5e81ac',
      notificationError: '#bf616a'
    },
    TokyoNight: {
      name: 'Tokyo Night',
      accent: '#7aa2f7',
      accentActive: '#7dcfff',
      main: '#1a1b26',
      header: '#16161e',
      borderInactive: '#24283b',
      borderActive: '#7aa2f7',
      text: '#c0caf5',
      subtext: '#a9b1d6',
      muted: '#565f89',
      notification: '#7dcfff',
      notificationError: '#f7768e'
    },
    Kanagawa: {
      name: 'Kanagawa',
      accent: '#98BB6C',
      accentActive: '#98BB6C',
      main: '#1F1F28',
      header: '#16161D',
      borderInactive: '#2A2A37',
      borderActive: '#98BB6C',
      text: '#DCD7BA',
      subtext: '#C8C093',
      muted: '#54546D',
      notification: '#7E9CD8',
      notificationError: '#E82424'
    },
    MonokaiPro: {
      name: 'Monokai Pro',
      accent: '#a9dc76',
      accentActive: '#a9dc76',
      main: '#2d2a2e',
      header: '#221f22',
      borderInactive: '#423f46',
      borderActive: '#a9dc76',
      text: '#fcfcfa',
      subtext: '#c1c0c0',
      muted: '#727072',
      notification: '#78dce8',
      notificationError: '#ff6188'
    },
    RosePine: {
      name: 'Rose Pine',
      accent: '#ebbcba',
      accentActive: '#ebbcba',
      main: '#191724',
      header: '#1f1d2e',
      borderInactive: '#26233a',
      borderActive: '#ebbcba',
      text: '#e0def4',
      subtext: '#908caa',
      muted: '#6e6a86',
      notification: '#9ccfd8',
      notificationError: '#eb6f92'
    },
    RosePineMoon: {
      name: 'Rose Pine Moon',
      accent: '#c4a7e7',
      accentActive: '#c4a7e7',
      main: '#232136',
      header: '#2a273f',
      borderInactive: '#393552',
      borderActive: '#c4a7e7',
      text: '#e0def4',
      subtext: '#908caa',
      muted: '#6e6a86',
      notification: '#9ccfd8',
      notificationError: '#eb6f92'
    },
    RosePineDawn: {
      name: 'Rose Pine Dawn',
      accent: '#d7827e',
      accentActive: '#d7827e',
      main: '#faf4ed',
      header: '#fffaf3',
      borderInactive: '#f2e9e1',
      borderActive: '#d7827e',
      text: '#575279',
      subtext: '#797593',
      muted: '#9893a5',
      notification: '#286983',
      notificationError: '#b4637a'
    },
    GruvboxLight: {
      name: 'Gruvbox Light',
      accent: '#98971a',
      accentActive: '#98971a',
      main: '#fbf1c7',
      header: '#f9f5d7',
      borderInactive: '#ebdbb2',
      borderActive: '#98971a',
      text: '#3c3836',
      subtext: '#504945',
      muted: '#7c6f64',
      notification: '#076678',
      notificationError: '#cc241d'
    },
    NordLight: {
      name: 'Nord Light',
      accent: '#5e81ac',
      accentActive: '#81a1c1',
      main: '#eceff4',
      header: '#e5e9f0',
      borderInactive: '#d8dee9',
      borderActive: '#5e81ac',
      text: '#2e3440',
      subtext: '#3b4252',
      muted: '#4c566a',
      notification: '#88c0d0',
      notificationError: '#bf616a'
    },
    TokyoNightDay: {
      name: 'Tokyo Night Day',
      accent: '#2e7de9',
      accentActive: '#188092',
      main: '#e1e2e7',
      header: '#d0d5e3',
      borderInactive: '#b4b5b9',
      borderActive: '#2e7de9',
      text: '#3760bf',
      subtext: '#4c505e',
      muted: '#6172b0',
      notification: '#188092',
      notificationError: '#f52a65'
    },
    CatppuccinLatte: {
      name: 'Catppuccin Latte',
      accent: '#8839ef',
      accentActive: '#8839ef',
      main: '#eff1f5',
      header: '#e6e9ef',
      borderInactive: '#ccd0da',
      borderActive: '#8839ef',
      text: '#4c4f69',
      subtext: '#5c5f77',
      muted: '#6c6f85',
      notification: '#1e66f5',
      notificationError: '#d20f39'
    }
  };

  const theme = colorSchemes[currentTheme] || colorSchemes.CatppuccinMocha;

  // Favorites management
  function getFavorites() {
    const stored = localStorage.getItem('tmk-prayer-favorites');
    return stored ? JSON.parse(stored) : [];
  }

  function saveFavorites(favorites) {
    localStorage.setItem('tmk-prayer-favorites', JSON.stringify(favorites));
  }

  function isFavorite(villeId) {
    return getFavorites().some(f => f.id === villeId);
  }

  function toggleFavorite(villeId, cityName) {
    let favorites = getFavorites();
    const index = favorites.findIndex(f => f.id === villeId);
    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push({ id: villeId, name: cityName });
    }
    saveFavorites(favorites);
    return index < 0;
  }

  function convertTo12Hour(timeStr) {
    const [hh, mm] = timeStr.split(':').map(Number);
    const period = hh >= 12 ? 'PM' : 'AM';
    const hour12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
    return `${hour12}:${mm.toString().padStart(2, '0')} ${period}`;
  }

  function formatTime(timeStr) {
    if (!timeStr) return '';
    return use12Hour ? convertTo12Hour(timeStr) : timeStr;
  }

  function findCitySelect() {
    let s = document.querySelector('select[name="ville"]') || document.querySelector('#ville');
    if (s) return s;
    const candidates = Array.from(document.querySelectorAll('select')).filter((sel) => {
      const opts = Array.from(sel.options);
      const numericVals = opts.filter((o) => /^\d+$/.test(o.value)).length;
      return opts.length >= 5 && numericVals >= Math.max(3, Math.floor(opts.length * 0.6));
    });
    return candidates[0] || null;
  }

  function cloneCitySelect(original) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tmk-select-wrapper';
    wrapper.style.cssText = 'position:relative;display:inline-flex;align-items:center';
    
    const cloned = document.createElement('select');
    cloned.className = 'tmk-city-select';
    cloned.style.cssText = `
      padding: 12px 40px 12px 16px;
      font-size: 13px;
      font-weight: 500;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      border-radius: 0;
      background: ${theme.main};
      color: ${theme.text};
      border: 1px solid ${theme.borderInactive};
      cursor: pointer;
      outline: none;
      appearance: none;
      min-width: 180px;
      transition: all 0.2s ease;
    `;
    
    const arrow = document.createElement('div');
    arrow.innerHTML = '▼';
    arrow.style.cssText = `position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:${theme.muted};transition:all 0.2s ease;font-size:10px`;
    
    cloned.addEventListener('mouseover', () => {
      cloned.style.borderColor = theme.borderActive;
      arrow.style.color = theme.accent;
    });
    cloned.addEventListener('mouseout', () => {
      if (document.activeElement !== cloned) {
        cloned.style.borderColor = theme.borderInactive;
        arrow.style.color = theme.muted;
      }
    });
    cloned.addEventListener('focus', () => {
      cloned.style.borderColor = theme.borderActive;
      cloned.style.boxShadow = `0 0 0 2px ${theme.accent}33`;
      arrow.style.color = theme.accent;
    });
    cloned.addEventListener('blur', () => {
      cloned.style.boxShadow = 'none';
      cloned.style.borderColor = theme.borderInactive;
      arrow.style.color = theme.muted;
    });
    
    Array.from(original.options).forEach((o) => {
      const opt = document.createElement('option');
      const villeMatch = o.value.match(/ville=(\d+)/);
      opt.value = villeMatch ? villeMatch[1] : o.value;
      opt.textContent = o.textContent;
      if (o.selected) opt.selected = true;
      cloned.appendChild(opt);
    });
    
    cloned.addEventListener('change', () => {
      const params = new URLSearchParams(window.location.search);
      params.set('ville', cloned.value);
      window.location.href = `${location.origin}${location.pathname}?${params.toString()}`;
    });
    
    wrapper.appendChild(cloned);
    wrapper.appendChild(arrow);
    return wrapper;
  }

  function createTimeFormatToggle(onToggle) {
    const btn = document.createElement('button');
    btn.id = 'tmk-time-format-btn';
    btn.className = 'tmk-terminal-btn';
    btn.style.cssText = `
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      border-radius: 0;
      background: ${theme.main};
      color: ${theme.text};
      border: 1px solid ${theme.borderInactive};
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    `;
    btn.innerHTML = `<span>[</span><span>${use12Hour ? '12H' : '24H'}</span><span>]</span>`;
    
    btn.addEventListener('mouseover', () => {
      btn.style.background = theme.header;
      btn.style.borderColor = theme.accent;
      btn.style.color = theme.accent;
    });
    btn.addEventListener('mouseout', () => {
      btn.style.background = theme.main;
      btn.style.borderColor = theme.borderInactive;
      btn.style.color = theme.text;
    });
    btn.addEventListener('click', () => {
      use12Hour = !use12Hour;
      localStorage.setItem('tmk-time-format', use12Hour ? '12' : '24');
      btn.innerHTML = `<span>[</span><span>${use12Hour ? '12H' : '24H'}</span><span>]</span>`;
      if (onToggle) onToggle();
    });
    return btn;
  }

  function createThemeModeToggle(onModeChange) {
    const btn = document.createElement('button');
    btn.id = 'tmk-theme-mode-btn';
    btn.className = 'tmk-terminal-btn';
    btn.style.cssText = `
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 600;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      border-radius: 0;
      background: ${theme.main};
      color: ${theme.text};
      border: 1px solid ${theme.borderInactive};
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    `;
    
    const updateButton = () => {
      btn.innerHTML = themeMode === 'dark' 
        ? '<span>☾</span><span>DARK</span>' 
        : '<span>☀</span><span>LIGHT</span>';
    };
    updateButton();
    
    btn.addEventListener('mouseover', () => {
      btn.style.background = theme.header;
      btn.style.borderColor = theme.accent;
      btn.style.color = theme.accent;
    });
    btn.addEventListener('mouseout', () => {
      btn.style.background = theme.main;
      btn.style.borderColor = theme.borderInactive;
      btn.style.color = theme.text;
    });
    btn.addEventListener('click', () => {
      // Save current theme for current mode
      if (themeMode === 'dark') {
        localStorage.setItem('tmk-terminal-theme-dark', currentTheme);
      } else {
        localStorage.setItem('tmk-terminal-theme-light', currentTheme);
      }
      
      // Switch mode
      themeMode = themeMode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('tmk-theme-mode', themeMode);
      
      // Load remembered theme for new mode
      currentTheme = themeMode === 'dark' 
        ? (localStorage.getItem('tmk-terminal-theme-dark') || defaultDarkTheme)
        : (localStorage.getItem('tmk-terminal-theme-light') || defaultLightTheme);
      
      if (onModeChange) onModeChange();
    });
    return btn;
  }

  function createThemeSelector(onThemeChange) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;display:inline-flex;align-items:center';
    
    const select = document.createElement('select');
    select.id = 'tmk-theme-select';
    select.className = 'tmk-terminal-select';
    select.style.cssText = `
      padding: 12px 40px 12px 16px;
      font-size: 12px;
      font-weight: 600;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      border-radius: 0;
      background: ${theme.main};
      color: ${theme.text};
      border: 1px solid ${theme.borderInactive};
      cursor: pointer;
      transition: all 0.2s ease;
      appearance: none;
      min-width: 200px;
    `;
    
    // Add options for themes in current mode only
    const themesForMode = themeCategories[themeMode] || themeCategories.dark;
    themesForMode.forEach(themeKey => {
      const opt = document.createElement('option');
      opt.value = themeKey;
      opt.textContent = colorSchemes[themeKey].name;
      opt.style.cssText = `
        background: ${colorSchemes[themeKey].main};
        color: ${colorSchemes[themeKey].text};
        border-left: 4px solid ${colorSchemes[themeKey].accent};
        padding: 8px 12px;
        font-family: 'JetBrains Mono', 'Courier New', monospace;
      `;
      if (themeKey === currentTheme) opt.selected = true;
      select.appendChild(opt);
    });
    
    const arrow = document.createElement('div');
    arrow.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    arrow.style.cssText = `position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:${theme.text};transition:all 0.2s ease`;
    
    select.addEventListener('mouseover', () => {
      select.style.background = theme.header;
      select.style.borderColor = theme.accent;
      arrow.style.color = theme.accent;
    });
    select.addEventListener('mouseout', () => {
      select.style.background = theme.main;
      select.style.borderColor = theme.borderInactive;
      arrow.style.color = theme.text;
    });
    select.addEventListener('focus', () => {
      select.style.borderColor = theme.accent;
      arrow.style.transform = 'translateY(-50%) rotate(180deg)';
    });
    select.addEventListener('blur', () => {
      select.style.borderColor = theme.borderInactive;
      arrow.style.transform = 'translateY(-50%) rotate(0deg)';
    });
    select.addEventListener('change', () => {
      currentTheme = select.value;
      // Save to mode-specific storage
      if (themeMode === 'dark') {
        localStorage.setItem('tmk-terminal-theme-dark', currentTheme);
      } else {
        localStorage.setItem('tmk-terminal-theme-light', currentTheme);
      }
      if (onThemeChange) onThemeChange();
    });
    
    wrapper.appendChild(select);
    wrapper.appendChild(arrow);
    return wrapper;
  }

  function createFavoriteButton(villeId, cityName, onToggle) {
    const btn = document.createElement('button');
    btn.id = 'tmk-favorite-btn';
    btn.className = 'tmk-terminal-btn';
    const isFav = isFavorite(villeId);
    btn.style.cssText = `
      padding: 12px 14px;
      border-radius: 0;
      background: ${theme.main};
      color: ${isFav ? '#fbbf24' : theme.text};
      border: 1px solid ${theme.borderInactive};
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
    `;
    
    btn.innerHTML = isFav ? uiIcons.starFilled : uiIcons.starOutline;
    btn.title = isFav ? 'Remove from favorites' : 'Add to favorites';
    
    btn.addEventListener('mouseover', () => {
      btn.style.background = theme.header;
      btn.style.borderColor = '#fbbf24';
      btn.style.color = '#fbbf24';
    });
    btn.addEventListener('mouseout', () => {
      const currentFav = isFavorite(villeId);
      btn.style.background = theme.main;
      btn.style.borderColor = theme.borderInactive;
      btn.style.color = currentFav ? '#fbbf24' : theme.text;
    });
    btn.addEventListener('click', () => {
      const added = toggleFavorite(villeId, cityName);
      btn.innerHTML = added ? uiIcons.starFilled : uiIcons.starOutline;
      btn.style.color = added ? '#fbbf24' : theme.text;
      btn.title = added ? 'Remove from favorites' : 'Add to favorites';
      if (onToggle) onToggle();
    });
    return btn;
  }

  function createFavoritesPanel() {
    const favorites = getFavorites();
    if (favorites.length === 0) return null;

    const panel = document.createElement('div');
    panel.className = 'tmk-favorites-panel';
    panel.style.cssText = `
      width: 100%;
      max-width: 1000px;
      margin: 0 auto 16px auto;
      padding: 16px 20px;
      box-sizing: border-box;
      background: ${theme.main};
      border-radius: 0;
      border: 1px solid ${theme.borderInactive};
      display: flex;
      flex-direction: column;
      gap: 12px;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
    `;
    
    const title = document.createElement('div');
    title.style.cssText = `font-size:11px;color:${theme.muted};font-weight:700;text-transform:uppercase;letter-spacing:2px;display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono','Courier New',monospace`;
    title.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> // favorites`;
    
    const favList = document.createElement('div');
    favList.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px';
    
    favorites.forEach(fav => {
      const favBtn = document.createElement('button');
      favBtn.className = 'tmk-fav-city-btn';
      favBtn.style.cssText = `
        padding: 8px 14px;
        font-size: 12px;
        border-radius: 0;
        background: ${theme.header};
        color: ${theme.text};
        border: 1px solid ${theme.borderInactive};
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        font-family: 'JetBrains Mono', 'Courier New', monospace;
      `;
      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = fav.name;
      
      const removeBtn = document.createElement('span');
      removeBtn.innerHTML = 'x';
      removeBtn.style.cssText = `opacity:0;transition:all 0.2s ease;width:16px;height:16px;display:flex;align-items:center;justify-content:center;background:${theme.notificationError};color:${theme.main};font-weight:bold;font-size:11px`;
      
      favBtn.appendChild(nameSpan);
      favBtn.appendChild(removeBtn);
      
      favBtn.addEventListener('mouseover', () => {
        favBtn.style.background = theme.main;
        favBtn.style.borderColor = theme.accent;
        favBtn.style.color = theme.accent;
        removeBtn.style.opacity = '1';
      });
      favBtn.addEventListener('mouseout', () => {
        favBtn.style.background = theme.header;
        favBtn.style.borderColor = theme.borderInactive;
        favBtn.style.color = theme.text;
        removeBtn.style.opacity = '0';
      });
      
      favBtn.addEventListener('click', (e) => {
        if (e.target === removeBtn || removeBtn.contains(e.target)) {
          toggleFavorite(fav.id, fav.name);
          window.location.reload();
        } else {
          const params = new URLSearchParams(window.location.search);
          params.set('ville', fav.id);
          window.location.href = `${location.origin}${location.pathname}?${params.toString()}`;
        }
      });
      
      favList.appendChild(favBtn);
    });
    
    panel.appendChild(title);
    panel.appendChild(favList);
    return panel;
  }

  // Prayer icons
  const prayerIcons = {
    Fajr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>',
    Dhuhr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="m4.22 4.22 1.42 1.42"/><path d="m18.36 18.36 1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="m4.22 19.78 1.42-1.42"/><path d="m18.36 5.64 1.42-1.42"/></svg>',
    Asr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="m4.22 4.22 1.42 1.42"/><path d="m18.36 18.36 1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="m4.22 19.78 1.42-1.42"/><path d="m18.36 5.64 1.42-1.42"/></svg>',
    Maghrib: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 1-8 0"/></svg>',
    Isha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M21 5h-4"/></svg>'
  };

  function buildContainer(hijriDate, gregDate, prayersToday, cityName, currentVilleId, favorites = []) {
    const container = document.createElement('div');
    container.id = 'tmk-prayer-container';
    container.className = 'tmk-terminal-container';
    container.style.cssText = `
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;
      background: ${theme.main};
      border-radius: 0;
      border: 1px solid ${theme.borderInactive};
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      position: relative;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 24px 32px 16px;
      position: relative;
      z-index:1;
      background: ${theme.header};
      border-bottom: 1px solid ${theme.borderInactive};
    `;
    
    // Determine header layout content
    let cityContent = '';
    const isFav = favorites.some(f => f.id === currentVilleId);
    
    if (isFav && favorites.length > 1) {
       const currentIndex = favorites.findIndex(f => f.id === currentVilleId);
       const nextIndex = (currentIndex + 1) % favorites.length;
       const prevIndex = (currentIndex - 1 + favorites.length) % favorites.length;
       
       const nextFav = favorites[nextIndex];
       const prevFav = favorites[prevIndex];

       const showLeft = favorites.length > 2 || (favorites.length === 2 && currentIndex === 1);
       const showRight = favorites.length > 2 || (favorites.length === 2 && currentIndex === 0);

       const navBtnStyle = `
          display:inline-flex;align-items:center;justify-content:center;
          width:24px;height:24px;
          background:${theme.main};
          color:${theme.text};text-decoration:none;
          transition:all 0.2s ease;
          border: 1px solid ${theme.borderInactive};
          flex-shrink: 0;
          font-size:14px;
       `;
       const navTextStyle = `
          font-size:11px;color:${theme.muted};font-weight:500;white-space:nowrap;
          transition:all 0.2s ease;
       `;

       const leftControl = showLeft ? `
         <a href="?ville=${prevFav.id}" style="display:flex;align-items:center;gap:8px;text-decoration:none;margin-right:8px;" 
            onmouseover="this.querySelector('div').style.background='${theme.header}';this.querySelector('div').style.borderColor='${theme.accent}';this.querySelector('div').style.color='${theme.accent}'"
            onmouseout="this.querySelector('div').style.background='${theme.main}';this.querySelector('div').style.borderColor='${theme.borderInactive}';this.querySelector('div').style.color='${theme.text}'"
            title="Previous: ${prevFav.name}">
            <span style="${navTextStyle}">${prevFav.name}</span>
            <div style="${navBtnStyle}">◄</div>
         </a>
       ` : '';

       const rightControl = showRight ? `
         <a href="?ville=${nextFav.id}" style="display:flex;align-items:center;gap:8px;text-decoration:none;margin-left:8px;"
            onmouseover="this.querySelector('div').style.background='${theme.header}';this.querySelector('div').style.borderColor='${theme.accent}';this.querySelector('div').style.color='${theme.accent}'"
            onmouseout="this.querySelector('div').style.background='${theme.main}';this.querySelector('div').style.borderColor='${theme.borderInactive}';this.querySelector('div').style.color='${theme.text}'"
            title="Next: ${nextFav.name}">
            <div style="${navBtnStyle}">►</div>
            <span style="${navTextStyle}">${nextFav.name}</span>
         </a>
       ` : '';
       
       cityContent = `
         <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;min-width:300px;gap:12px;">
           <div style="justify-self:end;">${leftControl}</div>
           
           <div style="display:flex;flex-direction:column;align-items:center;text-align:center;">
              <h2 style="font-size:20px;font-weight:700;margin:0;color:${theme.text};letter-spacing:0;text-align:center;white-space:nowrap;">
                ${cityName || 'Morocco'}
              </h2>
             <div style="font-size:10px;color:${theme.muted};margin-top:4px;display:flex;align-items:center;justify-content:center;gap:5px;font-weight:500;letter-spacing:1px;text-transform:uppercase;">
               ${uiIcons.starFilled.replace('width="18" height="18"', `width="10" height="10" style="color:#fbbf24"`)}
               fav (${currentIndex + 1}/${favorites.length})
             </div>
           </div>

           <div style="justify-self:start;">${rightControl}</div>
         </div>
       `;
    } else {
       cityContent = `
         <div style="text-align:center;">
             <h2 style="font-size:22px;font-weight:700;margin:0;color:${theme.text};letter-spacing:0;">${cityName || 'Morocco'}</h2>
         </div>
       `;
    }

    header.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:20px;">
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="
            width: 48px;
            height: 48px;
            border-radius: 0;
            background: ${theme.main};
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid ${theme.borderInactive};
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${theme.accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v2"/>
              <path d="M12 8a4 4 0 0 1 4 4v8H8v-8a4 4 0 0 1 4-4z"/>
              <path d="M8 22H4v-6a4 4 0 0 1 4-4"/>
              <path d="M16 22h4v-6a4 4 0 0 0-4-4"/>
              <path d="M4 22h16"/>
              <circle cx="12" cy="5" r="1" fill="${theme.accent}"/>
            </svg>
          </div>
          <div>
            <h1 style="font-size:28px;font-weight:700;margin:0;color:${theme.accent};letter-spacing:0;font-family:'JetBrains Mono','Courier New',monospace">> prayer_times</h1>
          </div>
        </div>
        
        ${cityContent}
        
        <div style="text-align:right">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:${theme.muted};margin-bottom:4px;font-family:'JetBrains Mono','Courier New',monospace">// today</div>
          <div style="font-size:15px;color:${theme.subtext};font-weight:600;font-family:'JetBrains Mono','Courier New',monospace">${hijriDate || ''}</div>
          <div style="font-size:13px;color:${theme.muted};margin-top:2px;font-family:'JetBrains Mono','Courier New',monospace">${gregDate || ''}</div>
        </div>
      </div>
    `;

    // Prayer tiles container
    const tilesContainer = document.createElement('div');
    tilesContainer.style.cssText = 'display:grid;grid-template-columns:repeat(5, 1fr);padding:20px 24px 32px;gap:12px';
    tilesContainer.className = 'tmk-tiles-container';

    if (prayersToday.length) {
      prayersToday.forEach((p, idx) => {
        const icon = prayerIcons[p.key] || '';
        const tile = document.createElement('div');
        tile.className = `tmk-prayer-tile ${p.key.toLowerCase()}-tile`;
        tile.style.cssText = `
          padding: 20px 12px;
          text-align: center;
          cursor: default;
          background: ${theme.header};
          border: 1px solid ${theme.borderInactive};
          border-radius: 0;
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        `;
        
        tile.dataset.prayerKey = p.key;
        
        const tileContent = `
          <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;">
            <div class="tmk-prayer-icon" style="width:32px;height:32px;margin-bottom:10px;color:${theme.accent};transition:all 0.3s ease;">${icon}</div>
            <div class="tmk-prayer-name" style="font-size:10px;font-weight:600;color:${theme.subtext};text-transform:uppercase;margin-bottom:8px;letter-spacing:1.5px;transition:all 0.3s ease;font-family:'JetBrains Mono','Courier New',monospace">// ${p.name}</div>
            <div class="tmk-time tmk-prayer-time" style="font-size:20px;font-weight:600;color:${theme.text};margin-bottom:4px;font-feature-settings:'tnum';letter-spacing:1px;transition:all 0.3s ease;font-family:'JetBrains Mono','Courier New',monospace">${formatTime(p.timeStr)}</div>
            <div class="tmk-countdown" style="font-size:11px;color:${theme.muted};min-height:18px;font-weight:500;transition:all 0.3s ease;font-family:'JetBrains Mono','Courier New',monospace"></div>
          </div>
        `;
        tile.innerHTML = tileContent;
        tilesContainer.appendChild(tile);
      });
    } else {
      const msg = document.createElement('div');
      msg.style.cssText = `grid-column: 1/-1; padding: 60px; text-align: center; opacity: 0.5; font-size: 14px; color: ${theme.muted}`;
      msg.innerHTML = '// unable to load prayer times';
      tilesContainer.appendChild(msg);
    }
    
    // Footer
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 16px 32px 20px;
      border-top: 1px solid ${theme.borderInactive};
      font-size: 12px;
      color: ${theme.muted};
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: ${theme.header};
      font-family: 'JetBrains Mono', 'Courier New', monospace;
    `;
    footer.innerHTML = `
      <div id="tmk-prev-info" style="display:flex;align-items:center;gap:8px"></div>
      <div id="tmk-status"></div>
    `;

    container.append(header, tilesContainer, footer);
    return container;
  }

  function extractTimeStr(td) {
    const t = safeText(td);
    const m = t.match(/\b\d{1,2}:\d{2}\b/);
    return m ? m[0] : '';
  }

  function atTime(timeStr, baseDate) {
    const [hh, mm] = timeStr.split(':').map(Number);
    const d = new Date(baseDate);
    d.setHours(hh || 0, mm || 0, 0, 0);
    return d;
  }

  function formatDiff(ms) {
    const s = Math.floor(Math.abs(ms) / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(ss)}`;
  }

  function run() {
    const citySelOriginal = findCitySelect();
    const citySelCloned = citySelOriginal ? cloneCitySelect(citySelOriginal) : null;
    const cityName = citySelOriginal?.options[citySelOriginal.selectedIndex]?.textContent || 'Your City';
    
    const params = new URLSearchParams(window.location.search);
    const currentVilleId = params.get('ville') || '1';

    const table = document.querySelector('#horaire');
    let hijriDate = '', gregDate = '';
    let prayersToday = [];

    try {
      if (!table) throw new Error('Table #horaire not found');

      let headerRow = null;
      for (const tr of table.querySelectorAll('tr')) {
        const labels = Array.from(tr.children).map((td) => safeText(td));
        const hasWakt = Array.from(tr.children).some((td) => td.classList.contains('wakt'));
        const containsFajr = labels.some((t) => /الفجر|فجر/i.test(t));
        const containsDhuhr = labels.some((t) => /الظهر|ظهر/i.test(t));
        const containsMaghrib = labels.some((t) => /المغرب|مغرب/i.test(t));
        if (hasWakt || (containsFajr && containsDhuhr && containsMaghrib)) { headerRow = tr; break; }
      }
      if (!headerRow) throw new Error('Header row not found');

      const headers = Array.from(headerRow.children).map((td) => safeText(td));
      const prayerIdx = {};
      headers.forEach((h, idx) => {
        if (/الفجر|فجر/i.test(h)) prayerIdx.Fajr = idx;
        else if (/الظهر|ظهر/i.test(h)) prayerIdx.Dhuhr = idx;
        else if (/العصر|عصر/i.test(h)) prayerIdx.Asr = idx;
        else if (/المغرب|مغرب/i.test(h)) prayerIdx.Maghrib = idx;
        else if (/العشاء|عشاء/i.test(h)) prayerIdx.Isha = idx;
      });

      const DATE_COL = 2;
      const monthNamesAr = {
        1: 'يناير', 2: 'فبراير', 3: 'مارس', 4: 'أبريل', 5: 'ماي', 6: 'يونيو',
        7: 'يوليوز', 8: 'غشت', 9: 'شتنبر', 10: 'أكتوبر', 11: 'نونبر', 12: 'ديسمبر'
      };

      const now = new Date();
      const currentDay = now.getDate();
      const currentMonth = now.getMonth() + 1;

      const allRows = Array.from(table.querySelectorAll('tr')).filter(tr => tr !== headerRow);

      const dayNumbers = [];
      allRows.forEach((tr) => {
        const tds = Array.from(tr.children);
        if (tds.length > DATE_COL) {
          const dayText = safeText(tds[DATE_COL]);
          const dayMatch = dayText.match(/^\s*(\d{1,2})\s*$/);
          if (dayMatch) dayNumbers.push(parseInt(dayMatch[1]));
        }
      });

      let monthSplitIndex = -1;
      for (let i = 1; i < dayNumbers.length; i++) {
        if (dayNumbers[i] < dayNumbers[i - 1]) {
          monthSplitIndex = i;
          break;
        }
      }

      const firstMonthInTable = currentMonth === 1 ? 12 : currentMonth - 1;
      const secondMonthInTable = currentMonth;

      let currentRow = null;
      let matchedRowMonth = null;
      let matchedDayNum = '';

      for (let idx = 0; idx < allRows.length; idx++) {
        const tr = allRows[idx];
        const tds = Array.from(tr.children);
        if (tds.length <= DATE_COL) continue;

        const dayText = safeText(tds[DATE_COL]);
        const dayMatch = dayText.match(/^\s*(\d{1,2})\s*$/);
        if (!dayMatch) continue;

        const foundDay = parseInt(dayMatch[1]);
        const isInFirstMonth = monthSplitIndex < 0 || idx < monthSplitIndex;
        const rowMonth = isInFirstMonth ? firstMonthInTable : secondMonthInTable;

        if (foundDay === currentDay && rowMonth === currentMonth) {
          currentRow = tr;
          matchedRowMonth = rowMonth;
          matchedDayNum = dayText;
          break;
        }
      }

      if (!currentRow) throw new Error('Current row not found');

      const cells = Array.from(currentRow.children);
      hijriDate = safeText(cells[1]);
      const monthName = monthNamesAr[matchedRowMonth] || '';
      gregDate = `${matchedDayNum} ${monthName} ${now.getFullYear()}`;

      const arabicNames = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
      const prayerColumns = { Fajr: 3, Dhuhr: 5, Asr: 6, Maghrib: 7, Isha: 8 };

      const todayBase = new Date();
      const todayDate = new Date(todayBase.getFullYear(), todayBase.getMonth(), todayBase.getDate());

      const order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      prayersToday = order.map((k) => {
        const colIdx = prayerColumns[k];
        if (colIdx >= cells.length) return null;
        const ts = extractTimeStr(cells[colIdx]);
        if (!isTimeStr(ts)) return null;
        return { key: k, name: arabicNames[k], timeStr: ts, date: atTime(ts, todayDate) };
      }).filter(Boolean);

      const currentRowIndex = allRows.indexOf(currentRow);
      const prevRow = currentRowIndex > 0 ? allRows[currentRowIndex - 1] : null;
      const nextRow = currentRowIndex < allRows.length - 1 ? allRows[currentRowIndex + 1] : null;

      let ishaYesterday = null;
      if (prevRow) {
        const prevCells = Array.from(prevRow.children);
        const prevIshaStr = extractTimeStr(prevCells[8]);
        if (isTimeStr(prevIshaStr)) {
          const y = new Date(todayDate); y.setDate(y.getDate() - 1);
          ishaYesterday = { key: 'Isha', name: arabicNames.Isha, timeStr: prevIshaStr, date: atTime(prevIshaStr, y) };
        }
      }

      let fajrTomorrow = null;
      if (nextRow) {
        const nextCells = Array.from(nextRow.children);
        const nextFajrStr = extractTimeStr(nextCells[3]);
        if (isTimeStr(nextFajrStr)) {
          const t = new Date(todayDate); t.setDate(t.getDate() + 1);
          fajrTomorrow = { key: 'Fajr', name: arabicNames.Fajr, timeStr: nextFajrStr, date: atTime(nextFajrStr, t) };
        }
      }

      function computePrevNext() {
        const now = new Date();
        let next = prayersToday.find((p) => p.date > now) || null;
        if (!next) next = fajrTomorrow || null;
        let prev = null;
        for (let i = prayersToday.length - 1; i >= 0; i--) {
          if (prayersToday[i].date <= now) { prev = prayersToday[i]; break; }
        }
        if (!prev) prev = ishaYesterday || null;
        return { prev, next, now };
      }

      // Render
      const ui = buildContainer(hijriDate, gregDate, prayersToday, cityName, currentVilleId, getFavorites());
      const toggleBtn = createTimeFormatToggle(() => {
        document.querySelectorAll('.tmk-prayer-time').forEach((el) => {
          const tile = el.closest('.tmk-prayer-tile');
          if (tile) {
            const prayerKey = tile.dataset.prayerKey;
            const prayer = prayersToday.find(p => p.key === prayerKey);
            if (prayer) el.textContent = formatTime(prayer.timeStr);
          }
        });
      });
      
      const themeModeBtn = createThemeModeToggle(() => {
        window.location.reload();
      });
      
      const themeBtn = createThemeSelector(() => {
        window.location.reload();
      });

      const controlsWrapper = document.createElement('div');
      controlsWrapper.className = 'tmk-controls-wrapper';
      controlsWrapper.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto 20px auto;
        padding: 16px 20px;
        box-sizing: border-box;
        background: ${theme.main};
        border-radius: 0;
        border: 1px solid ${theme.borderInactive};
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        font-family: 'JetBrains Mono', 'Courier New', monospace;
      `;
      if (citySelCloned) controlsWrapper.appendChild(citySelCloned);
      
      const favoriteBtn = createFavoriteButton(currentVilleId, cityName, () => {
        window.location.reload();
      });
      controlsWrapper.appendChild(favoriteBtn);
      controlsWrapper.appendChild(themeModeBtn);
      controlsWrapper.appendChild(themeBtn);
      controlsWrapper.appendChild(toggleBtn);

      document.body.innerHTML = '';
      
      const favPanel = createFavoritesPanel();
      if (favPanel) document.body.appendChild(favPanel);
      
      document.body.appendChild(controlsWrapper);
      document.body.appendChild(ui);

      GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body { 
          background: ${theme.main};
          margin: 0;
          padding: 32px 20px;
          min-height: 100vh;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          color: ${theme.text};
          overflow-x: hidden;
        }
        
        select option {
          background: ${theme.main};
          color: ${theme.text};
        }
        
        .tmk-prayer-tile:hover {
          background: ${theme.main} !important;
          border-color: ${theme.accent} !important;
          box-shadow: 0 0 0 1px ${theme.accent} !important;
        }
        
        .tmk-prayer-tile.active {
          background: ${theme.main} !important;
          border: 2px solid ${theme.accent} !important;
          box-shadow: 0 0 0 3px ${theme.accent}33, 0 4px 8px rgba(0,0,0,0.3) !important;
          position: relative;
        }
        
        .tmk-prayer-tile.active::before {
          content: '▶';
          position: absolute;
          left: 8px;
          top: 8px;
          color: ${theme.accent};
          font-size: 10px;
          animation: terminalBlink 1.5s infinite;
        }
        
        @keyframes terminalBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        
        .tmk-prayer-tile.active .tmk-prayer-name {
          color: ${theme.accent} !important;
        }
        
        .tmk-prayer-tile.active .tmk-prayer-time {
          color: ${theme.subtext} !important;
          font-size: 18px !important;
          font-weight: 600 !important;
        }
        
        .tmk-prayer-tile.active .tmk-countdown {
          color: ${theme.accent} !important;
          font-size: 24px !important;
          font-weight: 700 !important;
        }
        
        .tmk-prayer-tile.active .tmk-prayer-icon {
          color: ${theme.accent} !important;
        }
        
        /* Responsive styles */
        @media (max-width: 900px) {
          .tmk-tiles-container {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 10px !important;
          }
          
          .tmk-controls-wrapper {
            flex-wrap: wrap;
          }
        }
        
        @media (max-width: 600px) {
          body {
            padding: 20px 12px;
          }
          
          .tmk-tiles-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          
          .tmk-prayer-tile.active .tmk-countdown {
            font-size: 20px !important;
          }
          
          .tmk-controls-wrapper {
            padding: 14px 16px !important;
            gap: 8px !important;
          }
        }
      `);

      let lastNotifiedKey = null;
      function tick() {
        const { prev, next, now } = computePrevNext();
        const statusEl = document.getElementById('tmk-status');
        const prevInfoEl = document.getElementById('tmk-prev-info');

        document.querySelectorAll('.tmk-prayer-tile').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tmk-countdown').forEach(c => c.textContent = '');

        if (next) {
          const msLeft = next.date - now;
          
          const nextTile = document.querySelector(`.tmk-prayer-tile[data-prayer-key="${next.key}"]`);
          if (nextTile) {
            nextTile.classList.add('active');
            const countdown = nextTile.querySelector('.tmk-countdown');
            if (countdown) countdown.textContent = formatDiff(msLeft);
          }

          if (statusEl) {
            statusEl.innerHTML = `
              <span style="display:inline-flex;align-items:center;gap:8px;color:${theme.subtext}">
                <span>[</span>
                <span style="font-weight:600;color:${theme.accent}">${next.name}</span>
                <span style="opacity:0.6">in</span>
                <span style="font-weight:700;color:${theme.text};font-variant-numeric:tabular-nums">${formatDiff(msLeft)}</span>
                <span>]</span>
              </span>`;
          }

          const key = `${next.key}-${next.date.toDateString()}`;
          if (msLeft <= 5 * 60 * 1000 && msLeft > 0 && lastNotifiedKey !== key) {
            const notify = () => new Notification(`5 minutes until ${next.name}`, { body: `Time: ${formatTime(next.timeStr)}`, icon: '🕌' });
            if (typeof Notification !== 'undefined') {
              if (Notification.permission === 'granted') { notify(); lastNotifiedKey = key; }
              else { Notification.requestPermission().then((p) => { if (p === 'granted') { notify(); lastNotifiedKey = key; } }); }
            }
          }
        } else {
          if (statusEl) statusEl.innerHTML = '';
        }

        if (prev) {
          const msSince = now - prev.date;
          if (prevInfoEl) prevInfoEl.innerHTML = `
            <span style="display:inline-flex;align-items:center;gap:8px;color:${theme.muted}">
              <span>✓</span>
              <span style="color:${theme.subtext};font-weight:600">${prev.name}</span>
              <span style="opacity:0.5">|</span>
              <span style="font-weight:500">${formatDiff(msSince)} ago</span>
            </span>`;
        } else {
          if (prevInfoEl) prevInfoEl.innerHTML = `<span style="color:${theme.muted}">🕌 // habous ministry</span>`;
        }
      }

      Notification?.requestPermission?.();
      tick();
      setInterval(tick, 1000);

      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) tick();
      });
      
      // Keyboard navigation for favorite cities (ArrowLeft/ArrowRight)
      document.addEventListener('keydown', (e) => {
        const favorites = getFavorites();
        if (favorites.length < 2) return; // Need at least 2 favorites to navigate
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          const currentIndex = favorites.findIndex(f => f.id === currentVilleId);
          if (currentIndex === -1) return; // Current city not in favorites
          
          e.preventDefault(); // Prevent page scrolling
          
          let newIndex;
          if (e.key === 'ArrowLeft') {
            newIndex = currentIndex === 0 ? favorites.length - 1 : currentIndex - 1;
          } else {
            newIndex = currentIndex === favorites.length - 1 ? 0 : currentIndex + 1;
          }
          
          const nextFav = favorites[newIndex];
          const url = new URL(window.location.href);
          url.searchParams.set('ville', nextFav.id);
          window.location.href = url.toString();
        }
      });
      
      document.title = 'Prayer Times [Terminal]';
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${theme.accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="M12 8a4 4 0 0 1 4 4v8H8v-8a4 4 0 0 1 4-4z"/><path d="M8 22H4v-6a4 4 0 0 1 4-4"/><path d="M16 22h4v-6a4 4 0 0 0-4-4"/><path d="M4 22h16"/><circle cx="12" cy="5" r="1" fill="${theme.accent}"/></svg>`;
      link.href = 'data:image/svg+xml,' + encodeURIComponent(svgIcon);
      
      document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());
      document.head.appendChild(link);

    } catch (err) {
      console.error('[TMK] Prayer script error:', err);
      document.body.innerHTML = `<div style="padding:40px;text-align:center;color:${theme.notificationError};font-family:'JetBrains Mono','Courier New',monospace">// error loading prayer times</div>`;
    }
  }

  run();
})();
