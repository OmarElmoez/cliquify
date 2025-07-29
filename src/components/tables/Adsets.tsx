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
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getPaginatedAdsets, paginatedAdsetsResponse } from "@/services/adsets";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import getPageNumbers from "@/utils/getPageNumbers";
import { TSelectedRows } from "@/pages/Campaigns";
import { STATUS_INFO } from "@/constants";
import { GrFormPrevious } from "react-icons/gr";
import { IoIosSkipBackward, IoIosSkipForward } from "react-icons/io";
import { cn } from "@/lib/utils";
import { MdOutlineNavigateNext } from "react-icons/md";

type TAdsetTableProps = {
  id: string;
  getFor: "campaign" | "account";
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setSelectedAdset: React.Dispatch<React.SetStateAction<string>>;
  selectedRows: TSelectedRows;
  setSelectedRows: React.Dispatch<React.SetStateAction<TSelectedRows>>;
};

const AdsetsTable = ({
  id,
  getFor,
  setActiveTab,
  setSelectedAdset,
  selectedRows,
  setSelectedRows,
}: TAdsetTableProps) => {
  const [adsets, setAdsets] = useState<paginatedAdsetsResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAdsets = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const res = await getPaginatedAdsets({ id, getFor, page });
        setAdsets(res);
        setIsLoading(false);
      } catch (error) {
        console.error("failed to fetch adsets: ", error);
        setIsLoading(false);
      }
    },
    [getFor, id]
  );

  useEffect(() => {
    if (id) {
      fetchAdsets(1);
    }
  }, [id, fetchAdsets]);

  const paginationMeta = {
    page: currentPage,
    pages: Math.ceil(adsets?.count / 20),
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAdsets(page);
  };

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F5F8FA]">
            <TableRow>
              <TableHead className="font-semibold text-sm text-blackColor flex items-center justify-center"></TableHead>
              <TableHead className="font-semibold text-sm text-blackColor">
                NAME
              </TableHead>
              <TableHead className="font-semibold text-sm text-blackColor">
                STATUS
              </TableHead>
              <TableHead className="font-semibold text-sm text-blackColor">
                Bid strategy
              </TableHead>
              <TableHead className="font-semibold text-sm text-blackColor">
                BUDGET
              </TableHead>
              <TableHead className="font-semibold text-sm text-blackColor">
                START TIME
              </TableHead>
              <TableHead className="font-semibold text-sm text-blackColor">
                END TIME
              </TableHead>
              {/* <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">CAMPAIGN</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white text-center text-sm text-blackColor">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  Loading ad sets...
                </TableCell>
              </TableRow>
            ) : adsets?.results?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center">
                  {getFor === "campaign"
                    ? "No ad sets available for this campaign."
                    : "No ad sets available for this account."}
                </TableCell>
              </TableRow>
            ) : (
              adsets?.results?.map((adset) => (
                <TableRow key={adset.id}>
                  <TableCell className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedRows.adsets.ids.includes(adset.adset_id)}
                      onCheckedChange={() =>
                        setSelectedRows((prev) => ({
                          ...prev,
                          adsets: {
                            ...prev.adsets,
                            ids: prev.adsets.ids.includes(adset.adset_id)
                              ? prev.adsets.ids.filter(
                                  (id) => id !== adset.adset_id
                                )
                              : [...prev.adsets.ids, adset.adset_id],
                            count: prev.adsets.ids.includes(adset.adset_id)
                              ? prev.adsets.count - 1
                              : prev.adsets.count + 1,
                          },
                        }))
                      }
                      className="border-iconColor border-2 data-[state=checked]:bg-[#2FDD60] data-[state=checked]:border-[#2FDD60] w-[18px] h-[18px]"
                    />
                  </TableCell>
                  <TableCell
                    className="cursor-pointer hover:underline hover:text-[#1890ff] decoration-1"
                    onClick={() => {
                      setActiveTab("ads");
                      setSelectedRows((prev) => ({
                        ...prev,
                        adsets: {
                          ...prev.adsets,
                          ids: [...prev.adsets.ids, adset.adset_id],
                          count: prev.adsets.count + 1,
                        },
                      }));
                      setSelectedAdset(adset.adset_id);
                    }}
                  >
                    {adset.name}
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-4">
                    <div
                      className="w-[14px] h-[14px] rounded-full"
                      style={{
                        backgroundColor: STATUS_INFO[adset.status].color,
                      }}
                    ></div>
                    <span className="w-10">
                      {STATUS_INFO[adset.status].label}
                    </span>
                  </TableCell>
                  <TableCell>{adset.bid_strategy}</TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    {Number(adset.lifetime_budget) > 0 ? (
                      <>
                        <span>{adset.lifetime_budget}</span>
                        <Badge
                          variant="outline"
                          className="text-blue-700 border-blue-200 bg-blue-50"
                        >
                          lifetime
                        </Badge>
                      </>
                    ) : Number(adset.daily_budget) > 0 ? (
                      <>
                        <span>{adset.daily_budget}</span>
                        <Badge
                          variant="outline"
                          className="text-green-700 border-green-200 bg-green-50"
                        >
                          daily
                        </Badge>
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{adset.start_time || "-"}</TableCell>
                  <TableCell>{adset.end_time || "-"}</TableCell>
                  {/* <TableCell className="py-4 px-4">{adset.campaign_name || "-"}</TableCell> */}
                </TableRow>
              ))
            )}
            <TableRow className="text-center font-semibold">
              <TableCell>Total:</TableCell>
              <TableCell>{adsets?.count}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
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

export default AdsetsTable;
