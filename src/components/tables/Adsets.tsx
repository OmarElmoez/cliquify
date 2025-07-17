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

import { getPaginatedAdsets, paginatedAdsetsResponse } from "@/services/adsets";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import getPageNumbers from "@/utils/getPageNumbers";

type TAdsetTableProps = {
  id: string, 
  getFor: 'campaign' | 'account'
  setActiveTab: React.Dispatch<React.SetStateAction<string>>, 
  setSelectedAdset: React.Dispatch<React.SetStateAction<string>>
}

const AdsetsTable = ({id, getFor, setActiveTab, setSelectedAdset}: TAdsetTableProps) => {

  const [adsets, setAdsets] = useState<paginatedAdsetsResponse>();
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchAdsets = async () => {
      setIsLoading(true)
      try {
        const res = await getPaginatedAdsets({id, getFor, page: currentPage})
        setAdsets(res)
        setIsLoading(false)
      } catch (error) {
        console.error('failed to fetch adsets: ', error)
        setIsLoading(false)
      }
    }

    if (id) {
      fetchAdsets();
    }
  }, [id, currentPage])

  const paginationMeta = {
    page: currentPage,
    pages: Math.ceil((adsets?.count) / 20)
  }

  return (
    <>
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">NAME</TableHead>
            <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">STATUS</TableHead>
            <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">Bid strategy</TableHead>
            <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">BUDGET</TableHead>
            <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">START TIME</TableHead>
            <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">END TIME</TableHead>
            {/* <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">CAMPAIGN</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center">
                Loading ad sets...
              </TableCell>
            </TableRow>
          ) : (adsets?.results?.length === 0) ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center">
                {getFor === 'campaign' ? "No ad sets available for this campaign." : "No ad sets available for this account."}
              </TableCell>
            </TableRow>
          )
          : (
            adsets?.results?.map((adset) => (
              <TableRow key={adset.id}>
                <TableCell className="py-4 px-4 cursor-pointer hover:underline hover:text-[#1890ff] decoration-1 w-fit flex" onClick={() => {
                  setActiveTab('ads')
                  setSelectedAdset(adset.adset_id)
                }}>{adset.name}</TableCell>
                <TableCell className="py-4 px-4">
                  <Badge
                    variant={
                      adset.status === "ACTIVE"
                        ? "default"
                        : adset.status === "PAUSED"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      adset.status === "ACTIVE"
                        ? "text-green-700 border-green-200 bg-green-50"
                        : adset.status === "PAUSED"
                        ? "text-yellow-700 border-yellow-200 bg-yellow-50"
                        : "text-gray-700 border-gray-200 bg-gray-50"
                    }
                  >
                    {adset.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-4">{adset.bid_strategy}</TableCell>
                <TableCell className="py-4 px-4 flex items-center gap-2">
                  {Number(adset.lifetime_budget) > 0 ? (
                    <>
                      <span>{adset.lifetime_budget}</span>
                      <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">lifetime</Badge>
                    </>
                  ) : Number(adset.daily_budget) > 0 ? (
                    <>
                      <span>{adset.daily_budget}</span>
                      <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">daily</Badge>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="py-4 px-4">{adset.start_time || "-"}</TableCell>
                <TableCell className="py-4 px-4">{adset.end_time  || "-"}</TableCell>
                {/* <TableCell className="py-4 px-4">{adset.campaign_name || "-"}</TableCell> */}
              </TableRow>
            ))
          )
        }
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

export default AdsetsTable;