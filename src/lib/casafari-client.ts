/**
 * CASAFARI API Client
 * Baseado na especificação OpenAPI 3.1.0
 * API Base URL: https://api.casafari.com
 */

const CASAFARI_API_BASE = 'https://api.casafari.com';

// Tipos TypeScript baseados no OpenAPI schema
export interface CasafariLoginRequest {
  email: string;
  password: string;
}

export interface CasafariTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CasafariProperty {
  propertyId: number;
  primaryListingId: number;
  type: string;
  typegroup: string;
  operations: string[];
  location: {
    locationId: number;
    name: string;
    administrativeLevel: string;
    zipcodes: string[];
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  totalarea: number;
  plotarea: number;
  terracearea: number;
  bathrooms: number;
  bedrooms: number;
  rooms: number;
  saleCurrency: string;
  salePrice: number;
  saleStatus: string;
  rentCurrency: string;
  rentPrice: number;
  rentStatus: string;
  thumbnails: string[];
  pictures: string[];
  description: string;
  propertyUrl: string;
}

export interface CasafariSearchRequest {
  operation?: 'sale' | 'rent';
  types?: string[];
  locationIds?: number[];
  conditions?: string[];
  statuses?: string[];
  priceFrom?: number;
  priceTo?: number;
  bedroomsFrom?: number;
  bedroomsTo?: number;
  totalAreaFrom?: number;
  totalAreaTo?: number;
}

export interface CasafariAlertFeed {
  id?: number;
  user?: string;
  name: string;
  filter: CasafariSearchRequest;
  private?: boolean;
  newDevelopment?: boolean;
}

class CasafariClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  /**
   * Faz login na API CASAFARI
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Tokens de acesso e refresh
   */
  async login(email: string, password: string): Promise<CasafariTokenResponse> {
    const response = await fetch(`${CASAFARI_API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data: CasafariTokenResponse = await response.json();
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
    return data;
  }

  /**
   * Atualiza o token de acesso
   * @returns Novo token de acesso
   */
  async refreshAccessToken(): Promise<string> {
    const response = await fetch(`${CASAFARI_API_BASE}/refresh-token`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data: { accessToken: string } = await response.json();
    this.accessToken = data.accessToken;
    return data.accessToken;
  }

  /**
   * Define o token de acesso manualmente
   */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Faz uma requisição autenticada à API
   */
  private async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.accessToken) {
      throw new Error('No access token available. Please login first.');
    }

    const response = await fetch(`${CASAFARI_API_BASE}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Se o token expirou, tenta renovar
    if (response.status === 401 && this.refreshToken) {
      await this.refreshAccessToken();
      // Tenta novamente com o novo token
      return fetch(`${CASAFARI_API_BASE}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    }

    return response;
  }

  // ENDPOINTS DE REFERÊNCIAS

  /**
   * Retorna lista de todos os tipos de imóveis
   */
  async getTypes(): Promise<any> {
    const response = await this.authenticatedFetch('/api/v1/references/types');
    return response.json();
  }

  /**
   * Retorna lista de características de imóveis
   */
  async getFeatures(): Promise<any> {
    const response = await this.authenticatedFetch('/api/v1/references/features');
    return response.json();
  }

  /**
   * Retorna localização por coordenadas
   */
  async getLocationByCoordinates(latitude: number, longitude: number): Promise<any> {
    const response = await this.authenticatedFetch(
      `/api/v1/references/locations/by-coordinates?latitude=${latitude}&longitude=${longitude}`
    );
    return response.json();
  }

  /**
   * Retorna condições de imóveis
   */
  async getConditions(): Promise<any> {
    const response = await this.authenticatedFetch('/api/v1/references/conditions');
    return response.json();
  }

  // ENDPOINTS DE PROPRIEDADES

  /**
   * Busca propriedades
   */
  async searchProperties(
    searchRequest: CasafariSearchRequest,
    options: { limit?: number; offset?: number; orderBy?: string; order?: 'asc' | 'desc' } = {}
  ): Promise<any> {
    const { limit = 20, offset = 0, orderBy = 'price', order = 'asc' } = options;
    
    const response = await this.authenticatedFetch(
      `/api/v2/properties/search?limit=${limit}&offset=${offset}&orderby=${orderBy}&order=${order}`,
      {
        method: 'POST',
        body: JSON.stringify(searchRequest),
      }
    );
    return response.json();
  }

  /**
   * Busca propriedade por ID
   */
  async getPropertyById(propertyId: number): Promise<any> {
    const response = await this.authenticatedFetch(`/api/v1/properties/search/${propertyId}`);
    return response.json();
  }

  // ENDPOINTS DE ALERTS/FEEDS

  /**
   * Lista todos os feeds de alerta
   */
  async getFeeds(options: { filter?: boolean; onlySelf?: boolean } = {}): Promise<CasafariAlertFeed[]> {
    const params = new URLSearchParams();
    if (options.filter !== undefined) params.set('filter', String(options.filter));
    if (options.onlySelf !== undefined) params.set('onlyself', String(options.onlySelf));
    
    const response = await this.authenticatedFetch(`/api/v1/listing-alerts/feeds?${params}`);
    return response.json();
  }

  /**
   * Cria um novo feed de alerta
   */
  async createFeed(feed: CasafariAlertFeed): Promise<CasafariAlertFeed> {
    const response = await this.authenticatedFetch('/api/v1/listing-alerts/feeds', {
      method: 'POST',
      body: JSON.stringify(feed),
    });
    return response.json();
  }

  /**
   * Busca alertas por feed ID
   */
  async getAlertsByFeedId(
    feedId: number,
    options: {
      limit?: number;
      offset?: number;
      orderBy?: string;
      alertDateFrom?: string;
      alertDateTo?: string;
    } = {}
  ): Promise<any> {
    const { limit = 50, offset = 0, orderBy = '-alertdate' } = options;
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      orderby: orderBy,
    });

    if (options.alertDateFrom) params.set('alertdatefrom', options.alertDateFrom);
    if (options.alertDateTo) params.set('alertdateto', options.alertDateTo);

    const response = await this.authenticatedFetch(
      `/api/v1/listing-alerts/feeds/${feedId}?${params}`
    );
    return response.json();
  }

  /**
   * Atualiza um feed de alerta
   */
  async updateFeed(feedId: number, feed: Partial<CasafariAlertFeed>): Promise<CasafariAlertFeed> {
    const response = await this.authenticatedFetch(`/api/v1/listing-alerts/feeds/${feedId}/update`, {
      method: 'PUT',
      body: JSON.stringify(feed),
    });
    return response.json();
  }

  /**
   * Delete um feed de alerta
   */
  async deleteFeed(feedId: number): Promise<{ success: boolean }> {
    const response = await this.authenticatedFetch(`/api/v1/listing-alerts/feeds/${feedId}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // ENDPOINTS DE COMPARÁVEIS

  /**
   * Busca propriedades comparáveis
   */
  async searchComparables(request: any): Promise<any> {
    const response = await this.authenticatedFetch('/api/v2/comparables/search', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.json();
  }

  // ENDPOINTS DE AVALIAÇÃO

  /**
   * Busca preços estimados
   */
  async getEstimatedPrices(request: any): Promise<any> {
    const response = await this.authenticatedFetch('/api/v1/valuation/comparables-prices', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.json();
  }
}

// Exporta uma instância singleton
export const casafariClient = new CasafariClient();

export default CasafariClient;
