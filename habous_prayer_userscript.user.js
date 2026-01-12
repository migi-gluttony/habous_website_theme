// ==UserScript==
// @name         Habous Minimal Prayer Times + Alerts
// @namespace    https://github.com/your-namespace
// @version      0.6.0
// @description  Keep city selector; show only today's prayer times, live countdowns, and 5‑minute alerts.
// @match        https://habous.gov.ma/prieres/horaire_hijri_2.php*
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  function safeText(el) { return el ? (el.textContent || "").trim() : ""; }
  function isTimeStr(s) { return /\b\d{1,2}:\d{2}\b/.test(s || ""); }

  const uiIcons = {
    starFilled: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    starOutline: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
  };

  // Time format preference (default: 24-hour)
  let use12Hour = localStorage.getItem('tmk-time-format') === '12';

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
    return index < 0; // Return true if added, false if removed
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
      padding: 14px 48px 14px 20px;
      font-size: 15px;
      font-weight: 500;
      border-radius: 32px;
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.9);
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      outline: none;
      appearance: none;
      min-width: 200px;
      transition: all 0.3s ease;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    `;
    
    const arrow = document.createElement('div');
    arrow.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    arrow.style.cssText = 'position:absolute;right:16px;top:50%;transform:translateY(-50%);pointer-events:none;color:rgba(255,255,255,0.5);transition:all 0.3s ease';
    
    cloned.addEventListener('mouseover', () => {
      cloned.style.background = 'rgba(255,255,255,0.1)';
      cloned.style.borderColor = 'rgba(255,255,255,0.2)';
      arrow.style.color = 'rgba(255,255,255,0.8)';
    });
    cloned.addEventListener('mouseout', () => {
      if (document.activeElement !== cloned) {
        cloned.style.background = 'rgba(255,255,255,0.06)';
        cloned.style.borderColor = 'rgba(255,255,255,0.1)';
        arrow.style.color = 'rgba(255,255,255,0.5)';
      }
    });
    cloned.addEventListener('focus', () => {
      cloned.style.background = 'rgba(255,255,255,0.08)';
      cloned.style.borderColor = 'rgba(255,255,255,0.3)';
      cloned.style.boxShadow = '0 0 0 4px rgba(255,255,255,0.05)';
      arrow.style.transform = 'translateY(-50%) rotate(180deg)';
      arrow.style.color = 'white';
    });
    cloned.addEventListener('blur', () => {
      cloned.style.boxShadow = 'none';
      cloned.style.background = 'rgba(255,255,255,0.06)';
      cloned.style.borderColor = 'rgba(255,255,255,0.1)';
      arrow.style.transform = 'translateY(-50%) rotate(0deg)';
      arrow.style.color = 'rgba(255,255,255,0.5)';
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
      const url = `${location.origin}${location.pathname}?${params.toString()}`;
      window.location.href = url;
    });
    
    wrapper.appendChild(cloned);
    wrapper.appendChild(arrow);
    return wrapper;
  }

  function createTimeFormatToggle(onToggle) {
    const btn = document.createElement('button');
    btn.id = 'tmk-time-format-btn';
    btn.className = 'tmk-glass-btn';
    btn.style.cssText = `
      padding: 14px 20px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 32px;
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.9);
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span>${use12Hour ? '12H' : '24H'}</span>`;
    
    btn.addEventListener('mouseover', () => {
      btn.style.background = 'rgba(255,255,255,0.1)';
      btn.style.borderColor = 'rgba(255,255,255,0.25)';
      btn.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('mouseout', () => {
      btn.style.background = 'rgba(255,255,255,0.06)';
      btn.style.borderColor = 'rgba(255,255,255,0.1)';
      btn.style.transform = 'translateY(0)';
    });
    btn.addEventListener('click', () => {
      use12Hour = !use12Hour;
      localStorage.setItem('tmk-time-format', use12Hour ? '12' : '24');
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span>${use12Hour ? '12H' : '24H'}</span>`;
      if (onToggle) onToggle();
    });
    return btn;
  }

  function createFavoriteButton(villeId, cityName, onToggle) {
    const btn = document.createElement('button');
    btn.id = 'tmk-favorite-btn';
    btn.className = 'tmk-glass-btn';
    const isFav = isFavorite(villeId);
    btn.style.cssText = `
      padding: 14px 18px;
      border-radius: 32px;
      background: rgba(255,255,255,0.06);
      color: ${isFav ? '#fbbf24' : 'rgba(255,255,255,0.8)'};
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    btn.innerHTML = isFav ? uiIcons.starFilled : uiIcons.starOutline;
    btn.title = isFav ? 'Remove from favorites' : 'Add to favorites';
    
    btn.addEventListener('mouseover', () => {
      btn.style.background = 'rgba(251,191,36,0.15)';
      btn.style.borderColor = 'rgba(251,191,36,0.3)';
      btn.style.transform = 'translateY(-2px) scale(1.05)';
      btn.style.color = '#fbbf24';
    });
    btn.addEventListener('mouseout', () => {
      const currentFav = isFavorite(villeId);
      btn.style.background = 'rgba(255,255,255,0.06)';
      btn.style.borderColor = 'rgba(255,255,255,0.1)';
      btn.style.transform = 'translateY(0) scale(1)';
      btn.style.color = currentFav ? '#fbbf24' : 'rgba(255,255,255,0.8)';
    });
    btn.addEventListener('click', () => {
      const added = toggleFavorite(villeId, cityName);
      btn.innerHTML = added ? uiIcons.starFilled : uiIcons.starOutline;
      btn.style.color = added ? '#fbbf24' : 'rgba(255,255,255,0.8)';
      btn.title = added ? 'Remove from favorites' : 'Add to favorites';
      if (onToggle) onToggle();
    });
    return btn;
  }

  function createFavoritesPanel() {
    const favorites = getFavorites();
    if (favorites.length === 0) return null;

    const panel = document.createElement('div');
    panel.className = 'tmk-favorites-panel tmk-glass-panel';
    panel.style.cssText = `
      width: 100%;
      max-width: 980px;
      margin: 0 auto 24px auto;
      padding: 24px 32px;
      box-sizing: border-box;
      background: rgba(255,255,255,0.04);
      border-radius: 40px;
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(40px);
      display: flex;
      flex-direction: column;
      gap: 16px;
    `;
    
    const title = document.createElement('div');
    title.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.4);font-weight:700;text-transform:uppercase;letter-spacing:1.5px;display:flex;align-items:center;gap:8px';
    title.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Favorites';
    
    const favList = document.createElement('div');
    favList.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px';
    
    favorites.forEach(fav => {
      const favBtn = document.createElement('button');
      favBtn.className = 'tmk-fav-city-btn';
      favBtn.style.cssText = `
        padding: 10px 18px;
        font-size: 13px;
        border-radius: 20px;
        background: rgba(255,255,255,0.06);
        color: rgba(255,255,255,0.8);
        border: 1px solid rgba(255,255,255,0.08);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
      `;
      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = fav.name;
      
      const removeBtn = document.createElement('span');
      removeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      removeBtn.style.cssText = 'opacity:0;transition:all 0.2s ease;width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:rgba(239,68,68,0.15);color:#f87171';
      
      favBtn.appendChild(nameSpan);
      favBtn.appendChild(removeBtn);
      
      favBtn.addEventListener('mouseover', () => {
        favBtn.style.background = 'rgba(255,255,255,0.1)';
        favBtn.style.transform = 'translateY(-2px)';
        removeBtn.style.opacity = '1';
      });
      favBtn.addEventListener('mouseout', () => {
        favBtn.style.background = 'rgba(255,255,255,0.06)';
        favBtn.style.transform = 'translateY(0)';
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

  // Prayer color themes - softer for glass effect
  const prayerColors = {
    Fajr: { primary: '#7dd3fc', gradient: 'linear-gradient(145deg, rgba(56,189,248,0.3) 0%, rgba(14,165,233,0.2) 100%)', glow: 'rgba(56,189,248,0.5)' },
    Dhuhr: { primary: '#86efac', gradient: 'linear-gradient(145deg, rgba(74,222,128,0.3) 0%, rgba(34,197,94,0.2) 100%)', glow: 'rgba(74,222,128,0.5)' },
    Asr: { primary: '#fcd34d', gradient: 'linear-gradient(145deg, rgba(251,191,36,0.3) 0%, rgba(245,158,11,0.2) 100%)', glow: 'rgba(251,191,36,0.5)' },
    Maghrib: { primary: '#fca5a5', gradient: 'linear-gradient(145deg, rgba(248,113,113,0.3) 0%, rgba(239,68,68,0.2) 100%)', glow: 'rgba(248,113,113,0.5)' },
    Isha: { primary: '#c4b5fd', gradient: 'linear-gradient(145deg, rgba(167,139,250,0.3) 0%, rgba(139,92,246,0.2) 100%)', glow: 'rgba(167,139,250,0.5)' }
  };

  function buildContainer(hijriDate, gregDate, prayersToday, cityName, currentVilleId, favorites = []) {
    const container = document.createElement('div');
    container.id = 'tmk-prayer-container';
    container.className = 'tmk-glass-container';
    container.style.cssText = `
      width: 100%;
      max-width: 980px;
      margin: 0 auto;
      background: rgba(255,255,255,0.03);
      border-radius: 56px;
      border: 1px solid rgba(255,255,255,0.1);
      overflow: hidden;
      backdrop-filter: blur(60px) saturate(180%);
      -webkit-backdrop-filter: blur(60px) saturate(180%);
      box-shadow: 
        0 40px 80px -20px rgba(0,0,0,0.5),
        inset 0 0 0 1px rgba(255,255,255,0.05);
      position: relative;
    `;
    
    // Add shine effect
    const shine = document.createElement('div');
    shine.style.cssText = 'position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);z-index:2';
    container.appendChild(shine);

    // Header with no hard border, just subtle separation
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 40px 48px 20px;
      position: relative;
      z-index:1;
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

       // Conditions for displaying arrows
       // If length == 2: Index 0 shows RIGHT (Next), Index 1 shows LEFT (Prev)
       // If length > 2: Show BOTH
       const showLeft = favorites.length > 2 || (favorites.length === 2 && currentIndex === 1);
       const showRight = favorites.length > 2 || (favorites.length === 2 && currentIndex === 0);

       const navBtnStyle = `
          display:inline-flex;align-items:center;justify-content:center;
          width:28px;height:28px;border-radius:50%;
          background:rgba(255,255,255,0.1);
          color:white;text-decoration:none;
          transition:all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.1);
          flex-shrink: 0;
       `;
       const navTextStyle = `
          font-size:11px;color:rgba(255,255,255,0.4);font-weight:500;white-space:nowrap;
          transition:all 0.2s ease;
       `;

       const leftControl = showLeft ? `
         <a href="?ville=${prevFav.id}" style="display:flex;align-items:center;gap:8px;text-decoration:none;margin-right:8px;" 
            onmouseover="this.querySelector('div').style.background='rgba(255,255,255,0.2)';this.querySelector('div').style.transform='translateX(-2px)'"
            onmouseout="this.querySelector('div').style.background='rgba(255,255,255,0.1)';this.querySelector('div').style.transform='translateX(0)'"
            title="Previous: ${prevFav.name}">
            <span style="${navTextStyle}">${prevFav.name}</span>
            <div style="${navBtnStyle}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </div>
         </a>
       ` : '';

       const rightControl = showRight ? `
         <a href="?ville=${nextFav.id}" style="display:flex;align-items:center;gap:8px;text-decoration:none;margin-left:8px;"
            onmouseover="this.querySelector('div').style.background='rgba(255,255,255,0.2)';this.querySelector('div').style.transform='translateX(2px)'"
            onmouseout="this.querySelector('div').style.background='rgba(255,255,255,0.1)';this.querySelector('div').style.transform='translateX(0)'"
            title="Next: ${nextFav.name}">
            <div style="${navBtnStyle}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
            <span style="${navTextStyle}">${nextFav.name}</span>
         </a>
       ` : '';
       
       cityContent = `
         <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;min-width:320px;gap:12px;">
           <div style="justify-self:end;">${leftControl}</div>
           
           <div style="display:flex;flex-direction:column;align-items:center;text-align:center;">
              <h2 style="font-size:24px;font-weight:700;margin:0;color:white;letter-spacing:-0.5px;text-align:center;white-space:nowrap;">
                ${cityName || 'Morocco'}
              </h2>
             <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:6px;display:flex;align-items:center;justify-content:center;gap:5px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;">
               ${uiIcons.starFilled.replace('width="20" height="20"', 'width="12" height="12" style="color:#fbbf24"')}
               Favorites (${currentIndex + 1}/${favorites.length})
             </div>
           </div>

           <div style="justify-self:start;">${rightControl}</div>
         </div>
       `;
    } else {
       // Standard display
       cityContent = `
         <div style="text-align:center;">
             <h2 style="font-size:28px;font-weight:700;margin:0;color:white;letter-spacing:-0.5px;">${cityName || 'Morocco'}</h2>
         </div>
       `;
    }

    header.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;">
        <div style="display:flex;align-items:center;gap:20px;">
          <div style="
            width: 64px;
            height: 64px;
            border-radius: 20px;
            background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
          ">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v2"/>
              <path d="M12 8a4 4 0 0 1 4 4v8H8v-8a4 4 0 0 1 4-4z"/>
              <path d="M8 22H4v-6a4 4 0 0 1 4-4"/>
              <path d="M16 22h4v-6a4 4 0 0 0-4-4"/>
              <path d="M4 22h16"/>
              <circle cx="12" cy="5" r="1" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h1 style="font-size:36px;font-weight:700;margin:0;color:white;letter-spacing:-0.5px;text-shadow:0 2px 10px rgba(0,0,0,0.3)">Prayer Times</h1>
          </div>
        </div>
        
        ${cityContent}
        
        <div style="text-align:right">
          <div style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,0.4);margin-bottom:4px">Today</div>
          <div style="font-size:18px;color:rgba(255,255,255,0.9);font-weight:600">${hijriDate || ''}</div>
          <div style="font-size:14px;color:rgba(255,255,255,0.5);margin-top:2px">${gregDate || ''}</div>
        </div>
      </div>
    `;

    // Prayer tiles container
    const tilesContainer = document.createElement('div');
    tilesContainer.style.cssText = 'display:grid;grid-template-columns:repeat(5, 1fr);padding:20px 40px 48px;gap:20px';
    tilesContainer.className = 'tmk-tiles-container';

    if (prayersToday.length) {
      prayersToday.forEach((p, idx) => {
        const colors = prayerColors[p.key] || prayerColors.Fajr;
        const icon = prayerIcons[p.key] || '';
        const tile = document.createElement('div');
        tile.className = `tmk-prayer-tile ${p.key.toLowerCase()}-tile`;
        // Removed inline styles here because we use class now; minimal overrides only
        tile.style.cssText = `padding: 24px 12px; text-align: center; cursor: default;`;
        
        tile.dataset.prayerKey = p.key;
        tile.dataset.prayerColor = colors.primary;
        
        const tileContent = `
          <div class="tmk-tile-color" style="position:absolute;inset:0;background:${colors.gradient};opacity:0;transition:opacity 0.6s ease;border-radius:inherit;"></div>
          <div class="tmk-tile-glow" style="position:absolute;inset:0;background:radial-gradient(circle at 50% 0%, ${colors.glow}, transparent 70%);opacity:0;transition:opacity 0.6s ease;mix-blend-mode:screen;border-radius:inherit;"></div>
          
          <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;">
            <div class="tmk-prayer-icon" style="width:40px;height:40px;margin-bottom:12px;color:rgba(255,255,255,0.8);transition:all 0.4s ease;">${icon}</div>
            <div class="tmk-prayer-name" style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;margin-bottom:8px;letter-spacing:1px;transition:all 0.4s ease">${p.name}</div>
            <div class="tmk-time tmk-prayer-time" style="font-size:24px;font-weight:600;color:rgba(255,255,255,0.9);margin-bottom:4px;font-feature-settings:'tnum';letter-spacing:0px;transition:all 0.4s ease;">${formatTime(p.timeStr)}</div>
            <div class="tmk-countdown" style="font-size:12px;color:rgba(255,255,255,0.5);min-height:20px;font-weight:500;transition:all 0.4s ease;"></div>
          </div>
        `;
        tile.innerHTML = tileContent;
        tilesContainer.appendChild(tile);
      });
    } else {
      // (Simplified error state)
      const msg = document.createElement('div');
      msg.style.cssText = `grid-column: 1/-1; padding: 60px; text-align: center; opacity: 0.5; font-size: 16px;`;
      msg.innerHTML = 'Unable to load prayer times';
      tilesContainer.appendChild(msg);
    }
    
    // Status / Next Prayer Info (Previously in footer, now integrated into the bottom or just a small bar)
    // We can put it in a separate bar below the main container or keep it inside.
    // Let's keep a minimal footer inside.
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 20px 48px 24px;
      border-top: 1px solid rgba(255,255,255,0.05);
      font-size: 13px;
      color: rgba(255,255,255,0.4);
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    return `${pad(h)}h ${pad(m)}m ${pad(ss)}s`;
  }

  function run() {
    const citySelOriginal = findCitySelect();
    const citySelCloned = citySelOriginal ? cloneCitySelect(citySelOriginal) : null;
    const cityName = citySelOriginal?.options[citySelOriginal.selectedIndex]?.textContent || 'Your City';
    
    // Get current ville ID from URL
    const params = new URLSearchParams(window.location.search);
    const currentVilleId = params.get('ville') || '1';

    const table = document.querySelector('#horaire');
    let hijriDate = '', gregDate = '';
    let prayersToday = [];

    try {
      if (!table) throw new Error('Table #horaire not found');

      // Header row detection
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

      // Simple logic: Column 3 (index 2) is the Gregorian date column
      const DATE_COL = 2;
      const PRAYER_START_COL = 3; // Prayer times start from column 4 (index 3)

      const monthNamesAr = {
        1: 'يناير', 2: 'فبراير', 3: 'مارس', 4: 'أبريل', 5: 'ماي', 6: 'يونيو',
        7: 'يوليوز', 8: 'غشت', 9: 'شتنبر', 10: 'أكتوبر', 11: 'نونبر', 12: 'ديسمبر'
      };

      // Get current date info
      const now = new Date();
      const currentDay = now.getDate();
      const currentMonth = now.getMonth() + 1; // 1-12

      console.log('[TMK] Today is:', now.toDateString(), '| Day:', currentDay, '| Month:', currentMonth);

      // Get all table rows (excluding header)
      const allRows = Array.from(table.querySelectorAll('tr')).filter(tr => tr !== headerRow);

      // Extract all day numbers to find where the month splits
      const dayNumbers = [];
      allRows.forEach((tr) => {
        const tds = Array.from(tr.children);
        if (tds.length > DATE_COL) {
          const dayText = safeText(tds[DATE_COL]);
          const dayMatch = dayText.match(/^\s*(\d{1,2})\s*$/);
          if (dayMatch) {
            dayNumbers.push(parseInt(dayMatch[1]));
          }
        }
      });

      console.log('[TMK] Day numbers in table:', dayNumbers);

      // Find where days reset (month boundary)
      let monthSplitIndex = -1;
      for (let i = 1; i < dayNumbers.length; i++) {
        if (dayNumbers[i] < dayNumbers[i - 1]) {
          monthSplitIndex = i;
          console.log('[TMK] Month split detected at row index:', monthSplitIndex, '| Days go from', dayNumbers[i-1], 'to', dayNumbers[i]);
          break;
        }
      }

      // Determine which month is first based on current date
      const firstMonthLastDay = monthSplitIndex > 0 ? dayNumbers[monthSplitIndex - 1] : 31;
      const firstMonthInTable = currentMonth === 1 ? 12 : currentMonth - 1; // Assume previous month comes first
      const secondMonthInTable = currentMonth;

      console.log('[TMK] First month in table:', firstMonthInTable, '| Ends at day:', firstMonthLastDay);
      console.log('[TMK] Second month in table:', secondMonthInTable);

      // Search for matching row
      let currentRow = null;
      let matchedRowMonth = null;
      let matchedDayNum = '';

      console.log('[TMK] ===== SEARCHING FOR DAY', currentDay, '=====');

      for (let idx = 0; idx < allRows.length; idx++) {
        const tr = allRows[idx];
        const tds = Array.from(tr.children);
        if (tds.length <= DATE_COL) continue;

        const dayText = safeText(tds[DATE_COL]);
        const dayMatch = dayText.match(/^\s*(\d{1,2})\s*$/);
        if (!dayMatch) continue;

        const foundDay = parseInt(dayMatch[1]);

        // Determine which month this row belongs to
        const isInFirstMonth = monthSplitIndex < 0 || idx < monthSplitIndex;
        const rowMonth = isInFirstMonth ? firstMonthInTable : secondMonthInTable;

        console.log(`[TMK] Row ${idx}: Day ${foundDay} -> Month ${rowMonth}`);

        if (foundDay === currentDay && rowMonth === currentMonth) {
          console.log('[TMK] ✓✓✓ FOUND MATCH!');
          currentRow = tr;
          matchedRowMonth = rowMonth;
          matchedDayNum = dayText;
          break;
        }
      }

      if (!currentRow) {
        console.error('[TMK] ❌ Row not found for day:', currentDay, 'month:', currentMonth);
        throw new Error('Current row not found');
      }

      console.log('[TMK] ✓ Selected row | Day:', matchedDayNum, '| Month:', matchedRowMonth);

      // Get all cells from the matched row
      const cells = Array.from(currentRow.children);

      // Column 0: Day name (ignore)
      // Column 1: Hijri date
      // Column 2: Gregorian day number
      // Columns 3+: Prayer times (الصبح، الشروق، الظهر، العصر، المغرب، العشاء)

      const hijriDate = safeText(cells[1]);
      const monthName = monthNamesAr[matchedRowMonth] || '';
      gregDate = `${matchedDayNum} ${monthName} ${now.getFullYear()}`;

      console.log('[TMK] Date info | Hijri:', hijriDate, '| Gregorian:', gregDate);

      // Extract prayer times from columns 3 onwards
      const arabicNames = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
      const prayerColumns = {
        Fajr: 3,    // الصبح
        // Skip: 4 (الشروق - sunrise, not a prayer)
        Dhuhr: 5,   // الظهر
        Asr: 6,     // العصر
        Maghrib: 7, // المغرب
        Isha: 8     // العشاء
      };

      const todayBase = new Date();
      const todayDate = new Date(todayBase.getFullYear(), todayBase.getMonth(), todayBase.getDate());

      const order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      prayersToday = order.map((k) => {
        const colIdx = prayerColumns[k];
        if (colIdx >= cells.length) return null;
        const ts = extractTimeStr(cells[colIdx]);
        if (!isTimeStr(ts)) return null;
        console.log(`[TMK] ${arabicNames[k]}: ${ts}`);
        return { key: k, name: arabicNames[k], timeStr: ts, date: atTime(ts, todayDate) };
      }).filter(Boolean);

      // Get adjacent days for boundary calculations
      const currentRowIndex = allRows.indexOf(currentRow);
      const prevRow = currentRowIndex > 0 ? allRows[currentRowIndex - 1] : null;
      const nextRow = currentRowIndex < allRows.length - 1 ? allRows[currentRowIndex + 1] : null;

      let ishaYesterday = null;
      if (prevRow) {
        const prevCells = Array.from(prevRow.children);
        const prevIshaStr = extractTimeStr(prevCells[8]); // Column 8 is Isha
        if (isTimeStr(prevIshaStr)) {
          const y = new Date(todayDate); y.setDate(y.getDate() - 1);
          ishaYesterday = { key: 'Isha', name: arabicNames.Isha, timeStr: prevIshaStr, date: atTime(prevIshaStr, y) };
        }
      }

      let fajrTomorrow = null;
      if (nextRow) {
        const nextCells = Array.from(nextRow.children);
        const nextFajrStr = extractTimeStr(nextCells[3]); // Column 3 is Fajr
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
        // Update all time displays when toggled
        document.querySelectorAll('.tmk-prayer-time').forEach((el) => {
          const tile = el.closest('.tmk-prayer-tile');
          if (tile) {
            const prayerKey = tile.dataset.prayerKey;
            const prayer = prayersToday.find(p => p.key === prayerKey);
            if (prayer) el.textContent = formatTime(prayer.timeStr);
          }
        });
      });

      const controlsWrapper = document.createElement('div');
      controlsWrapper.className = 'tmk-controls-wrapper';
      controlsWrapper.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        width: 100%;
        max-width: 980px;
        margin: 0 auto 28px auto;
        padding: 16px 24px;
        box-sizing: border-box;
        background: rgba(255,255,255,0.03);
        border-radius: 32px;
        border: 1px solid rgba(255,255,255,0.08);
        backdrop-filter: blur(50px);
        -webkit-backdrop-filter: blur(50px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      `;
      if (citySelCloned) controlsWrapper.appendChild(citySelCloned);
      
      const favoriteBtn = createFavoriteButton(currentVilleId, cityName, () => {
        window.location.reload();
      });
      controlsWrapper.appendChild(favoriteBtn);
      controlsWrapper.appendChild(toggleBtn);

      document.body.innerHTML = '';
      document.body.appendChild(controlsWrapper);
      
      document.body.appendChild(ui);

      GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600;700&display=swap');
        
        :root {
          --glass-border: rgba(255, 255, 255, 0.15);
          --glass-bg: rgba(255, 255, 255, 0.05);
          --glass-highlight: rgba(255, 255, 255, 0.1);
          --font-primary: "SF Pro Display", "SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        }

        * {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body { 
          background: #050505;
          margin: 0;
          padding: 48px 28px;
          min-height: 100vh;
          font-family: var(--font-primary);
          color: white;
          overflow-x: hidden;
        }
        
        /* Ambient Background */
        body::before {
          content: '';
          position: fixed;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          background: 
            radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.25), transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.15), transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.2), transparent 40%),
            radial-gradient(circle at 10% 10%, rgba(20, 184, 166, 0.15), transparent 40%);
          filter: blur(90px);
          z-index: -2;
          animation: ambientMove 20s ease-in-out infinite alternate;
        }
        
        @keyframes ambientMove {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(2%, 2%) scale(1.05); }
        }
        
        /* Noise Texture */
        body::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          z-index: -1;
          pointer-events: none;
        }
        
        .tmk-tiles-container {
          max-width: 980px;
          margin: 0 auto;
        }
        
        .tmk-prayer-tile {
          transform: scale(1);
          border-radius: 36px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .tmk-prayer-tile:hover { 
          transform: translateY(-8px) scale(1.02);
          background: rgba(255,255,255,0.12) !important;
          border-color: rgba(255,255,255,0.25) !important;
          box-shadow: 
            0 24px 48px -12px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }
        
        .tmk-prayer-tile:hover .tmk-tile-color {
          opacity: 0.15 !important;
        }
        
        .tmk-prayer-tile:hover .tmk-tile-glow {
          opacity: 0.3 !important;
        }
        
        .tmk-prayer-tile:hover .tmk-prayer-icon {
          transform: scale(1.1);
          opacity: 1 !important;
        }
        
        /* Active tile - Liquid Glass Style */
        .tmk-prayer-tile.active {
          transform: translateY(-12px) scale(1.05) !important;
          z-index: 10;
          background: rgba(255,255,255,0.1) !important;
          border: 1px solid rgba(255,255,255,0.35) !important;
          box-shadow: 
            0 32px 64px -16px rgba(0,0,0,0.5),
            0 0 40px -10px var(--active-glow, rgba(150,150,255,0.3)),
            inset 0 0 0 1px rgba(255,255,255,0.1);
        }
        
        .tmk-prayer-tile.active .tmk-tile-color {
          opacity: 0.2 !important;
        }
        
        .tmk-prayer-tile.active .tmk-tile-glow {
          opacity: 0.6 !important;
          animation: liquidPulse 6s ease-in-out infinite;
        }
        
        .tmk-prayer-tile.active .tmk-tile-shine {
          opacity: 1;
          background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%) !important;
        }
        
        .tmk-prayer-tile.active .tmk-prayer-icon {
          transform: scale(1.2);
          opacity: 1 !important;
          filter: drop-shadow(0 0 12px var(--active-glow));
        }
        
        .tmk-prayer-tile.active .tmk-prayer-name { 
          color: white !important;
          letter-spacing: 2px !important;
          text-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        
        .tmk-prayer-tile.active .tmk-prayer-time { 
          opacity: 0.6 !important;
          transform: scale(0.9);
          margin-bottom: 0px !important;
          font-weight: 500 !important;
          font-size: 16px !important;
        }
        
        .tmk-prayer-tile.active .tmk-countdown { 
          color: white !important;
          font-size: 32px !important;
          font-weight: 700 !important;
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
          text-shadow: 0 4px 12px rgba(0,0,0,0.25);
          letter-spacing: -0.5px;
          margin-top: 4px !important;
          height: auto !important;
          min-height: auto !important;
          display: block !important;
          white-space: nowrap !important;
        }
        
        /* Prayer-specific glow colors */
        .fajr-tile.active { --active-glow: rgba(56,189,248,0.6); }
        .dhuhr-tile.active { --active-glow: rgba(74,222,128,0.6); }
        .asr-tile.active { --active-glow: rgba(251,191,36,0.6); }
        .maghrib-tile.active { --active-glow: rgba(248,113,113,0.6); }
        .isha-tile.active { --active-glow: rgba(167,139,250,0.6); }
        
        select option {
          background: #1a1a1a;
          color: #fff;
        }
        
        /* Responsive styles */
        @media (max-width: 900px) {
          .tmk-tiles-container {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }
          
          .tmk-prayer-tile.active {
            transform: scale(1.02) translateY(-8px) !important;
          }
          
          .tmk-controls-wrapper {
            flex-wrap: wrap;
          }
        }
        
        @media (max-width: 600px) {
          body {
            padding: 24px 16px;
          }
          
          .tmk-tiles-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          
          .tmk-prayer-tile.active .tmk-prayer-time {
            font-size: 28px !important;
          }
          
          .tmk-controls-wrapper {
            padding: 18px 20px !important;
            gap: 12px !important;
          }
        }
        
        @keyframes liquidPulse {
          0%, 100% { 
            opacity: 0.5; 
            transform: translate(-50%, -50%) scale(1);
            filter: blur(40px);
          }
          50% { 
            opacity: 0.7; 
            transform: translate(-50%, -50%) scale(1.2);
            filter: blur(50px);
          }
        }
      `);

      let lastNotifiedKey = null;
      function tick() {
        const { prev, next, now } = computePrevNext();
        const statusEl = document.getElementById('tmk-status');
        const prevInfoEl = document.getElementById('tmk-prev-info');

        // Clear all active states
        document.querySelectorAll('.tmk-prayer-tile').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tmk-countdown').forEach(c => c.textContent = '');

        if (next) {
          const msLeft = next.date - now;
          
          // Highlight upcoming prayer tile
          const nextTile = document.querySelector(`.tmk-prayer-tile[data-prayer-key="${next.key}"]`);
          if (nextTile) {
            nextTile.classList.add('active');
            const countdown = nextTile.querySelector('.tmk-countdown');
            if (countdown) countdown.textContent = formatDiff(msLeft);
          }

          // Update status with icon - liquid glass style
          if (statusEl) {
            statusEl.innerHTML = `
              <span style="display:inline-flex;align-items:center;gap:10px">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:rgba(255,255,255,0.1);border-radius:50%;border:1px solid rgba(255,255,255,0.15);">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </span>
                <span style="font-weight:600;color:white">${next.name}</span>
                <span style="opacity:0.6;font-size:12px;">in</span>
                <span style="font-weight:700;color:rgba(255,255,255,0.95);font-variant-numeric:tabular-nums">${formatDiff(msLeft)}</span>
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
            <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:rgba(52,211,153,0.15);border-radius:50%;margin-right:10px;border:1px solid rgba(52,211,153,0.2);">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
            <span style="color:rgba(255,255,255,0.9);font-weight:600">${prev.name}</span>
            <span style="color:rgba(255,255,255,0.2);margin:0 10px;font-size:8px">●</span>
            <span style="color:rgba(255,255,255,0.5);font-weight:500">${formatDiff(msSince)} ago</span>`;
        } else {
          if (prevInfoEl) prevInfoEl.innerHTML = `
            <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:rgba(255,255,255,0.06);border-radius:50%;margin-right:10px;border:1px solid rgba(255,255,255,0.1);">🕌</span>
            <span><span style="font-weight:600;color:rgba(255,255,255,0.7)">Source:</span> <span style="color:rgba(255,255,255,0.4);">Habous Ministry</span></span>`;
        }
      }

      Notification?.requestPermission?.();
      tick();
      const intervalId = setInterval(tick, 1000);

      // Detect when page becomes visible again (e.g., after laptop wakes from sleep)
      // and force recalculation to sync with current time
      let lastVisibilityChange = Date.now();
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          const timeSinceLastChange = Date.now() - lastVisibilityChange;
          // If more than 10 seconds passed while hidden, likely a sleep/wake event
          if (timeSinceLastChange > 10000) {
            console.log('[TMK] Page visible after', Math.round(timeSinceLastChange/1000), 'seconds - syncing times');
            tick(); // Force immediate update
          }
          lastVisibilityChange = Date.now();
        }
      });
      
      // Update Title and Favicon
      document.title = 'Prayer Times';
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      // Use media query to switch color for light mode if supported by browser
      const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><style>@media (prefers-color-scheme: light) { path, circle { stroke: black; } circle { fill: black; } }</style><path d="M12 2v2"/><path d="M12 8a4 4 0 0 1 4 4v8H8v-8a4 4 0 0 1 4-4z"/><path d="M8 22H4v-6a4 4 0 0 1 4-4"/><path d="M16 22h4v-6a4 4 0 0 0-4-4"/><path d="M4 22h16"/><circle cx="12" cy="5" r="1" fill="white"/></svg>`;
      link.href = 'data:image/svg+xml,' + encodeURIComponent(svgIcon);
      
      document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());
      document.head.appendChild(link);

    } catch (err) {
      // Fallback: render minimal panel even if parsing failed
      const ui = buildContainer('', '', [], cityName, currentVilleId, getFavorites());
      const toggleBtn = createTimeFormatToggle();
      const favoriteBtn = createFavoriteButton(currentVilleId, cityName);
      const controlsWrapper = document.createElement('div');
      controlsWrapper.className = 'tmk-controls-wrapper';
      controlsWrapper.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        margin: 0 auto 28px auto;
        max-width: 980px;
        padding: 16px 24px;
        background: rgba(255,255,255,0.03);
        border-radius: 32px;
        border: 1px solid rgba(255,255,255,0.08);
        backdrop-filter: blur(50px);
        -webkit-backdrop-filter: blur(50px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      `;
      if (citySelCloned) controlsWrapper.appendChild(citySelCloned);
      controlsWrapper.appendChild(favoriteBtn);
      controlsWrapper.appendChild(toggleBtn);
      
      document.body.innerHTML = '';
      document.body.appendChild(controlsWrapper);
      
      document.body.appendChild(ui);
      console.error('[TMK] Prayer script error:', err);
    }
  }

  run();
})();
