/**
 * Version Control & Cache Management
 * 
 * This utility handles checking for new app versions and clearing old caches
 * when a new deployment is detected.
 */

const VERSION_KEY = 'app_version';
const BUILD_ID = `build_${new Date().toISOString().split('T')[0]}`;

/**
 * Check if app has been updated and clear cache if needed
 */
export const checkAndClearCache = async () => {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const currentVersion = BUILD_ID;

    // If version has changed, clear caches
    if (storedVersion && storedVersion !== currentVersion) {
      console.log(`[VERSION] App updated from ${storedVersion} to ${currentVersion}`);
      
      // Clear localStorage (optional - only clear app-specific data, not auth)
      // localStorage.clear(); // Be careful with this
      
      // Clear service worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          console.log(`[VERSION] Clearing cache: ${cacheName}`);
          await caches.delete(cacheName);
        }
      }

      // Update version
      localStorage.setItem(VERSION_KEY, currentVersion);

      // Notify user and reload
      notifyUserAndReload();
    } else if (!storedVersion) {
      // First visit, set the version
      localStorage.setItem(VERSION_KEY, currentVersion);
      console.log(`[VERSION] First visit - app version: ${currentVersion}`);
    }
  } catch (error) {
    console.error('[VERSION] Error checking version:', error);
  }
};

/**
 * Notify user of app update and reload page
 */
const notifyUserAndReload = () => {
  // Use a simple alert or toast notification
  const message = 'New version of the app is available! Please refresh to get the latest updates.';
  
  // Option 1: Simple browser confirm
  if (window.confirm(message + '\n\nClick OK to refresh now.')) {
    // Hard refresh to bypass cache
    window.location.href = window.location.pathname;
  } else {
    // Still show a persistent banner that the app needs refresh
    console.warn('[VERSION] User deferred refresh');
    showUpdateBanner();
  }
};

/**
 * Show persistent update banner (optional)
 */
const showUpdateBanner = () => {
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
  `;
  banner.innerHTML = `
    <span>A new version is available! </span>
    <button onclick="window.location.reload()" style="margin-left: 12px; padding: 4px 12px; cursor: pointer; background: #f59e0b; border: none; border-radius: 4px; font-weight: bold;">
      Refresh Now
    </button>
  `;
  document.body.insertBefore(banner, document.body.firstChild);
};

/**
 * Alternative: Check manifest file for version (more reliable)
 */
export const checkManifestVersion = async () => {
  try {
    const response = await fetch('/manifest.json?t=' + Date.now());
    const manifest = await response.json();
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const currentVersion = manifest.version || BUILD_ID;

    if (storedVersion && storedVersion !== currentVersion) {
      console.log(`[MANIFEST] App updated. Clearing cache...`);
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
        }
      }

      localStorage.setItem(VERSION_KEY, currentVersion);
      notifyUserAndReload();
    } else {
      localStorage.setItem(VERSION_KEY, currentVersion);
    }
  } catch (error) {
    console.error('[MANIFEST] Error checking manifest version:', error);
  }
};
