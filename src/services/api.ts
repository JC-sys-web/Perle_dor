 /**
  * PERLE D'OR - Service API
  * Connexion au backend PHP
  */
 
 import { Product, Category } from '@/types';
 
 // Configuration - À modifier selon votre environnement
 const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
 
 // Types pour les réponses API
 interface ApiResponse<T> {
   data?: T;
   message?: string;
   error?: string;
 }
 
 interface PaginatedResponse<T> {
   data: T[];
   pagination: {
     page: number;
     limit: number;
     total: number;
     pages: number;
   };
 }
 
 interface LoginResponse {
   token: string;
   user: {
     id: number;
     username: string;
     email: string;
   };
 }
 
 interface UploadResponse {
   url: string;
   filename: string;
   size: number;
   type: string;
 }
 
 // Stockage du token
 const TOKEN_KEY = 'perle_dor_token';
 
 function getToken(): string | null {
   return localStorage.getItem(TOKEN_KEY);
 }
 
 function setToken(token: string): void {
   localStorage.setItem(TOKEN_KEY, token);
 }
 
 function removeToken(): void {
   localStorage.removeItem(TOKEN_KEY);
 }
 
 // Fonction utilitaire pour les requêtes
 async function apiRequest<T>(
   endpoint: string,
   options: RequestInit = {}
 ): Promise<T> {
   const token = getToken();
   
   const headers: HeadersInit = {
     'Content-Type': 'application/json',
     ...options.headers,
   };
   
   if (token) {
     (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
   }
   
   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
     ...options,
     headers,
   });
  // Try to parse JSON, but handle empty or non-JSON responses gracefully
  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // Not JSON
    data = null;
  }

  if (!response.ok) {
    const message = (data && (data.error || data.message)) || response.statusText || 'Une erreur est survenue';
    throw new Error(message);
  }

  // If response is OK but no JSON body, return an empty object
  return data ?? {};
 }
 
 // ============================================
 // AUTH API
 // ============================================
 export const authApi = {
   async login(username: string, password: string): Promise<LoginResponse> {
     const response = await apiRequest<LoginResponse>('/auth/login', {
       method: 'POST',
       body: JSON.stringify({ username, password }),
     });
     setToken(response.token);
     return response;
   },
 
   async verify(): Promise<{ valid: boolean; user: LoginResponse['user'] }> {
     return apiRequest('/auth/verify', { method: 'POST' });
   },
 
   async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
     return apiRequest('/auth/change-password', {
       method: 'POST',
       body: JSON.stringify({ currentPassword, newPassword }),
     });
   },

  async updateProfile(username: string, email: string): Promise<{ token?: string; user?: LoginResponse['user']; message?: string }> {
    const response = await apiRequest<{ token?: string; user?: LoginResponse['user']; message?: string }>('/auth/update', {
      method: 'POST',
      body: JSON.stringify({ username, email }),
    });
    // If backend returns a new token, persist it locally
    if ((response as any).token) {
      setToken((response as any).token);
    }
    return response;
  },
 
   logout(): void {
     removeToken();
   },
 
   isAuthenticated(): boolean {
     return !!getToken();
   },
 
   getToken,
 };
 
 // ============================================
 // PRODUCTS API
 // ============================================
 export interface ProductFilters {
   category?: string;
   search?: string;
   page?: number;
   limit?: number;
 }
 
 export interface ApiProduct {
   id: string;
   name: string;
   price: number;
   category_id: string;
   category_name: string;
   description: string;
   images: string[];
   created_at: string;
 }
 
 // Convertir le format API vers le format frontend
 function mapApiProduct(apiProduct: ApiProduct): Product {
   return {
     id: apiProduct.id,
     name: apiProduct.name,
     price: apiProduct.price,
     categoryId: apiProduct.category_id,
     description: apiProduct.description,
     images: apiProduct.images || [],
     createdAt: new Date(apiProduct.created_at),
   };
 }
 
 export const productsApi = {
   async getAll(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    // Si aucune limite fournie, demander un maximum raisonnable (backend limite à 100)
    if (!filters.limit) filters.limit = 100;
    const params = new URLSearchParams();
     if (filters.category) params.append('category', filters.category);
     if (filters.search) params.append('search', filters.search);
     if (filters.page) params.append('page', filters.page.toString());
     if (filters.limit) params.append('limit', filters.limit.toString());
     
     const queryString = params.toString();
     const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
     
     const response = await apiRequest<PaginatedResponse<ApiProduct>>(endpoint);
     
     return {
       data: response.data.map(mapApiProduct),
       pagination: response.pagination,
     };
   },
 
   async getById(id: string): Promise<Product> {
     const apiProduct = await apiRequest<ApiProduct>(`/products/${id}`);
     return mapApiProduct(apiProduct);
   },
 
   async create(product: Omit<Product, 'id' | 'createdAt'>): Promise<{ id: string; message: string }> {
     return apiRequest('/products', {
       method: 'POST',
       body: JSON.stringify({
         name: product.name,
         price: product.price,
         categoryId: product.categoryId,
         description: product.description,
         images: product.images,
       }),
     });
   },
 
   async update(id: string, updates: Partial<Product>): Promise<{ message: string }> {
     return apiRequest(`/products/${id}`, {
       method: 'PUT',
       body: JSON.stringify({
         name: updates.name,
         price: updates.price,
         categoryId: updates.categoryId,
         description: updates.description,
         images: updates.images,
       }),
     });
   },
 
   async delete(id: string): Promise<{ message: string }> {
     return apiRequest(`/products/${id}`, { method: 'DELETE' });
   },
 };
 
 // ============================================
 // CATEGORIES API
 // ============================================
 export interface ApiCategory {
   id: string;
   name: string;
   product_count: number;
   created_at: string;
 }
 
 function mapApiCategory(apiCategory: ApiCategory): Category {
   return {
     id: apiCategory.id,
     name: apiCategory.name,
     createdAt: new Date(apiCategory.created_at),
   };
 }
 
 export const categoriesApi = {
   async getAll(): Promise<{ data: Category[]; counts: Record<string, number> }> {
     const response = await apiRequest<{ data: ApiCategory[] }>('/categories');
     
     const counts: Record<string, number> = {};
     response.data.forEach((cat) => {
       counts[cat.id] = cat.product_count;
     });
     
     return {
       data: response.data.map(mapApiCategory),
       counts,
     };
   },
 
   async getById(id: string): Promise<Category> {
     const apiCategory = await apiRequest<ApiCategory>(`/categories/${id}`);
     return mapApiCategory(apiCategory);
   },
 
   async create(name: string): Promise<{ id: string; message: string }> {
     return apiRequest('/categories', {
       method: 'POST',
       body: JSON.stringify({ name }),
     });
   },
 
   async update(id: string, name: string): Promise<{ message: string }> {
     return apiRequest(`/categories/${id}`, {
       method: 'PUT',
       body: JSON.stringify({ name }),
     });
   },
 
   async delete(id: string): Promise<{ message: string }> {
     return apiRequest(`/categories/${id}`, { method: 'DELETE' });
   },
 };
 
 // ============================================
 // SETTINGS API
 // ============================================
 export const settingsApi = {
   async getAll(): Promise<Record<string, string>> {
     const response = await apiRequest<{ data: Record<string, string> }>('/settings');
     return response.data;
   },
 
   async get(key: string): Promise<string> {
     const response = await apiRequest<{ setting_value: string }>(`/settings/${key}`);
     return response.setting_value;
   },
 
   async update(settings: Record<string, string>): Promise<{ message: string }> {
     return apiRequest('/settings', {
       method: 'PUT',
       body: JSON.stringify(settings),
     });
   },
 };
 
 // ============================================
 // UPLOAD API
 // ============================================
 export const uploadApi = {
   async uploadImage(file: File): Promise<UploadResponse> {
     const token = getToken();
     const formData = new FormData();
     formData.append('image', file);
 
     const response = await fetch(`${API_BASE_URL}/upload`, {
       method: 'POST',
       headers: token ? { Authorization: `Bearer ${token}` } : {},
       body: formData,
     });
 
     const data = await response.json();
 
     if (!response.ok) {
       throw new Error(data.error || 'Erreur lors de l\'upload');
     }
 
     return data;
   },
 };
 
 // Export par défaut
 export default {
   auth: authApi,
   products: productsApi,
   categories: categoriesApi,
   settings: settingsApi,
   upload: uploadApi,
 };
