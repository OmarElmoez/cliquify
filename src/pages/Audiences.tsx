import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {  Plus, Search, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CreateAudienceDialog from '@/components/audience/CreateAudienceDialog';
import { getAudiences, Audience } from '@/services/audience';
import Loading from '@/components/shared/Loader';
import { useDialog } from '@/hooks/useDialog';
import StatusDialog from '@/components/shared/StatusDialog';
import { useAdAccountStore } from '@/hooks';


const Audiences = () => {
  const [isCreateAudienceOpen, setIsCreateAudienceOpen] = useState(false);
  const [audiencesData, setAudiencesData] = useState<Audience[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccessfull, setIsSuccessfull] = useState(false)

  const {
    isDialogOpen,
    dialogState,
    showDialog,
    handleDialogClose
  } = useDialog();

  const selectedAdAccountId = useAdAccountStore(state => state.selectedAdAccountId);

  useEffect(() => {
    const fetchAudiences = async () => {
      try {
        const response = await getAudiences({account_id: selectedAdAccountId});
        setAudiencesData(response);
      } catch (error) {
        console.error('Error fetching audiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudiences();
  }, [selectedAdAccountId]);

  const handleSuccessfullState = (state: boolean) => {
    setIsSuccessfull(state)
  }

  useEffect(() => {
    let handler;
    if (isSuccessfull) {
      showDialog('success', 'Created Successfully', 'Audience has been created successfully', false);
      handler = setTimeout(() => {
        window.location.reload();
      }, 950);
    }
    
    return () => clearTimeout(handler)
  }, [isSuccessfull, showDialog])

  // const handlePage = async (url: string) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await getAudiences(url);
  //     setAudiencesData(response);
  //   } catch (error) {
  //     console.error('Error fetching audiences:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  return (
    <>
      {isLoading ? (
        <Loading size={100} />
      )
        : (audiencesData?.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No audiences found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              You haven't created any audiences yet. Create your first audience to start targeting your campaigns effectively.
            </p>
            {/* <Button
            onClick={() => setIsCreateAudienceOpen(true)}
            className="bg-[#9b87f5] text-white hover:bg-[#9b87f5]/90 flex items-center gap-2"
          >
            <Plus size={16} />
            Create your first audience
          </Button> */}
          </div>
        )
          : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Audiences</h1>
                <Button
                  onClick={() => setIsCreateAudienceOpen(true)}
                  className="bg-[#9b87f5] text-white hover:bg-[#9b87f5]/90 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Create audience
                </Button>
              </div>

              <div className="bg-white rounded-md shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-medium">Your audiences</div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search audiences"
                      className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">NAME</TableHead>
                        {/* <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">TYPE</TableHead>
                <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">SOURCE</TableHead>
                <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">SIZE</TableHead>
                <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">STATUS</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {audiencesData?.map(audience => (
                        <TableRow key={audience.id} className="hover:bg-gray-50">
                          <TableCell className="py-4 px-4 font-medium">{audience.name}</TableCell>
                          {/* <TableCell className="py-4 px-4">{audience.rule}</TableCell>
                  <TableCell className="py-4 px-4">{audience.rule}</TableCell> */}
                          {/* <TableCell className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      audience.status === 'Active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {audience.status}
                    </span>
                  </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* {audiencesData?.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      handlePage(audiencesData.paging.previous);
                      setCurrentPage(currentPage - 1);
                    }}
                    className={!audiencesData.paging.previous ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  >
                    <span className="sr-only">Previous</span>
                  </PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      handlePage(audiencesData.paging.next);
                      setCurrentPage(currentPage + 1);
                    }}
                    className={!audiencesData.paging.next ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  >
                    <span className="sr-only">Next</span>
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )} */}
              </div>

              <StatusDialog
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
                title={dialogState.title}
                description={dialogState.description}
                variant={dialogState.variant}
                showActionButton={dialogState.showActionButton}
              />

              <CreateAudienceDialog
                open={isCreateAudienceOpen}
                onOpenChange={setIsCreateAudienceOpen}
                handleSuccessfullState={handleSuccessfullState}
              />
            </div>
          )}
    </>
  );
};

export default Audiences;
