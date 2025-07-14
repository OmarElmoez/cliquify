type TProps = {
  paginationMeta: {
    page: number;
    pages: number;
  }
}

const getPageNumbers = ({paginationMeta}: TProps) => {
  if (!paginationMeta) return [];

  const { page, pages } = paginationMeta;

  // Handle edge cases
  if (pages <= 1) return [1];
  if (pages <= 3) {
    return Array.from({ length: pages }, (_, i) => i + 1);
  }

  const pageNumbers: (number | 'ellipsis')[] = [1]; // Always include first page

  // Calculate the range around current page
  const startPage = Math.max(2, page - 1);
  const endPage = Math.min(pages - 1, page + 1);

  // Add ellipsis after page 1 if there's a gap
  if (startPage > 2) {
    pageNumbers.push('ellipsis');
  }

  // Add pages around current page (avoiding duplicates)
  for (let i = startPage; i <= endPage; i++) {
    if (!pageNumbers.includes(i)) {
      pageNumbers.push(i);
    }
  }

  // Add ellipsis before last page if there's a gap
  if (endPage < pages - 1) {
    pageNumbers.push('ellipsis');
  }

  // Add last page (avoiding duplicate)
  if (!pageNumbers.includes(pages)) {
    pageNumbers.push(pages);
  }

  return pageNumbers;
};

export default getPageNumbers