import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  className?: string;
};

export const PaginationNav = ({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
}: Props) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Page size selector - ALWAYS show this */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Rows per page:</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder={`${pageSize}`} />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination controls - Only show when totalPages > 1 */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const current = i + 1;

              const shouldShow =
                current === 1 ||
                current === totalPages ||
                Math.abs(current - page) <= 2;

              const isEllipsisBefore = current === page - 3 && current > 2;
              const isEllipsisAfter =
                current === page + 3 && current < totalPages - 1;

              if (isEllipsisBefore || isEllipsisAfter) {
                return (
                  <PaginationItem key={`ellipsis-${current}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                shouldShow && (
                  <PaginationItem key={current}>
                    <PaginationLink
                      isActive={page === current}
                      onClick={() => onPageChange(current)}
                    >
                      {current}
                    </PaginationLink>
                  </PaginationItem>
                )
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
