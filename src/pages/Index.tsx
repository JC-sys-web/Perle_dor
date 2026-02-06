import { useState, useMemo, useEffect } from 'react';
import { Package } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { Product } from '@/types';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminPanel } from '@/components/AdminPanel';
import { BookPagination } from '@/components/BookPagination';
import { cn } from '@/lib/utils';

// WhatsApp number for contact (format: country code + number without + or spaces)
const WHATSAPP_NUMBER = '33612345678';
const DEFAULT_ROWS = 5; // Nombre de lignes à afficher

const Index = () => {
  const {
    products,
    categories,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    verifyAdminPassword,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState<number>(4);
  const [productsPerPage, setProductsPerPage] = useState<number>(columns * DEFAULT_ROWS);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

  // Handle product URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId && products.length > 0) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // helper to get category name
    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name?.toLowerCase() || '';

    if (!q) {
      // only filter by category when no search query
      return products.filter(p => !selectedCategory || p.categoryId === selectedCategory);
    }

    const tokens = q.split(/\s+/).filter(Boolean);

    // compute relevance score and return products that match
    const scored = products.map(p => {
      let score = 0;
      const name = p.name.toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const cat = getCategoryName(p.categoryId);

      // exact name contains => strong boost
      if (name.includes(q)) score += 50;
      // token matches
      tokens.forEach(t => {
        if (name.includes(t)) score += 10;
        if (desc.includes(t)) score += 6;
        if (cat.includes(t)) score += 4;
      });

      // small boost for category exact
      if (cat === q) score += 8;

      return { product: p, score };
    });

    // filter by score > 0 and category selection
    const filtered = scored
      .filter(s => s.score > 0 && (!selectedCategory || s.product.categoryId === selectedCategory))
      .sort((a, b) => b.score - a.score || new Date(b.product.createdAt).getTime() - new Date(a.product.createdAt).getTime())
      .map(s => s.product);

    return filtered;
  }, [products, searchQuery, selectedCategory, categories]);

  // Debugging counts to ensure pagination works
  useEffect(() => {
    console.debug('API products count:', products.length);
    console.debug('Filtered products count:', filteredProducts.length);
  }, [products, filteredProducts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Calculate columns based on window width (match Tailwind breakpoints)
  useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      let cols = 2; // default
      if (w >= 1280) cols = 5;
      else if (w >= 1024) cols = 4;
      else if (w >= 768) cols = 3;
      else if (w >= 640) cols = 2;
      else cols = 2;
      setColumns(cols);
      setProductsPerPage(cols * DEFAULT_ROWS);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage, productsPerPage]);

  useEffect(() => {
    console.debug('Paginated products count:', paginatedProducts.length, 'currentPage:', currentPage);
  }, [paginatedProducts, currentPage]);

  // Update displayed products with animation
  useEffect(() => {
    if (!isAnimating) {
      setDisplayedProducts(paginatedProducts);
    }
  }, [paginatedProducts, isAnimating]);

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || isAnimating) return;

    const direction = newPage > currentPage ? 'left' : 'right';
    setAnimationDirection(direction);
    setIsAnimating(true);

    // After exit animation, change page and start enter animation
    setTimeout(() => {
      setCurrentPage(newPage);
      setDisplayedProducts(filteredProducts.slice((newPage - 1) * productsPerPage, newPage * productsPerPage));
      setAnimationDirection(direction === 'left' ? 'right' : 'left');
      
      setTimeout(() => {
        setIsAnimating(false);
        setAnimationDirection(null);
      }, 400);
    }, 400);
  };

  const handleAdminLogin = async (password: string) => {
    const ok = await verifyAdminPassword(password);
    if (ok) {
      setShowAdminLogin(false);
      setShowAdminPanel(true);
      return true;
    }
    return false;
  };

  const getCategoryForProduct = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const getAnimationClass = () => {
    if (!isAnimating || !animationDirection) return '';
    
    if (animationDirection === 'left') {
      return isAnimating && displayedProducts !== paginatedProducts 
        ? 'page-flip-exit-left' 
        : 'page-flip-enter-right';
    } else {
      return isAnimating && displayedProducts !== paginatedProducts 
        ? 'page-flip-exit-right' 
        : 'page-flip-enter-left';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-heading text-2xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAdminClick={() => setShowAdminLogin(true)} />

      {/* Hero Section */}
      <section className="py-8 sm:py-16 px-3 sm:px-4 bg-gradient-to-b from-cream to-background">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-3 sm:mb-4">
            Notre Collection
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg mb-6 sm:mb-10 px-2">
            Découvrez notre sélection de produits d'exception, soigneusement choisis pour vous.
          </p>

          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-6 sm:py-12 px-2 sm:px-4">
        <div className="container mx-auto">
          {/* Results count */}
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-muted-foreground text-sm">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              {totalPages > 1 && ` • Page ${currentPage} sur ${totalPages}`}
            </p>
          </div>

          {displayedProducts.length > 0 ? (
            <>
              <div 
                className={cn(
                  "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6",
                  getAnimationClass(),
                  // disable pointer events during animation to prevent accidental clicks
                  isAnimating && 'pointer-events-none'
                )}
              >
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category={getCategoryForProduct(product.categoryId)}
                    onViewDetails={setSelectedProduct}
                    whatsappNumber={WHATSAPP_NUMBER}
                  />
                ))}
              </div>

              <div className="relative z-50">
                <BookPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isAnimating={isAnimating}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12 sm:py-20">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-heading text-lg sm:text-xl text-foreground mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {searchQuery || selectedCategory
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Aucun produit n\'a encore été ajouté au catalogue.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 border-t border-border bg-cream">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-xs sm:text-sm">
            © 2024 Perle d'Or. Tous droits réservés.
          </p>
        </div>
      </footer>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        category={selectedProduct ? getCategoryForProduct(selectedProduct.categoryId) : undefined}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        whatsappNumber={WHATSAPP_NUMBER}
      />

      {/* Admin Login */}
      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLogin={handleAdminLogin}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        products={products}
        categories={categories}
        onAddProduct={addProduct}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
      />
    </div>
  );
};

export default Index;
