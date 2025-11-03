import { useState, useEffect } from 'react';

// API Configuration
const API_BASE_URL = '/api';

// Custom hook for API calls
export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { apiCall, loading, error };
}

// API service functions
export const apiService = {
  // Places API
  places: {
    getAll: () => fetch(`${API_BASE_URL}/places`).then(r => r.json()),
    getById: (id: string) => fetch(`${API_BASE_URL}/places/${id}`).then(r => r.json()),
    create: (data: any) => fetch(`${API_BASE_URL}/places`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    search: (query: string) => fetch(`${API_BASE_URL}/places/search?q=${encodeURIComponent(query)}`).then(r => r.json()),
    nearby: (lat: number, lng: number, radius: number = 5000) => 
      fetch(`${API_BASE_URL}/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}`).then(r => r.json())
  },

  // Community API
  community: {
    getPosts: (limit = 10, offset = 0) => 
      fetch(`${API_BASE_URL}/community/posts?limit=${limit}&offset=${offset}`).then(r => r.json()),
    createPost: (data: any) => fetch(`${API_BASE_URL}/community/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    likePost: (id: string) => fetch(`${API_BASE_URL}/community/posts/${id}/like`, {
      method: 'POST'
    }).then(r => r.json()),
    commentOnPost: (id: string, content: string) => fetch(`${API_BASE_URL}/community/posts/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    }).then(r => r.json())
  },

  // Marketplace API
  marketplace: {
    getItems: (category?: string, limit = 12, offset = 0) => {
      const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
      if (category) params.append('category', category);
      return fetch(`${API_BASE_URL}/marketplace/items?${params}`).then(r => r.json());
    },
    getItemById: (id: string) => fetch(`${API_BASE_URL}/marketplace/items/${id}`).then(r => r.json()),
    createItem: (data: any) => fetch(`${API_BASE_URL}/marketplace/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    searchItems: (query: string) => 
      fetch(`${API_BASE_URL}/marketplace/items/search?q=${encodeURIComponent(query)}`).then(r => r.json())
  },

  // Crowdfunding API
  crowdfunding: {
    getCampaigns: (limit = 10, offset = 0) => 
      fetch(`${API_BASE_URL}/crowdfunding/campaigns?limit=${limit}&offset=${offset}`).then(r => r.json()),
    getCampaignById: (id: string) => fetch(`${API_BASE_URL}/crowdfunding/campaigns/${id}`).then(r => r.json()),
    createCampaign: (data: any) => fetch(`${API_BASE_URL}/crowdfunding/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),
    backCampaign: (id: string, amount: number) => fetch(`${API_BASE_URL}/crowdfunding/campaigns/${id}/back`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    }).then(r => r.json())
  },

  // NGO API
  ngos: {
    getAll: () => fetch(`${API_BASE_URL}/ngos`).then(r => r.json()),
    getById: (id: string) => fetch(`${API_BASE_URL}/ngos/${id}`).then(r => r.json()),
    register: (data: any) => fetch(`${API_BASE_URL}/ngos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json())
  },

  // Education API
  education: {
    getModules: () => fetch(`${API_BASE_URL}/education/modules`).then(r => r.json()),
    getModuleById: (id: string) => fetch(`${API_BASE_URL}/education/modules/${id}`).then(r => r.json()),
    enrollInModule: (id: string) => fetch(`${API_BASE_URL}/education/modules/${id}/enroll`, {
      method: 'POST'
    }).then(r => r.json()),
    trackProgress: (moduleId: string, progress: number) => fetch(`${API_BASE_URL}/education/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleId, progress })
    }).then(r => r.json())
  },

  // Gemini AI API
  ai: {
    chat: (message: string, sessionId?: string) => fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId })
    }).then(r => r.json()),

    analyzeVision: (imageData: string, analysisType: string = 'accessibility') => fetch(`${API_BASE_URL}/vision-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData, analysisType })
    }).then(r => r.json()),

    processVoice: (audioData: Blob) => {
      const formData = new FormData();
      formData.append('audio', audioData);
      return fetch(`${API_BASE_URL}/voice-process`, {
        method: 'POST',
        body: formData
      }).then(r => r.json());
    },

    analyzeDocument: (documentData: string, analysisType: string = 'accessibility') => fetch(`${API_BASE_URL}/document-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentData, analysisType })
    }).then(r => r.json()),

    locationAssistance: (userMessage: string, userLocation?: { lat: number; lng: number }) => fetch(`${API_BASE_URL}/location-assistance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, location: userLocation })
    }).then(r => r.json())
  },

  // Analytics API
  analytics: {
    trackEvent: (event: string, data: any) => fetch(`${API_BASE_URL}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data, timestamp: new Date().toISOString() })
    }),
    getStats: () => fetch(`${API_BASE_URL}/analytics/stats`).then(r => r.json())
  }
};

// Real-time data hooks
export function usePlaces() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiService.places.getAll()
      .then(setPlaces)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { places, loading, error, refetch: () => window.location.reload() };
}

export function useCommunityPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiService.community.getPosts()
      .then(setPosts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const createPost = async (postData: any) => {
    try {
      const newPost = await apiService.community.createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      throw err;
    }
  };

  return { posts, loading, error, createPost };
}

export function useMarketplace() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiService.marketplace.getItems()
      .then(setItems)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}

export function useCrowdfunding() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiService.crowdfunding.getCampaigns()
      .then(setCampaigns)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const backCampaign = async (campaignId: string, amount: number) => {
    try {
      const result = await apiService.crowdfunding.backCampaign(campaignId, amount);
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, raised: campaign.raised + amount, backers: campaign.backers + 1 }
          : campaign
      ));
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to back campaign');
      throw err;
    }
  };

  return { campaigns, loading, error, backCampaign };
}

// Utility functions
export const utils = {
  formatCurrency: (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount),

  formatDate: (date: string | Date) => new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date)),

  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  debounce: (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }
};

export default apiService;