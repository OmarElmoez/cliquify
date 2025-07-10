import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CreateAudienceDialog from '@/components/audience/CreateAudienceDialog';
import StatusDialog from '@/components/shared/StatusDialog';
import { getAdAccounts, AdAccount } from '@/services/adAccountService';
import { getCampaigns, Campaign, updateCampaignStatus, CampaignsResponse, CampaignStatus } from '@/services/campaignService';
import { formatCampaignDate } from '@/utils/dateFormatters';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader, RefreshCcw } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { dummyCampaignsResponse } from '@/data/dummyCampaigns';
import GoogleSignInButton from '@/components/ui/GoogleSignInButton';
import MetaSignInButton from '@/components/ui/MetaSignInButton';
import { useDialog } from '@/hooks/useDialog';

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#1877F2"/>
    <path d="M16.5 12H13.5V9C13.5 8.4 13.95 9 14.55 9H15V6H13.5C11.7 6 10.5 7.2 10.5 9V12H9V15H10.5V22.5H13.5V15H15.75L16.5 12Z" fill="white"/>
  </svg>
);

const Campaigns = () => {
  const [isCreateAudienceOpen, setIsCreateAudienceOpen] = useState(false);
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null); // Store the campaign ID that's being updated
  const [error, setError] = useState<string | null>(null);
  const {
    isDialogOpen,
    dialogState,
    showDialog,
    handleDialogClose
  } = useDialog();
  const [campaignsData, setCampaignsData] = useState<CampaignsResponse>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [pagination, setPagination] = useState<{
  //   next: string | null;
  //   previous: string | null;
  //   count: number;
  // }>({ next: null, previous: null, count: 0 });
  const [showRetryAction, setShowRetryAction] = useState<{
    visible: boolean;
    type: 'accounts' | 'campaigns';
  }>({ visible: false, type: 'accounts' });
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentCampaignStatus, setCurrentCampaignStatus] = useState("");
  
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
      setError(null);
      setShowRetryAction({ visible: false, type: 'accounts' });
      const accounts = await getAdAccounts();
      setAdAccounts(accounts.data);
      if (accounts.data.length > 0) {
        setSelectedAccount(accounts.data[0].id);
      }
    } catch (error) {
      const errorMessage = 'Failed to load ad accounts. Please try again later.';
      setError(errorMessage);
      showDialog('error', 'Error', errorMessage, false);
      
      // Show retry action after 1 second
      setTimeout(() => {
        setShowRetryAction({ visible: true, type: 'accounts' });
      }, 1000);
      
      console.error('Error fetching ad accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      setShowRetryAction({ visible: false, type: 'campaigns' });
      
      const response = await getCampaigns({account_id: selectedAccount, page});
      setCampaignsData(response);
    } catch (error) {
      const errorMessage = 'Failed to load campaigns. Please try again later.';
      setError(errorMessage);
      showDialog('error', 'Error', errorMessage, false);
      
      // Show retry action after 1 second
      setTimeout(() => {
        setShowRetryAction({ visible: true, type: 'campaigns' });
      }, 1000);
      
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCampaigns = async () => {
    try {
      const response = await getCampaigns({account_id: selectedAccount});
      setCampaignsData(response);
      toast.success("Campaigns refreshed successfully");
    } catch (error) {
      console.error('Error refreshing campaigns:', error);
      toast.error("Failed to refresh campaigns");
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

  const handleStatusToggle = async (campaignId: string, currentStatus: CampaignStatus) => {
    try {
      setStatusLoading(campaignId);
      const response = await updateCampaignStatus(campaignId, currentStatus);
      
      if (response.new_status.success) {
        // Refetch campaigns to get the latest data
        loadCampaigns(currentPage);
        
        showDialog('success', 'Status Updated', response.message, false);
      }
    } catch (error) {
      console.error('Error updating campaign status:', error);
      showDialog('error', 'Status Update Failed', 'Failed to update campaign status. Please try again later.', false);
    } finally {
      setStatusLoading(null);
    }
  };

  // const handleStatusToggle = (campaignId: string, currentStatus: string) => {
  //   setCampaignsData(campaignsData.results.map(campaign => 
  //     campaign.id === campaignId ? { ...campaign, status: currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE" } : campaign
  //   ));
  // };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ads</h1>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"
            onClick={() => setIsCreateAudienceOpen(true)}
          >
            Create audience
          </Button>
          <Button 
            className="bg-[#9b87f5] text-white hover:bg-[#9b87f5]/90"
            onClick={() => navigate('/campaigns/create')}
          >
            Create ad campaign
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-brand-lighterBlue p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div className="w-64">
              <div className="text-sm text-gray-600 mb-1">Accounts:</div>
              <Select 
                value={selectedAccount}
                onValueChange={handleAccountChange}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder={loading ? "Loading accounts..." : "Select account"} />
                </SelectTrigger>
                <SelectContent>
                  {adAccounts.length > 0 ? (
                    adAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-accounts" disabled>
                      {error ? "Failed to load accounts" : "No accounts available"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {/* New refresh campaigns button */}
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
                {refreshing ? "Refreshing..." : "Refresh campaigns"}
              </Button>
            )}
          </div>
        </div>

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
        <div className="border rounded-md overflow-hidden">
          {loading ? (
            <div className="py-8 text-center">Loading campaigns...</div>
          ) : campaignsData?.results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">NAME</TableHead>
                  <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">STATUS</TableHead>
                  <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">BUYING TYPE</TableHead>
                  <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">CREATED TIME</TableHead>
                  <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">OBJECTIVE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignsData?.results.map(campaign => (
                  <TableRow key={campaign.id}>
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FacebookIcon />
                        <div>{campaign.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {statusLoading === campaign.id ? (
                          <div className="w-10 h-5 flex items-center justify-center">
                            <Loader className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          <Switch
                            checked={campaign.status === "ACTIVE"}
                            onCheckedChange={(checked) =>
                              handleStatusToggle(
                                campaign.id,
                                checked ? "ACTIVE" : "PAUSED"
                              )
                            }
                            className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">{campaign.buying_type}</TableCell>
                    <TableCell className="py-4 px-4">{formatCampaignDate(campaign.created_time)}</TableCell>
                    <TableCell className="py-4 px-4">{campaign.objective}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              {selectedAccount ? "No campaigns available for this account." : "Please select an account to view campaigns."}
            </div>
          )}
        </div>

        {campaignsData?.results.length > 0 && (
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
        )}

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
