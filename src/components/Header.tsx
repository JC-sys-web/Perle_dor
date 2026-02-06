import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onAdminClick: () => void;
}

export function Header({ onAdminClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="Perle d'Or" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover shadow-md" />
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground tracking-wide">
              Perle d'Or
            </h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              Collection Premium
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onAdminClick}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
