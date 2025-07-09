import { useState } from 'react';

export type DialogVariant = 'error' | 'success';

interface DialogState {
  variant: DialogVariant;
  title: string;
  description: string;
  showActionButton: boolean;
}

export function useDialog(initialState?: Partial<DialogState>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>({
    variant: initialState?.variant || 'error',
    title: initialState?.title || '',
    description: initialState?.description || '',
    showActionButton: initialState?.showActionButton ?? true,
  });

  const showDialog = (
    variant: DialogVariant,
    title: string,
    description: string,
    showActionButton: boolean
  ) => {
    setDialogState({ variant, title, description, showActionButton });
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return {
    isDialogOpen,
    dialogState,
    showDialog,
    handleDialogClose,
    setDialogState, // in case direct update is needed
    setIsDialogOpen, // in case direct update is needed
  };
} 