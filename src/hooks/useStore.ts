 import { useState, useEffect, useCallback } from 'react';
 import { Product, Category } from '@/types';
 import { authApi, productsApi, categoriesApi } from '@/services/api';
 
 export function useStore() {
   const [products, setProducts] = useState<Product[]>([]);
   const [categories, setCategories] = useState<Category[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
 
   // Charger les données depuis l'API
   const loadData = useCallback(async () => {
     setIsLoading(true);
     setError(null);
     try {
       const [productsData, categoriesData] = await Promise.all([
         productsApi.getAll(),
         categoriesApi.getAll(),
       ]);
       setProducts(productsData.data);
       setCategories(categoriesData.data);
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Erreur de chargement');
       console.error('Erreur de chargement:', err);
     } finally {
       setIsLoading(false);
     }
   }, []);
 
   useEffect(() => {
     loadData();
   }, [loadData]);
 
   const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
     try {
       const result = await productsApi.create(product);
       const newProduct: Product = {
         ...product,
         id: result.id,
         createdAt: new Date(),
       };
       setProducts(prev => [...prev, newProduct]);
       return newProduct;
     } catch (err) {
       console.error('Erreur ajout produit:', err);
       throw err;
     }
   };
 
   const updateProduct = async (id: string, updates: Partial<Product>) => {
     try {
       await productsApi.update(id, updates);
       setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
     } catch (err) {
       console.error('Erreur mise à jour produit:', err);
       throw err;
     }
   };
 
   const deleteProduct = async (id: string) => {
     try {
       await productsApi.delete(id);
       setProducts(prev => prev.filter(p => p.id !== id));
     } catch (err) {
       console.error('Erreur suppression produit:', err);
       throw err;
     }
   };
 
   const addCategory = async (name: string) => {
     try {
       const result = await categoriesApi.create(name);
       const newCategory: Category = {
         id: result.id,
         name,
         createdAt: new Date(),
       };
       setCategories(prev => [...prev, newCategory]);
       return newCategory;
     } catch (err) {
       console.error('Erreur ajout catégorie:', err);
       throw err;
     }
   };
 
   const updateCategory = async (id: string, name: string) => {
     try {
       await categoriesApi.update(id, name);
       setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
     } catch (err) {
       console.error('Erreur mise à jour catégorie:', err);
       throw err;
     }
   };
 
   const deleteCategory = async (id: string) => {
     try {
       await categoriesApi.delete(id);
       setCategories(prev => prev.filter(c => c.id !== id));
       // Supprimer aussi les produits de cette catégorie localement
       setProducts(prev => prev.filter(p => p.categoryId !== id));
     } catch (err) {
       console.error('Erreur suppression catégorie:', err);
       throw err;
     }
   };
 
   const verifyAdminPassword = async (password: string) => {
     try {
       const result = await authApi.login('admin', password);
       return !!result.token;
     } catch {
       return false;
     }
   };
 
   const refreshData = () => {
     loadData();
   };
 
   return {
     products,
     categories,
     isLoading,
     error,
     addProduct,
     updateProduct,
     deleteProduct,
     addCategory,
     updateCategory,
     deleteCategory,
     verifyAdminPassword,
     refreshData,
   };
 }
