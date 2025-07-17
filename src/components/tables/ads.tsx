import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import getAds, { TAd, TAdsResponse } from "@/services/ads";
import getPageNumbers from "@/utils/getPageNumbers";

const AdsTable = ({
  id,
  getFor
}: {
  id: string;
  getFor: 'adset' | 'account';
}) => {
  const [ads, setAds] = useState<TAdsResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        const res = await getAds({ id, getFor, page: currentPage });
        setAds(res);
      } catch (error) {
        console.error("failed to fetch ads: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAds();
    }
  }, [id, currentPage]);

  const paginationMeta = {
    page: currentPage,
    pages: Math.ceil((ads?.count) / 20)
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">NAME</TableHead>
              <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">STATUS</TableHead>
              {/* <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">FORMAT</TableHead> */}
              <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">CREATIVE</TableHead>
              <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">IMPRESSIONS</TableHead>
              <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">CLICKS</TableHead>
              <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">SPEND</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
                  Loading ads...
                </TableCell>
              </TableRow>
              ) : ads?.results?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    {getFor === 'adset'
                      ? "No ads available for this ad set."
                      : "No ads available for this account."}
                  </TableCell>
                </TableRow>
            ) : (
              ads?.results.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="py-4 px-4">{ad.name}</TableCell>
                  <TableCell className="py-4 px-4">
                    <Badge
                      variant={
                        ad.status === "ACTIVE"
                          ? "default"
                          : ad.status === "PAUSED"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        ad.status === "ACTIVE"
                          ? "text-green-700 border-green-200 bg-green-50"
                          : ad.status === "PAUSED"
                            ? "text-yellow-700 border-yellow-200 bg-yellow-50"
                            : "text-gray-700 border-gray-200 bg-gray-50"
                      }
                    >
                      {ad.status}
                    </Badge>
                  </TableCell>
                  {/* <TableCell className="py-4 px-4">{ad.ad_format || "-"}</TableCell> */}
                  <TableCell className="py-4 px-4">{ad.creative || "-"}</TableCell>
                  <TableCell className="py-4 px-4">{ad.impressions ?? "-"}</TableCell>
                  <TableCell className="py-4 px-4">{ad.clicks ?? "-"}</TableCell>
                  <TableCell className="py-4 px-4">{ad.spend !== undefined ? `$${ad.spend}` : "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {paginationMeta && paginationMeta.pages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              {/* Previous Page Button */}
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {/* <span>Previous</span> */}
                </Button>
              </PaginationItem>

              {/* Page Numbers */}
              {getPageNumbers({ paginationMeta }).map((pageNum) => (
                <PaginationItem key={pageNum} className='cursor-pointer'>
                  {pageNum === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={currentPage === pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next Page Button */}
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === paginationMeta.pages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="flex items-center gap-1"
                >
                  {/* <span>Next</span> */}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default AdsTable;
