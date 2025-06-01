
import React, { useState, useRef } from 'react';
import { X, Search, GripVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export type ColumnDefinition = {
  id: string;
  name: string;
  checked: boolean;
};

type EditColumnsDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  columns: ColumnDefinition[];
  onSave: (columns: ColumnDefinition[]) => void;
};

const EditColumnsDialog = ({ open, setOpen, columns, onSave }: EditColumnsDialogProps) => {
  const [allColumns, setAllColumns] = useState<ColumnDefinition[]>(columns);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<ColumnDefinition | null>(null);
  const dragOverItemRef = useRef<string | null>(null);

  const handleColumnToggle = (id: string) => {
    setAllColumns(prev => 
      prev.map(col => col.id === id ? { ...col, checked: !col.checked } : col)
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: ColumnDefinition) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (id: string) => {
    dragOverItemRef.current = id;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (!draggedItem || !dragOverItemRef.current || draggedItem.id === dragOverItemRef.current) {
      return;
    }

    const filteredColumns = allColumns.filter(col => col.checked);
    const draggedIndex = filteredColumns.findIndex(col => col.id === draggedItem.id);
    const dropIndex = filteredColumns.findIndex(col => col.id === dragOverItemRef.current);
    
    if (draggedIndex === -1 || dropIndex === -1) return;

    const newOrder = [...allColumns];
    const draggedItemsIndex = newOrder.findIndex(col => col.id === draggedItem.id);
    const dropItemsIndex = newOrder.findIndex(col => col.id === dragOverItemRef.current);
    
    const item = newOrder[draggedItemsIndex];
    newOrder.splice(draggedItemsIndex, 1);
    newOrder.splice(dropItemsIndex, 0, item);
    
    setAllColumns(newOrder);
    setDraggedItem(null);
    dragOverItemRef.current = null;
  };

  const removeColumn = (id: string) => {
    setAllColumns(prev => 
      prev.map(col => col.id === id ? { ...col, checked: false } : col)
    );
  };

  const handleSave = () => {
    onSave(allColumns);
    setOpen(false);
  };

  const filteredColumns = allColumns.filter(col => 
    col.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedColumns = allColumns.filter(col => col.checked);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl font-bold">Edit columns</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row h-[500px] overflow-hidden">
          {/* Left column - All columns */}
          <div className="w-full md:w-1/2 border-r p-4 overflow-y-auto">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search columns"
                className="pl-10"
              />
            </div>
            
            <h3 className="text-sm font-semibold text-gray-500 mb-2">COLUMNS</h3>
            
            <div className="space-y-3">
              {filteredColumns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`column-${column.id}`}
                    checked={column.checked} 
                    onCheckedChange={() => handleColumnToggle(column.id)}
                  />
                  <label 
                    htmlFor={`column-${column.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right column - Selected columns */}
          <div className="w-full md:w-1/2 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">SELECTED COLUMNS</h3>
            
            <div className="space-y-3">
              {selectedColumns.map((column) => (
                <div 
                  key={column.id}
                  className="flex items-center justify-between p-2 bg-gray-50 border rounded-md"
                  draggable
                  onDragStart={(e) => handleDragStart(e, column)}
                  onDragOver={handleDragOver}
                  onDragEnter={() => handleDragEnter(column.id)}
                  onDrop={handleDrop}
                >
                  <div className="flex items-center space-x-2">
                    <GripVertical className="text-gray-400 cursor-grab" size={16} />
                    <span className="text-sm">{column.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => removeColumn(column.id)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditColumnsDialog;
