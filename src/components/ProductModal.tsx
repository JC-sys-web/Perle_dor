import { X, MessageCircle, Package, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product | null;
  category?: Category;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export function ProductModal({ product, category, isOpen, onClose, whatsappNumber }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const handleWhatsAppClick = () => {
     const productUrl = `${window.location.origin}?product=${product.id}`;
    const message = encodeURIComponent(
       `Bonjour, je suis intéressé(e) par le produit "${product.name}" au prix de ${product.price.toLocaleString('fr-FR')} Fr.\n\nVoir le produit : ${productUrl}\n\nPouvez-vous me donner plus d'informations ?`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleShareClick = () => {
    const url = `${window.location.origin}?product=${product.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Découvrez ${product.name} - ${formatPrice(product.price)}`,
        url: url,
      }).catch(() => {
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Lien copié !');
    }).catch(() => {
      toast.error('Impossible de copier le lien');
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(price);
  };

  const nextImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0 gap-0 bg-background">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <button
            onClick={handleShareClick}
            className="p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-muted transition-colors"
            aria-label="Partager le produit"
          >
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square bg-cream">
            {product.images.length > 0 ? (
              <>
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-muted transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-muted transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-primary w-6'
                              : 'bg-foreground/30 hover:bg-foreground/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 flex flex-col">
            {category && (
              <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2">
                {category.name}
              </span>
            )}
            
            <h2 className="font-heading text-3xl font-semibold text-foreground mb-4">
              {product.name}
            </h2>
            
            <p className="text-primary font-bold text-2xl mb-6">
              {formatPrice(product.price)}
            </p>
            
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-3">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || 'Aucune description disponible.'}
              </p>
            </div>
            
            <Button
              onClick={handleWhatsAppClick}
              size="lg"
              className="w-full mt-8 bg-[#25D366] hover:bg-[#20BA5C] text-white font-medium rounded-lg transition-all duration-300 gap-2 py-6"
            >
              <MessageCircle className="w-5 h-5" />
              Commander via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
