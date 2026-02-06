import { MessageCircle, Package, Share2 } from 'lucide-react';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  category?: Category;
  onViewDetails: (product: Product) => void;
  whatsappNumber: string;
}

export function ProductCard({ product, category, onViewDetails, whatsappNumber }: ProductCardProps) {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
     const productUrl = `${window.location.origin}?product=${product.id}`;
    const message = encodeURIComponent(
       `Bonjour, je suis intéressé(e) par le produit "${product.name}" au prix de ${product.price.toLocaleString('fr-FR')} Fr.\n\nVoir le produit : ${productUrl}\n\nPouvez-vous me donner plus d'informations ?`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <article
      className="card-product group cursor-pointer animate-fade-in"
      onClick={() => onViewDetails(product)}
    >
      <div className="aspect-square bg-cream relative overflow-hidden">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 sm:w-16 sm:h-16 text-muted-foreground/30" />
          </div>
        )}
        {category && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-background/90 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium text-foreground">
            {category.name}
          </span>
        )}
        <button
          onClick={handleShareClick}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-background/90 backdrop-blur-sm text-muted-foreground hover:text-primary transition-colors"
          aria-label="Partager le produit"
        >
          <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
      
      <div className="p-2 sm:p-5">
        <h3 className="font-heading text-sm sm:text-xl font-semibold text-foreground mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-1 group-hover:text-primary transition-colors leading-tight">
          {product.name}
        </h3>
        
        <p className="text-primary font-semibold text-sm sm:text-lg mb-2 sm:mb-4">
          {formatPrice(product.price)}
        </p>
        
        <Button
          onClick={handleWhatsAppClick}
          className="w-full bg-[#25D366] hover:bg-[#20BA5C] text-white font-medium rounded-lg transition-all duration-300 gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5 h-auto"
          size="sm"
        >
          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Contacter via</span> WhatsApp
        </Button>
      </div>
    </article>
  );
}
