/**
 * Utility functions for Leaflet map initialization
 */

let leafletCssLoaded = false;
let markerClusterCssLoaded = false;

/**
 * Load Leaflet CSS if not already loaded
 */
export function loadLeafletCss(): void {
  if (leafletCssLoaded || typeof window === 'undefined') return;

  if (!document.querySelector('link[href*="leaflet.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }

  leafletCssLoaded = true;
}

/**
 * Load MarkerCluster CSS if not already loaded
 */
export function loadMarkerClusterCss(): void {
  if (markerClusterCssLoaded || typeof window === 'undefined') return;

  if (!document.querySelector('link[href*="MarkerCluster.css"]')) {
    const clusterLink = document.createElement('link');
    clusterLink.rel = 'stylesheet';
    clusterLink.href =
      'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
    document.head.appendChild(clusterLink);

    const clusterDefaultLink = document.createElement('link');
    clusterDefaultLink.rel = 'stylesheet';
    clusterDefaultLink.href =
      'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
    document.head.appendChild(clusterDefaultLink);
  }

  markerClusterCssLoaded = true;
}

/**
 * Fix Leaflet marker icon paths
 */
export function fixLeafletMarkerIcons(L: any): void {
  if (!L || !L.Icon || !L.Icon.Default) return;

  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

/**
 * Load and initialize Leaflet
 */
export async function initializeLeaflet(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('Leaflet can only be loaded in a browser environment');
  }

  const leaflet = await import('leaflet');
  const L = leaflet.default;

  loadLeafletCss();
  fixLeafletMarkerIcons(L);

  return L;
}

/**
 * Load and initialize MarkerCluster
 */
export async function initializeMarkerCluster(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('MarkerCluster can only be loaded in a browser environment');
  }

  loadMarkerClusterCss();
  const clusterModule = await import('leaflet.markercluster');
  return (clusterModule as any).default;
}
