import { useState, useRef } from 'react';
import { X, Plus, Pencil, Trash2, Package, Tag, ArrowLeft, ImagePlus, X as XIcon, Upload, Share2, Link } from 'lucide-react';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { uploadApi } from '@/services/api';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (name: string) => void;
  onUpdateCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export function AdminPanel({
  isOpen,
  onClose,
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    categoryId: '',
    description: '',
    images: [] as string[],
  });

  // Category form state
  const [categoryName, setCategoryName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      categoryId: categories[0]?.id || '',
      description: '',
      images: [],
    });
    setNewImageUrl('');
  };

  const handleAddProduct = () => {
    if (productForm.name && productForm.price && productForm.categoryId) {
      onAddProduct({
        name: productForm.name,
        price: parseFloat(productForm.price),
        categoryId: productForm.categoryId,
        description: productForm.description,
        images: productForm.images,
      });
      resetProductForm();
      setIsAddingProduct(false);
    }
  };

  const handleUpdateProduct = () => {
    if (editingProduct && productForm.name && productForm.price) {
      onUpdateProduct(editingProduct.id, {
        name: productForm.name,
        price: parseFloat(productForm.price),
        categoryId: productForm.categoryId,
        description: productForm.description,
        images: productForm.images,
      });
      setEditingProduct(null);
      resetProductForm();
    }
  };

  const handleAddCategory = () => {
    if (categoryName.trim()) {
      onAddCategory(categoryName.trim());
      setCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory && categoryName.trim()) {
      onUpdateCategory(editingCategory.id, categoryName.trim());
      setEditingCategory(null);
      setCategoryName('');
    }
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      categoryId: product.categoryId,
      description: product.description,
      images: product.images,
    });
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setProductForm({
        ...productForm,
        images: [...productForm.images, newImageUrl.trim()],
      });
      setNewImageUrl('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploads = Array.from(files).map(async (file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`L'image ${file.name} est trop volumineuse (max 5MB)`);
        return null;
      }

      // Basic mime check
      if (!file.type.startsWith('image/')) {
        toast.error(`Le fichier ${file.name} n'est pas une image valide`);
        return null;
      }

      try {
        const res = await uploadApi.uploadImage(file);
        return res.url;
      } catch (err: any) {
        console.error('Upload error', err);
        toast.error(`Erreur upload ${file.name}: ${err?.message || err}`);
        return null;
      }
    });

    const results = await Promise.all(uploads);
    const urls = results.filter((u): u is string => !!u);
    if (urls.length > 0) {
      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index),
    });
  };

  const handleShareProduct = (productId: string) => {
    const url = `${window.location.origin}?product=${productId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Lien du produit copié !');
    }).catch(() => {
      toast.error('Impossible de copier le lien');
    });
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Sans catégorie';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden p-0 bg-background">
        <DialogHeader className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-heading text-2xl">
              Panneau d'administration
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6 border-b border-border">
            <TabsList className="bg-transparent h-12 p-0 gap-6">
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0"
              >
                <Package className="w-4 h-4 mr-2" />
                Produits ({products.length})
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-0"
              >
                <Tag className="w-4 h-4 mr-2" />
                Catégories ({categories.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <TabsContent value="products" className="m-0">
              {(isAddingProduct || editingProduct) ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                        resetProductForm();
                      }}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h3 className="font-heading text-xl">
                      {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nom du produit *</label>
                      <Input
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Ex: Collier Élégance"
                        className="bg-cream"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Prix (F CFA) *</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          placeholder="0.00"
                          className="bg-cream"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Catégorie *</label>
                        <Select
                          value={productForm.categoryId}
                          onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })}
                        >
                          <SelectTrigger className="bg-cream">
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Décrivez votre produit..."
                        rows={4}
                        className="bg-cream resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Images</label>
                      
                      {/* Upload buttons */}
                      <div className="flex gap-2 mb-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="flex-1 gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Uploader une image
                        </Button>
                      </div>

                      {/* URL input */}
                      <div className="flex gap-2 mb-3">
                        <Input
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="Ou coller une URL d'image..."
                          className="bg-cream"
                        />
                        <Button type="button" onClick={addImageUrl} variant="outline">
                          <Link className="w-4 h-4" />
                        </Button>
                      </div>

                      {productForm.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-3">
                          {productForm.images.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-cream group">
                              <img src={url} alt="" className="w-full h-full object-cover" />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <XIcon className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                        resetProductForm();
                      }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                      className="flex-1 bg-primary hover:bg-gold-light text-primary-foreground"
                    >
                      {editingProduct ? 'Enregistrer' : 'Ajouter'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      resetProductForm();
                      setIsAddingProduct(true);
                    }}
                    className="w-full bg-primary hover:bg-gold-light text-primary-foreground gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un produit
                  </Button>

                  <div className="space-y-3">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-border"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {product.images.length > 0 ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{getCategoryName(product.categoryId)}</p>
                          <p className="text-primary font-semibold">{product.price.toLocaleString('fr-FR')}  F CFA</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleShareProduct(product.id)}
                            className="text-muted-foreground hover:text-primary"
                            title="Partager le produit"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditProduct(product)}
                            className="text-muted-foreground hover:text-primary"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteProduct(product.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="categories" className="m-0">
              {(isAddingCategory || editingCategory) ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setEditingCategory(null);
                        setCategoryName('');
                      }}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h3 className="font-heading text-xl">
                      {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
                    </h3>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Nom de la catégorie *</label>
                    <Input
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Ex: Bijoux"
                      className="bg-cream"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingCategory(false);
                        setEditingCategory(null);
                        setCategoryName('');
                      }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                      className="flex-1 bg-primary hover:bg-gold-light text-primary-foreground"
                    >
                      {editingCategory ? 'Enregistrer' : 'Ajouter'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={() => setIsAddingCategory(true)}
                    className="w-full bg-primary hover:bg-gold-light text-primary-foreground gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une catégorie
                  </Button>

                  <div className="space-y-3">
                    {categories.map((category) => {
                      const productCount = products.filter(p => p.categoryId === category.id).length;
                      return (
                        <div
                          key={category.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-border"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Tag className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{category.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {productCount} produit{productCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEditCategory(category)}
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteCategory(category.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
