/**
 * Version Control & Cache Management
 * 
 * This utility handles checking for new app versions and clearing old caches
 * when a new deployment is detected.
 * 
 * Version Format: YYYYMMDD_HHMMSS (date_time)
 * This supports multiple deployments per day
 */

const VERSION_KEY = 'app_version';
const LAST_CHECK_KEY = 'app_version_last_check';
const POPUP_SHOWN_THIS_SESSION_KEY = 'app_version_popup_shown_session';
const CHECK_INTERVAL = 5000; // Min 5 seconds between checks
let isReloadingFlag = false; // Prevent multiple reload attempts
/**
 * Generate current build version from timestamp
 * Format: YYYYMMDD_HHMMSS (e.g., "20260624_150242")
 * This ensures unique versions even for same-day deployments
 */
const getBuildVersion = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};

/**
 * Check if enough time has passed since last check
 */
const shouldCheck = (): boolean => {
  const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
  if (!lastCheck) return true;
  
  const timeSinceLastCheck = Date.now() - parseInt(lastCheck, 10);
  return timeSinceLastCheck > CHECK_INTERVAL;
};

/**
 * Check if app has been updated and clear cache if needed
 */
export const checkAndClearCache = async () => {
  // Prevent check from running too frequently
  if (!shouldCheck()) {
    console.log('[VERSION] Skipping check - too soon since last check');
    return;
  }

  // Update last check time
  localStorage.setItem(LAST_CHECK_KEY, Date.now().toString());

  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const currentVersion = getBuildVersion();

    console.log('[VERSION] Checking... Stored:', storedVersion, 'Current:', currentVersion);

    // Check if we already showed the popup this session
    const popupShownThisSession = sessionStorage.getItem(POPUP_SHOWN_THIS_SESSION_KEY);
    console.log('[VERSION] Popup already shown this session:', !!popupShownThisSession);

    // If version has changed, clear caches and notify user
    if (storedVersion && storedVersion !== currentVersion && !popupShownThisSession) {
      console.log(`[VERSION] Version mismatch detected! Update needed.`);
      
      // Clear service worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          console.log(`[VERSION] Clearing cache: ${cacheName}`);
          await caches.delete(cacheName);
        }
      }

      // Mark that we've shown popup this session (prevents duplicate popups)
      sessionStorage.setItem(POPUP_SHOWN_THIS_SESSION_KEY, 'true');
      
      // Notify user and reload (will show popup)
      notifyUserAndReload(currentVersion);
    } else if (!storedVersion) {
      // First visit, set the version
      localStorage.setItem(VERSION_KEY, currentVersion);
      console.log(`[VERSION] First visit - app version: ${currentVersion}`);
    } else if (popupShownThisSession) {
      console.log(`[VERSION] Popup already shown this session, skipping...`);
    } else {
      console.log(`[VERSION] Version is current: ${currentVersion}`);
    }
  } catch (error) {
    console.error('[VERSION] Error checking version:', error);
  }
};

/**
 * Notify user of app update and reload page
 */
const notifyUserAndReload = (newVersion: string) => {
  // Prevent multiple reload attempts
  if (isReloadingFlag) {
    console.log('[VERSION] Reload already in progress, skipping...');
    return;
  }

  const message = 'New version of the app is available! Please refresh to get the latest updates.';
  
  try {
    const userConfirmed = window.confirm(message + '\n\nClick OK to refresh now.');
    
    if (userConfirmed) {
      isReloadingFlag = true;
      console.log('[VERSION] User confirmed reload, performing hard refresh...');
      
      // Store in sessionStorage that popup was shown (prevents duplicate popups during refresh)
      sessionStorage.setItem(POPUP_SHOWN_THIS_SESSION_KEY, 'true');
      
      // Update the stored version to current
      localStorage.setItem(VERSION_KEY, newVersion);
      console.log('[VERSION] Updated stored version:', newVersion);
      
      // Show loading overlay
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'version-loading-overlay';
      loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-size: 18px;
        font-weight: bold;
        font-family: Arial, sans-serif;
      `;
      loadingDiv.textContent = 'Loading latest version...';
      document.body.appendChild(loadingDiv);
      
      // Clear check throttle to allow fresh check on next session
      localStorage.removeItem(LAST_CHECK_KEY);
      console.log('[VERSION] Cleared check throttle, triggering reload...');
      
      // Perform reload (server has no-cache headers, so we don't need URL params)
      setTimeout(() => {
        console.log('[VERSION] Triggering reload...');
        window.location.reload();
      }, 300);
      
      // Fallback 1: Force reload
      setTimeout(() => {
        console.log('[VERSION] Fallback 1: location.reload(true)');
        location.reload(true);
      }, 1500);
      
      // Fallback 2: Standard reload
      setTimeout(() => {
        console.log('[VERSION] Fallback 2: window.location.reload()');
        window.location.reload();
      }, 3000);
    } else {
      console.log('[VERSION] User deferred refresh');
      showUpdateBanner();
    }
  } catch (error) {
    console.error('[VERSION] Error in notifyUserAndReload:', error);
    // Fallback: just reload anyway
    isReloadingFlag = true;
    setTimeout(() => {
      console.log('[VERSION] Error fallback: reloading page');
      window.location.reload();
    }, 500);
  }
};

/**
 * Show persistent update banner (optional - when user defers refresh)
 */
const showUpdateBanner = () => {
  // Check if banner already exists
  if (document.getElementById('app-update-banner')) {
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'app-update-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #fbbf24;
    color: #000;
    padding: 12px;
    text-align: center;
    z-index: 9999;
    font-weight: 500;
    font-family: Arial, sans-serif;
  `;
  banner.innerHTML = `
    <span>A new version is available! </span>
    <button onclick="window.location.reload()" style="margin-left: 12px; padding: 4px 12px; cursor: pointer; background: #f59e0b; border: none; border-radius: 4px; font-weight: bold; font-family: Arial, sans-serif;">
      Refresh Now
    </button>
  `;
  document.body.insertBefore(banner, document.body.firstChild);
};

/**
 * Alternative: Check version.json file from server
 * You can create a /public/version.json file with build version and deploy it
 * This is useful if you want server-side control of version bumping
 */
export const checkVersionFromServer = async () => {
  if (!shouldCheck()) {
    return;
  }

  localStorage.setItem(LAST_CHECK_KEY, Date.now().toString());

  try {
    // Add timestamp to prevent caching of version.json itself
    const response = await fetch(`/version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
    
    if (!response.ok) {
      console.warn('[VERSION] Could not fetch version.json');
      return;
    }

    const versionData = await response.json();
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const popupShownThisSession = sessionStorage.getItem(POPUP_SHOWN_THIS_SESSION_KEY);
    const serverVersion = versionData.version;

    console.log('[VERSION SERVER] Stored:', storedVersion, 'Server:', serverVersion, 'PopupShown:', !!popupShownThisSession);

    if (storedVersion && storedVersion !== serverVersion && !popupShownThisSession) {
      console.log(`[VERSION SERVER] App updated detected`);
      
      // Mark popup as shown this session
      sessionStorage.setItem(POPUP_SHOWN_THIS_SESSION_KEY, 'true');
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
        }
      }

      localStorage.setItem(VERSION_KEY, serverVersion);
      notifyUserAndReload(serverVersion);
    } else {
      localStorage.setItem(VERSION_KEY, serverVersion);
    }
  } catch (error) {
    console.error('[VERSION SERVER] Error checking server version:', error);
  }
};
