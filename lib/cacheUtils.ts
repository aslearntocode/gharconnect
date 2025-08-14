/**
 * Cache busting utilities to prevent stale content issues
 */

// Generate a cache-busting version string
export const getCacheBuster = (): string => {
  // Use build time or current date as version
  if (process.env.NEXT_PUBLIC_BUILD_TIME) {
    return process.env.NEXT_PUBLIC_BUILD_TIME;
  }
  
  // Fallback to current date
  const now = new Date();
  return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
};

// Add cache buster to static assets
export const getAssetUrl = (path: string): string => {
  const version = getCacheBuster();
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}v=${version}`;
};

// Cache control headers for different content types
export const getCacheHeaders = (contentType: 'static' | 'dynamic' | 'api' = 'static') => {
  switch (contentType) {
    case 'static':
      return {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': `"${getCacheBuster()}"`,
      };
    case 'dynamic':
      return {
        'Cache-Control': 'public, max-age=3600, must-revalidate',
        'ETag': `"${getCacheBuster()}"`,
      };
    case 'api':
      return {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      };
    default:
      return {};
  }
};

// Force reload function for development
export const forceReload = (): void => {
  if (typeof window !== 'undefined') {
    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Force reload
    window.location.reload();
  }
};

// Check if content is stale
export const isContentStale = (lastModified: string, maxAge: number = 3600000): boolean => {
  const lastModifiedTime = new Date(lastModified).getTime();
  const currentTime = Date.now();
  return (currentTime - lastModifiedTime) > maxAge;
};
