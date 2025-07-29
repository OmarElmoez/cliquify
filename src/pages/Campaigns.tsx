import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BiSolidInfoCircle } from "react-icons/bi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusDialog from "@/components/shared/StatusDialog";
import { getAdAccounts, AdAccount } from "@/services/adAccountService";
import {
  getCampaigns,
  updateCampaignStatus,
  CampaignsResponse,
  CampaignStatus,
} from "@/services/campaignService";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoIosSkipBackward, IoIosSkipForward } from "react-icons/io";
import { FaFolder } from "react-icons/fa";
import {
  MdAddBox,
  MdOutlineRefresh,
  MdOutlineNavigateNext,
  MdEqualizer,
} from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { BsGraphUpArrow } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { Loader } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useDialog } from "@/hooks/useDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdsetsTable from "@/components/tables/Adsets";
import AdsTable from "@/components/tables/ads";
import refreshCampaigns from "@/services/refreshCampaigns";
import { Checkbox } from "@/components/ui/checkbox";
import { FacebookIcon } from "@/assets";
import { cn } from "@/lib/utils";
import { STATUS_INFO } from "@/constants";



export type TSelectedRows = {
  campaigns: {
    ids: string[],
    count: number,
  },
  adsets: {
    ids: string[],
    count: number
  }
}

