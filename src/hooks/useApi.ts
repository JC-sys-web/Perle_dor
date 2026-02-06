 /**
  * PERLE D'OR - Hooks API
  * Hooks React pour interagir avec le backend PHP
  */
 
 import { useState, useEffect, useCallback } from 'react';
 import { Product, Category } from '@/types';
 import { 
   authApi, 
   productsApi, 
   categoriesApi, 
   ProductFilters 
 } from '@/services/api';
 
 // ============================================
 // AUTH HOOK
 // ============================================
 export function useAuth() {
   const [isAuthenticated, setIsAuthenticated] = useState(authApi.isAuthenticated());
   const [user, setUser] = useState<{ id: number; username: string; email: string } | null>(null);
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     const verifyAuth = async () => {
       if (authApi.isAuthenticated()) {
         try {
           const response = await authApi.verify();
           setUser(response.user);
           setIsAuthenticated(true);
         } catch {
           authApi.logout();
           setIsAuthenticated(false);
           setUser(null);
         }
       }
       setIsLoading(false);
     };
 
     verifyAuth();
   }, []);
 
   const login = useCallback(async (username: string, password: string) => {
     const response = await authApi.login(username, password);
     setUser(response.user);
     setIsAuthenticated(true);
     return response;
   }, []);
 
   const logout = useCallback(() => {
     authApi.logout();
     setUser(null);
     setIsAuthenticated(false);
   }, []);
 
   return {
     isAuthenticated,
     user,
     isLoading,
     login,
     logout,
   };
 }
 
 // ============================================
 // PRODUCTS HOOK
 // ============================================
 export function useProducts(filters: ProductFilters = {}) {
   const [products, setProducts] = useState<Product[]>([]);
   const [pagination, setPagination] = useState({
     page: 1,
     limit: 10,
     total: 0,
     pages: 0,
   });
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   const fetchProducts = useCallback(async () => {
     setIsLoading(true);
     setError(null);
     try {
       const response = await productsApi.getAll(filters);
       setProducts(response.data);
       setPagination(response.pagination);
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
     } finally {
       setIsLoading(false);
     }
   }, [filters.category, filters.search, filters.page, filters.limit]);
 
   useEffect(() => {
     fetchProducts();
   }, [fetchProducts]);
 
   const addProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt'>) => {
     const result = await productsApi.create(product);
     await fetchProducts();
     return result;
   }, [fetchProducts]);
 
   const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
     const result = await productsApi.update(id, updates);
     await fetchProducts();
     return result;
   }, [fetchProducts]);
 
   const deleteProduct = useCallback(async (id: string) => {
     const result = await productsApi.delete(id);
     await fetchProducts();
     return result;
   }, [fetchProducts]);
 
   return {
     products,
     pagination,
     isLoading,
     error,
     refetch: fetchProducts,
     addProduct,
     updateProduct,
     deleteProduct,
   };
 }
 
 // ============================================
 // CATEGORIES HOOK
 // ============================================
 export function useCategories() {
   const [categories, setCategories] = useState<Category[]>([]);
   const [productCounts, setProductCounts] = useState<Record<string, number>>({});
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   const fetchCategories = useCallback(async () => {
     setIsLoading(true);
     setError(null);
     try {
       const response = await categoriesApi.getAll();
       setCategories(response.data);
       setProductCounts(response.counts);
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
     } finally {
       setIsLoading(false);
     }
   }, []);
 
   useEffect(() => {
     fetchCategories();
   }, [fetchCategories]);
 
   const addCategory = useCallback(async (name: string) => {
     const result = await categoriesApi.create(name);
     await fetchCategories();
     return result;
   }, [fetchCategories]);
 
   const updateCategory = useCallback(async (id: string, name: string) => {
     const result = await categoriesApi.update(id, name);
     await fetchCategories();
     return result;
   }, [fetchCategories]);
 
   const deleteCategory = useCallback(async (id: string) => {
     const result = await categoriesApi.delete(id);
     await fetchCategories();
     return result;
   }, [fetchCategories]);
 
   return {
     categories,
     productCounts,
     isLoading,
     error,
     refetch: fetchCategories,
     addCategory,
     updateCategory,
     deleteCategory,
   };
 }
 
 // ============================================
 // COMBINED STORE HOOK (Compatible avec useStore existant)
 // ============================================
 export function useApiStore() {
   const [products, setProducts] = useState<Product[]>([]);
   const [categories, setCategories] = useState<Category[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [isOnline, setIsOnline] = useState(true);
 
   const fetchData = useCallback(async () => {
     setIsLoading(true);
     setError(null);
     try {
       const [productsRes, categoriesRes] = await Promise.all([
         productsApi.getAll({ limit: 100 }),
         categoriesApi.getAll(),
       ]);
       setProducts(productsRes.data);
       setCategories(categoriesRes.data);
       setIsOnline(true);
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Erreur de connexion au serveur');
       setIsOnline(false);
     } finally {
       setIsLoading(false);
     }
   }, []);
 
   useEffect(() => {
     fetchData();
   }, [fetchData]);
 
   const addProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt'>) => {
     await productsApi.create(product);
     await fetchData();
   }, [fetchData]);
 
   const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
     await productsApi.update(id, updates);
     await fetchData();
   }, [fetchData]);
 
   const deleteProduct = useCallback(async (id: string) => {
     await productsApi.delete(id);
     await fetchData();
   }, [fetchData]);
 
   const addCategory = useCallback(async (name: string) => {
     await categoriesApi.create(name);
     await fetchData();
   }, [fetchData]);
 
   const updateCategory = useCallback(async (id: string, name: string) => {
     await categoriesApi.update(id, name);
     await fetchData();
   }, [fetchData]);
 
   const deleteCategory = useCallback(async (id: string) => {
     await categoriesApi.delete(id);
     await fetchData();
   }, [fetchData]);
 
   const verifyAdminPassword = useCallback(async (password: string) => {
     try {
       await authApi.login('admin', password);
       return true;
     } catch {
       return false;
     }
   }, []);
 
   return {
     products,
     categories,
     isLoading,
     error,
     isOnline,
     refetch: fetchData,
     addProduct,
     updateProduct,
     deleteProduct,
     addCategory,
     updateCategory,
     deleteCategory,
     verifyAdminPassword,
   };
 }