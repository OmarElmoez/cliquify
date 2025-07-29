import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import getAds, { TAd, TAdsResponse } from "@/services/ads";
import getPageNumbers from "@/utils/getPageNumbers";
import { STATUS_INFO } from "@/constants";
import { AdsImg } from "@/assets";
import { MdOutlineNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { IoIosSkipBackward, IoIosSkipForward } from "react-icons/io";
import { cn } from "@/lib/utils";

const AdsTable = ({
  id,
  getFor,
}: {
  id: string;
  getFor: "adset" | "account";
}) => {
  const [ads, setAds] = useState<TAdsResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAds = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const res = await getAds({ id, getFor, page });
      setAds(res);
    } catch (error) {
      console.error("failed to fetch ads: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [getFor, id]);

  useEffect(() => {
    if (id) {
      fetchAds(1);
    }
  }, [fetchAds, id]);

  const paginationMeta = {
    page: currentPage,
    pages: Math.ceil(ads?.count / 20),
  };

    const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAds(page);
  };

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F5F8FA]">
            <TableRow>
              <TableHead className="font-semibold text-sm text-blackColor">
                NAME
              </TableHead>
              <TableHead className="font-semibold text-sm text-blackColor">
                STATUS
              </TableHead>
              {/* <TableHead className="font-semibold text-sm text-blackColor">FORMAT</TableHead> */}
              <TableHead className="font-semibold text-sm text-blackColor">
                CREATIVE
              </TableHead>
              <TableHead className="font-semibold text-sm text-blackColor">
                IMPRESSIONS
              </TableHead>
              <TableHead className="font-semibold text-sm text-blackColor">
                CLICKS
              </TableHead>
              <TableHead className="font-semibold text-sm text-blackColor">
                SPEND
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-center text-sm text-blackColor">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
                  Loading ads...
                </TableCell>
              </TableRow>
            ) : ads?.results?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
                  {getFor === "adset"
                    ? "No ads available for this ad set."
                    : "No ads available for this account."}
                </TableCell>
              </TableRow>
            ) : (
              ads?.results.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex shrink-0">
                        <img src={AdsImg} alt="ad image" />
                      </div>
                      <span className="w-10">{ad.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-4">
                    <div
                      className="w-[14px] h-[14px] rounded-full"
                      style={{
                        backgroundColor: STATUS_INFO[ad.status].color,
                      }}
                    ></div>
                    <span className="w-10">{STATUS_INFO[ad.status].label}</span>
                  </TableCell>
                  {/* <TableCell>{ad.ad_format || "-"}</TableCell> */}
                  <TableCell>{ad.creative || "-"}</TableCell>
                  <TableCell>{ad.impressions ?? "-"}</TableCell>
                  <TableCell>{ad.clicks ?? "-"}</TableCell>
                  <TableCell>
                    {ad.spend !== undefined ? `$${ad.spend}` : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
            <TableRow className="text-center font-semibold">
              <TableCell>
                <div className="flex">
                  <div className="flex-1 text-left">Total:</div>
                  <div className="flex-1 text-left">{ads?.count}</div>
                </div>
              </TableCell>
              <TableCell></TableCell>
              <TableCell>87766</TableCell>
              <TableCell>87766</TableCell>
              <TableCell>87766</TableCell>
              <TableCell>87766</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={9}>
                <section className="flex items-center justify-end gap-8">
                  <div className="text-sm font-medium">
                    Page {paginationMeta.page} of {paginationMeta.pages}
                  </div>
                  <Pagination className="w-fit mx-0">
                    <PaginationContent className="gap-4">
                      <PaginationItem className="flex">
                        <button
                          className={cn(
                            currentPage === 1
                              ? "cursor-not-allowed text-[#77A0BB]"
                              : "cursor-pointer text-[#446D88]"
                          )}
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(1)}
                        >
                          <IoIosSkipBackward size={20} />
                        </button>
                      </PaginationItem>
                      <PaginationItem className="flex">
                        <button
                          className={cn(
                            currentPage === 1
                              ? "cursor-not-allowed text-[#77A0BB]"
                              : "cursor-pointer text-[#446D88]"
                          )}
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <GrFormPrevious size={20} />
                        </button>
                      </PaginationItem>
                      <PaginationItem className="flex">
                        <button
                          className={cn(
                            currentPage === paginationMeta.pages
                              ? "cursor-not-allowed text-[#77A0BB]"
                              : "cursor-pointer text-[#446D88]"
                          )}
                          disabled={currentPage === paginationMeta.pages}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <MdOutlineNavigateNext size={20} />
                        </button>
                      </PaginationItem>
                      <PaginationItem className="flex">
                        <button
                          className={cn(
                            currentPage === paginationMeta.pages
                              ? "cursor-not-allowed text-[#77A0BB]"
                              : "cursor-pointer text-[#446D88]"
                          )}
                          disabled={currentPage === paginationMeta.pages}
                          onClick={() => handlePageChange(paginationMeta.pages)}
                        >
                          <IoIosSkipForward size={20} />
                        </button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </section>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      {/* {paginationMeta && paginationMeta.pages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>

              {getPageNumbers({ paginationMeta }).map((pageNum) => (
                <PaginationItem key={pageNum} className="cursor-pointer">
                  {pageNum === "ellipsis" ? (
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

              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentPage === paginationMeta.pages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="flex items-center gap-1"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )} */}
    </>
  );
};

export default AdsTable;
