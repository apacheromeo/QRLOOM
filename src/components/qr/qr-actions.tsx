'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  MoreVertical,
  Edit,
  Download,
  Archive,
  Trash2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRActionsProps {
  qrcodeId: string;
  shortCode: string;
  status: string;
  onUpdate?: () => void;
}

export function QRActions({
  qrcodeId,
  shortCode,
  status,
  onUpdate,
}: QRActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/r/${shortCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({
        title: 'Link copied!',
        description: 'Short URL copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleArchive = async () => {
    try {
      const response = await fetch(`/api/qr/${qrcodeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: status === 'archived' ? 'active' : 'archived',
        }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: status === 'archived' ? 'Unarchived!' : 'Archived!',
        description: `QR code ${
          status === 'archived' ? 'restored' : 'moved to archive'
        }`,
      });

      onUpdate?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update QR code',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/qr/${qrcodeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error();

      toast({
        title: 'Deleted!',
        description: 'QR code has been deleted',
      });

      setShowDeleteDialog(false);
      onUpdate?.();
      router.push('/qr-codes');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete QR code',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/qr-codes/${qrcodeId}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Link
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleArchive}>
            <Archive className="mr-2 h-4 w-4" />
            {status === 'archived' ? 'Unarchive' : 'Archive'}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your QR
              code and all associated analytics data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
