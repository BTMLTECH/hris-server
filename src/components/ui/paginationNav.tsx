import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  className?: string;
};

export const PaginationNav = ({ page, totalPages, onPageChange, className }: Props) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination className={className}>
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
            Math.abs(current - page) <= 1;

          const isEllipsisBefore = current === page - 2 && current !== 2;
          const isEllipsisAfter = current === page + 2 && current !== totalPages - 1;

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
            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
