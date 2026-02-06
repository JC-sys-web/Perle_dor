import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
          selectedCategory === null
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-cream text-foreground hover:bg-primary/10 border border-border"
        )}
      >
        Tous
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-cream text-foreground hover:bg-primary/10 border border-border"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
