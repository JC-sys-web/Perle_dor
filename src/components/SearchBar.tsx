import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Rechercher un produit..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 pr-4 py-3 h-12 bg-cream border-border rounded-full focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}
