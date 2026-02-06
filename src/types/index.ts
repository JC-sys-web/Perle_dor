export interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  description: string;
  images: string[];
  createdAt: Date;
}

export interface CatalogState {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  selectedCategory: string | null;
}
