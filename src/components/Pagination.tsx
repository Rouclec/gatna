import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-iconly";
import { gilroyBold } from "../pages";

interface PaginationProps {
  totalPages: number;
  initialPage?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  initialPage = 1,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pages, setPages] = useState([1, 2, 3]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  useEffect(() => {
    // Calculate the page numbers to display
    const startPage =
      currentPage === totalPages
        ? Math.max(1, currentPage - 2)
        : Math.max(1, currentPage - 1);
    const endPage =
      currentPage === 1
        ? Math.min(totalPages, currentPage + 2)
        : Math.min(totalPages, currentPage + 1);

    const tempPages = [];
    for (let i = startPage; i <= endPage; i++) {
      tempPages.push(i);
      setPages(tempPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-4 py-3 rounded-xl disabled:opacity-50 bg-dark-1A flex gap-1 items-center ${
          currentPage !== 1 && "border-[1px] border-blue"
        }`}
      >
        <ChevronLeft
          size={18}
          primaryColor="#fff"
          style={{
            opacity: currentPage === 1 ? 30 : 100,
          }}
        />
        <p
          className={`${gilroyBold.className} text-white ${
            currentPage === 1 ? "opacity-30" : "text-primary-400"
          }`}
        >
          Prev
        </p>
      </button>

      <div className="w-full items-center flex justify-evenly">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`w-[38px] h-[54px] flex items-center justify-center rounded-xl ${
              currentPage === page ? "bg-white bg-opacity-10 text-white" : "bg-transparent"
            } rounded bg-opacity-40`}
          >
            <p className={`${gilroyBold.className} text-2xl ${currentPage === page ? "text-white opacity-80" : "text-grey-text opacity-30"}`}>{page}</p>
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-3 rounded-xl disabled:opacity-50 bg-dark-1A flex gap-1 items-center ${
          currentPage !== totalPages && "border-[1px] border-blue"
        }`}
      >
        <p
          className={`${gilroyBold.className} text-white ${
            currentPage === totalPages ? "opacity-30" : "text-primary-400"
          }`}
        >
          Next
        </p>
        <ChevronRight
          size={18}
          primaryColor="#fff"
          style={{
            opacity: currentPage === totalPages ? 30 : 100,
          }}
        />
      </button>
    </div>
  );
};

export default Pagination;
