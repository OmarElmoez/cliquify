import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import getAdsets from "@/services/adsets";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

const AdsetsTable = ({campaign_id}: {campaign_id: string}) => {

  const [adsets, setAdsets] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAdsets = async () => {
      setIsLoading(true)
      try {
        const res = await getAdsets({campaign_id})
        setAdsets(res.response)
        setIsLoading(false)
      } catch (error) {
        console.error('failed to fetch adsets: ', error)
        setIsLoading(false)
      }
    }

    if (campaign_id) {
      fetchAdsets();
    }
  }, [])

  return (
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
          ) : (adsets?.length === 0) ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center">
                {!campaign_id ? "Please select a campaign to view ad sets." : "No ad sets available."}
              </TableCell>
            </TableRow>
          )
          : (
            adsets.map((adset) => (
              <TableRow key={adset.id}>
                <TableCell className="py-4 px-4">{adset.name}</TableCell>
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
  );
};

export default AdsetsTable;