const Campaigns = () => {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null); // Store the campaign ID that's being updated
  const [isError, setIsError] = useState(false);
  const { isDialogOpen, dialogState, showDialog, handleDialogClose } =
    useDialog();
  const [campaignsData, setCampaignsData] = useState<CampaignsResponse>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [selectedAdset, setSelectedAdset] = useState("");
  const [activeTab, setActiveTab] = useState("campaigns");
  // const [pagination, setPagination] = useState<{
  //   next: string | null;
  //   previous: string | null;
  //   count: number;
  // }>({ next: null, previous: null, count: 0 });
  const [showRetryAction, setShowRetryAction] = useState<{
    visible: boolean;
    type: "accounts" | "campaigns";
  }>({ visible: false, type: "accounts" });
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<TSelectedRows>({
    campaigns: {
      ids: [],
      count: 0,
    },
    adsets: {
      ids: [],
      count: 0,
    },
  });

  console.log('selected Rows: ', selectedRows);
  // const [isAllChecked, setIsAllChecked] = useState(false);
  // const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  // const isAllChecked = Object.values(checkedItems).every(Boolean);

  // const toggleItem = (id: string) => {
  //   setCheckedItems((prev) => ({
  //     ...prev,
  //     [id]: !prev[id],
  //   }));
  // };

  // const toggleAll = (checked: boolean) => {
  //   const newChecked = Object.keys(checkedItems).reduce((acc, id) => {
  //     acc[id] = checked;
  //     return acc;
  //   }, {} as Record<string, boolean>);
  //   setCheckedItems(newChecked);
  // };

  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('access_token');
  //   if(token)
  // }, [])

  useEffect(() => {
    loadAdAccounts();
  }, []);

  useEffect(() => {
    // Fetch campaigns when account is selected
    if (selectedAccount) {
      loadCampaigns(1);
    }
  }, [selectedAccount]);

  const loadAdAccounts = async () => {
    try {
      setLoading(true);
      setIsError(false);
      setShowRetryAction({ visible: false, type: "accounts" });
      const res = await getAdAccounts();
      if (typeof res === "string") {
        showDialog("error", "An Error Occurred", res, true);
      }
      setAdAccounts(res.data);
      if (res.data.length > 0) {
        setSelectedAccount(res.data[0].id);
      }
    } catch (error) {
      setIsError(true);
      // Show retry action after 1 second
      setTimeout(() => {
        setShowRetryAction({ visible: true, type: "accounts" });
      }, 1000);

      console.error("Error fetching ad accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async (page: number) => {
    try {
      setLoading(true);
      setIsError(false);
      setShowRetryAction({ visible: false, type: "campaigns" });

      const response = await getCampaigns({
        account_id: selectedAccount,
        page,
      });
      setCampaignsData(response);
    } catch (error) {
      setIsError(true);

      // Show retry action after 1 second
      setTimeout(() => {
        setShowRetryAction({ visible: true, type: "campaigns" });
      }, 1000);

      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCampaigns = async () => {
    // try {
    //   const response = await getCampaigns({ account_id: selectedAccount });
    //   setCampaignsData(response);
    //   toast.success("Campaigns refreshed successfully");
    // } catch (error) {
    //   console.error('Error refreshing campaigns:', error);
    //   toast.error("Failed to refresh campaigns");
    // }
    setRefreshing(true);
    try {
      const res = await refreshCampaigns();
      if (typeof res === "string") {
        showDialog("error", "An Error Occurred", res, true);
        setRefreshing(false);
        return;
      }
      toast.success("Campaigns synced successfully");
      setRefreshing(false);
      window.location.reload();
    } catch (error) {
      setRefreshing(false);
      console.error("Error syncing campaigns:", error);
      showDialog(
        "error",
        "Failed to sync Campaigns",
        "An error occurred while syncing",
        true
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadCampaigns(page);
  };

  // const handleNextPage = () => {
  //   if (pagination.next) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePreviousPage = () => {
  //   if (pagination.previous && currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
    setCurrentPage(1); // Reset to first page when account changes
  };

  const handleStatusToggle = async (
    campaignId: string,
    currentStatus: CampaignStatus
  ) => {
    try {
      setStatusLoading(campaignId);
      const response = await updateCampaignStatus(campaignId, currentStatus);

      if (response.new_status.success) {
        // Refetch campaigns to get the latest data
        loadCampaigns(currentPage);

        showDialog("success", "Status Updated", response.message, true);
      }
    } catch (error) {
      console.error("Error updating campaign status:", error);
      showDialog(
        "error",
        "Status Update Failed",
        "Failed to update campaign status. Please try again later.",
        true
      );
    } finally {
      setStatusLoading(null);
    }
  };

  // const handleStatusToggle = (campaignId: string, currentStatus: string) => {
  //   setCampaignsData(campaignsData.results.map(campaign =>
  //     campaign.id === campaignId ? { ...campaign, status: currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE" } : campaign
  //   ));
  // };

  const paginationMeta = {
    page: currentPage,
    pages: Math.ceil(campaignsData?.count / 20),
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        {/* <h1 className="text-2xl font-bold text-gray-800">Ads</h1> */}
        {/* <Button 
            variant="outline" 
            className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"
            onClick={() => setIsCreateAudienceOpen(true)}
          >
            Create audience
          </Button> */}
        <Select value={selectedAccount} onValueChange={handleAccountChange}>
          <SelectTrigger className="bg-white w-64 h-12 text-grayColor text-sm font-semibold border-none">
            <SelectValue
              placeholder={loading ? "Loading accounts..." : "Select account"}
            />
          </SelectTrigger>
          <SelectContent>
            {adAccounts?.length > 0 ? (
              adAccounts?.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-accounts" disabled>
                {isError ? "Failed to load accounts" : "No accounts available"}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <div className="space-x-5">
          <Button
            variant="main"
            size="big"
            className="min-w-[180px] bg-transparent border border-mainColor text-mainColor text-sm font-semibold"
            onClick={handleRefreshCampaigns}
          >
            <MdOutlineRefresh />
            Sync Compaigns
          </Button>
          <Button
            variant="main"
            size="big"
            onClick={() => navigate("/campaigns/create")}
          >
            <MdAddBox />
            Create ad campaign
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* <div className="bg-brand-lighterBlue py-4 rounded-md">
          <div className="flex items-center justify-between">
            {selectedAccount && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshCampaigns}
                disabled={refreshing}
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                {refreshing ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                {refreshing ? "Syncing..." : "Sync campaigns"}
              </Button>
            )}
          </div>
        </div> */}

        {/* {showRetryAction.visible && (
          <div className="flex items-center justify-center p-4 bg-amber-50 border border-amber-100 rounded-md">
            <div className="text-amber-800 mr-2">
              {showRetryAction.type === 'accounts' 
                ? 'Unable to load accounts. Please try again.' 
                : 'Unable to load campaigns. Please try again.'}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetryAction}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        )} */}

        {/* =============== Cards =============== */}
        <section className="flex gap-6 mt-10">
          <Card className="flex-1 p-4">
            <CardHeader className="flex flex-row p-0 items-center justify-between">
              <CardTitle className="font-medium text-base text-grayColor">
                Total Spend
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="!mt-0">
                    <BiSolidInfoCircle className="w-5 h-5 flex items-center justify-center text-iconColor" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px]">
                      The total amount of money spent on your ad campaigns
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent className="p-0 font-medium font-rubik text-[32px] text-[#33334F] mt-4">
              $4.5M
            </CardContent>
          </Card>

          <Card className="flex-1 p-4">
            <CardHeader className="flex flex-row p-0 items-center justify-between">
              <CardTitle className="font-medium text-base text-grayColor">
                Impressions
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="!mt-0">
                    <BiSolidInfoCircle className="w-5 h-5 flex items-center justify-center text-iconColor" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px]">
                      The number of times your ad was displayed to users
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent className="p-0 font-medium font-rubik text-[32px] text-[#33334F] mt-4">
              8474K
            </CardContent>
          </Card>

          <Card className="flex-1 p-4">
            <CardHeader className="flex flex-row p-0 items-center justify-between">
              <CardTitle className="font-medium text-base text-grayColor">
                Clicks
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="!mt-0">
                    <BiSolidInfoCircle className="w-5 h-5 flex items-center justify-center text-iconColor" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px]">
                      The number of times users clicked on your ad.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent className="p-0 font-medium font-rubik text-[32px] text-[#33334F] mt-4">
              8474K
            </CardContent>
          </Card>

          <Card className="flex-1 p-4">
            <CardHeader className="flex flex-row p-0 items-center justify-between">
              <CardTitle className="font-medium text-base text-grayColor">
                ROI
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="!mt-0">
                    <BiSolidInfoCircle className="w-5 h-5 flex items-center justify-center text-iconColor" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px]">
                      Measures how much profit your campaign made compared to
                      its cost
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent className="p-0 font-medium font-rubik text-[32px] text-[#33334F] mt-4">
              4.2%
            </CardContent>
          </Card>
        </section>

        <section className="bg-white border rounded-xl overflow-hidden pt-7">
          <Tabs value={activeTab}>
            <TabsList className="justify-start gap-16 bg-transparent px-3 pb-4 rounded-sm">
              <TabsTrigger
                value="campaigns"
                onClick={() => setActiveTab("campaigns")}
                className={cn(
                  "text-sm font-semibold flex items-center gap-2 min-w-[180px] h-11 rounded-tl-sm rounded-tr-sm",
                  activeTab === "campaigns" &&
                    "border-b-2 border-secondaryColor"
                )}
              >
                <FaFolder
                  size={20}
                  className={cn(
                    activeTab === "campaigns"
                      ? "text-secondaryColor"
                      : "text-iconColor"
                  )}
                />
                Campaigns
                {selectedRows.campaigns.count ? <div className="flex items-center justify-between gap-[6px] bg-lightGrayColor rounded-full px-2 py-[6px] text-secondaryColor text-xs font-medium">
                  {selectedRows.campaigns.count} selected
                  <div
                    onClick={() => setSelectedRows(prev => ({
                      ...prev,
                      campaigns: {
                        ids: [],
                        count: 0
                      }
                    }))}
                  >
                    <IoMdClose size={16} />
                  </div>
                </div>: ""}
              </TabsTrigger>
              <TabsTrigger
                value="adsets"
                onClick={() => {
                  setActiveTab("adsets");
                  setSelectedCampaignId("");
                }}
                className={cn(
                  "text-sm font-semibold flex items-center gap-2 h-11 rounded-tl-sm rounded-tr-sm",
                  activeTab === "adsets" &&
                    "border-b-2 border-secondaryColor text-secondaryColor"
                )}
              >
                <MdEqualizer
                  size={20}
                  className={cn(
                    activeTab === "adsets"
                      ? "text-secondaryColor"
                      : "text-iconColor"
                  )}
                />
                Ad sets
                {selectedRows.adsets.count ? <div className="flex items-center justify-between gap-[6px] bg-lightGrayColor rounded-full px-2 py-[6px] text-secondaryColor text-xs font-medium">
                  {selectedRows.adsets.count} selected
                  <div
                    onClick={() => setSelectedRows(prev => ({
                      ...prev,
                      adsets: {
                        ids: [],
                        count: 0
                      }
                    }))}
                  >
                    <IoMdClose size={16} />
                  </div>
                </div>: ""}
              </TabsTrigger>
              <TabsTrigger
                value="ads"
                onClick={() => {
                  setActiveTab("ads");
                  setSelectedAdset("");
                }}
                className={cn(
                  "text-sm font-semibold bg-[#F5F8FA] flex items-center gap-2 min-w-[180px] h-11 rounded-tl-sm rounded-tr-sm",
                  activeTab === "ads" && "border-b-2 border-secondaryColor"
                )}
              >
                <BsGraphUpArrow
                  size={20}
                  className={cn(
                    activeTab === "ads"
                      ? "text-secondaryColor"
                      : "text-iconColor"
                  )}
                />
                Ads
              </TabsTrigger>
            </TabsList>
            <TabsContent value="campaigns">
              <div>
                {loading ? (
                  <div className="py-8 text-center">Loading campaigns...</div>
                ) : campaignsData?.results.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-[#F5F8FA]">
                      <TableRow>
                        <TableHead className="font-semibold text-sm text-blackColor flex items-center justify-center">
                          {/* <Checkbox
                          checked={isAllChecked}
                          onCheckedChange={(checked) => toggleAll(!!checked)}
                          className="border-iconColor border-2 data-[state=checked]:bg-[#2FDD60] data-[state=checked]:border-[#2FDD60] w-[18px] h-[18px]"
                        /> */}
                        </TableHead>
                        <TableHead className="text-left font-semibold text-sm text-blackColor">
                          NAME
                        </TableHead>
                        <TableHead className="font-semibold text-sm text-blackColor">
                          On\off
                        </TableHead>
                        <TableHead className="font-semibold text-sm text-blackColor">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-sm text-blackColor">
                          Spending
                        </TableHead>
                        <TableHead className="font-semibold text-sm text-blackColor">
                          Clicks
                        </TableHead>
                        <TableHead className="font-semibold text-sm text-blackColor">
                          Conversions
                        </TableHead>
                        <TableHead className="font-semibold text-sm text-blackColor">
                          CPC
                        </TableHead>
                        <TableHead className="font-semibold text-sm text-blackColor">
                          CTR
                        </TableHead>
                        {/* <TableHead className="font-semibold text-sm text-blackColor">
                        BUYING TYPE
                      </TableHead>
                      <TableHead className="font-semibold text-sm text-blackColor">
                        CREATED TIME
                      </TableHead>
                      <TableHead className="font-semibold text-sm text-blackColor">
                        OBJECTIVE
                      </TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white text-sm text-blackColor">
                      {campaignsData?.results.map((campaign) => (
                        <TableRow key={campaign.campaign_id}>
                          <TableCell className="flex items-center justify-center">
                            <Checkbox
                              checked={selectedRows.campaigns.ids.includes(campaign.campaign_id)}
                              onCheckedChange={() =>
                                setSelectedRows((prev) => ({
                                  ...prev,
                                  campaigns: {
                                    ...prev.campaigns,
                                    ids: prev.campaigns.ids.includes(
                                      campaign.campaign_id
                                    )
                                      ? prev.campaigns.ids.filter(
                                          (id) => id !== campaign.campaign_id
                                        )
                                      : [
                                          ...prev.campaigns.ids,
                                          campaign.campaign_id,
                                        ],
                                    count: prev.campaigns.ids.includes(
                                      campaign.campaign_id
                                    ) ? prev.campaigns.count - 1 : prev.campaigns.count + 1
                                  },
                                }))
                              }
                              className="border-iconColor border-2 data-[state=checked]:bg-[#2FDD60] data-[state=checked]:border-[#2FDD60] w-[18px] h-[18px]"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex shrink-0">
                                <img src={FacebookIcon} alt="facebook logo" />
                              </div>
                              <div
                                className="cursor-pointer hover:underline hover:text-[#1890ff] decoration-1"
                                onClick={() => {
                                  setSelectedCampaignId(campaign.campaign_id);
                                  setActiveTab("adsets");
                                }}
                              >
                                {campaign.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              {statusLoading === campaign.campaign_id ? (
                                <div className="w-10 h-5 flex items-center justify-center">
                                  <Loader className="h-4 w-4 animate-spin" />
                                </div>
                              ) : (
                                <Switch
                                  checked={campaign.status === "ACTIVE"}
                                  onCheckedChange={(checked) =>
                                    handleStatusToggle(
                                      campaign.campaign_id,
                                      checked ? "ACTIVE" : "PAUSED"
                                    )
                                  }
                                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-400"
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="flex items-center justify-center gap-4">
                            <div
                              className="w-[14px] h-[14px] rounded-full"
                              style={{
                                backgroundColor:
                                  STATUS_INFO[campaign.status].color,
                              }}
                            ></div>
                            <span className="w-10">{STATUS_INFO[campaign.status].label}</span>
                          </TableCell>
                          <TableCell>242.112K</TableCell>
                          <TableCell>87766</TableCell>
                          <TableCell>3423</TableCell>
                          <TableCell>4</TableCell>
                          <TableCell>5</TableCell>
                          {/* <TableCell>{campaign.buying_type}</TableCell>
                        <TableCell>
                          {formatCampaignDate(campaign.created_time)}
                        </TableCell>
                        <TableCell>{campaign.objective}</TableCell> */}
                        </TableRow>
                      ))}
                      <TableRow className="text-center font-semibold">
                        <TableCell>Total:</TableCell>
                        <TableCell className="text-left">{campaignsData.count}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>87766</TableCell>
                        <TableCell>3423</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>6</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={9}>
                          <section className="flex items-center justify-end gap-8">
                            <div className="text-sm font-medium">
                              Page {paginationMeta.page} of{" "}
                              {paginationMeta.pages}
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
                                    onClick={() =>
                                      handlePageChange(currentPage - 1)
                                    }
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
                                    disabled={
                                      currentPage === paginationMeta.pages
                                    }
                                    onClick={() =>
                                      handlePageChange(currentPage + 1)
                                    }
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
                                    disabled={
                                      currentPage === paginationMeta.pages
                                    }
                                    onClick={() =>
                                      handlePageChange(paginationMeta.pages)
                                    }
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
                ) : (
                  <div className="py-8 text-center">
                    {selectedAccount
                      ? "No campaigns available for this account."
                      : "Please select an account to view campaigns."}
                  </div>
                )}
              </div>

              {/* {campaignsData?.results.length > 0 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={!campaignsData.previous ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    >
                      <span className="sr-only">Previous</span>
                    </PaginationPrevious>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>{currentPage}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={!campaignsData.next ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    >
                      <span className="sr-only">Next</span>
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )} */}
              {/* {paginationMeta && paginationMeta.pages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
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
                            onClick={() => handlePageChange(pageNum)}
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
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="flex items-center gap-1"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )} */}
            </TabsContent>
            <TabsContent value="adsets">
              <AdsetsTable
                id={selectedCampaignId || selectedAccount}
                getFor={selectedCampaignId ? "campaign" : "account"}
                setActiveTab={setActiveTab}
                setSelectedAdset={setSelectedAdset}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
              />
            </TabsContent>
            <TabsContent value="ads">
              <AdsTable
                id={selectedAdset || selectedAccount}
                getFor={selectedAdset ? "adset" : "account"}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Status Dialog for both errors and success messages */}
        <StatusDialog
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          title={dialogState.title}
          description={dialogState.description}
          variant={dialogState.variant}
          showActionButton={dialogState.showActionButton}
        />

        {/* <CreateAudienceDialog
          open={isCreateAudienceOpen}
          onOpenChange={setIsCreateAudienceOpen}
        /> */}
      </div>
    </div>
  );
};

export default Campaigns;
