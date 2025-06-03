
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CreateAudienceDialog from '@/components/audience/CreateAudienceDialog';
import audiencesData from '@/data/dummyAudiences';

const Audiences = () => {
  const [isCreateAudienceOpen, setIsCreateAudienceOpen] = useState(false);

  return (
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
                <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">TYPE</TableHead>
                <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">SOURCE</TableHead>
                <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">SIZE</TableHead>
                <TableHead className="py-3 px-4 text-left font-medium text-sm text-gray-600">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audiencesData.map(audience => (
                <TableRow key={audience.id} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell className="py-4 px-4 font-medium">{audience.name}</TableCell>
                  <TableCell className="py-4 px-4">{audience.type}</TableCell>
                  <TableCell className="py-4 px-4">{audience.source}</TableCell>
                  <TableCell className="py-4 px-4">{audience.size}</TableCell>
                  <TableCell className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      audience.status === 'Active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {audience.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateAudienceDialog 
        open={isCreateAudienceOpen}
        onOpenChange={setIsCreateAudienceOpen}
      />
    </div>
  );
};

export default Audiences;
