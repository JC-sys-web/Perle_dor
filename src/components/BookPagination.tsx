import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BookPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isAnimating: boolean;
}

export function BookPagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isAnimating 
}: BookPaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1 && !isAnimating) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isAnimating) {
      onPageChange(currentPage + 1);
    }
  };

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 mb-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1 || isAnimating}
        className="h-8 w-8 sm:h-10 sm:w-10 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-2 text-muted-foreground">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => !isAnimating && onPageChange(page as number)}
                disabled={isAnimating}
                className={cn(
                  "h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm font-medium transition-all duration-300",
                  currentPage === page 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "border-primary/30 hover:bg-primary/10"
                )}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages || isAnimating}
        className="h-8 w-8 sm:h-10 sm:w-10 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
