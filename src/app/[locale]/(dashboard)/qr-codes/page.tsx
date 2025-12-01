'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRList } from '@/components/qr/qr-list';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

interface QRCode {
  id: string;
  title: string;
  data_url: string;
  short_code: string;
  scan_count: number;
  created_at: string;
  status: string;
  foreground_color: string;
  background_color: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function QRCodesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [qrcodes, setQrcodes] = useState<QRCode[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const [sortBy, setSortBy] = useState('created_at');

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  // Fetch QR codes (MOCK)
  const fetchQRCodes = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      const mockQRCodes = [
        {
          id: '1',
          title: 'My Website',
          data_url: 'https://example.com',
          short_code: 'abc',
          scan_count: 120,
          created_at: new Date().toISOString(),
          status: 'active',
          foreground_color: '#000000',
          background_color: '#ffffff',
        },
        {
          id: '2',
          title: 'WiFi Network',
          data_url: 'WIFI:S:MyNetwork;T:WPA;P:password;;',
          short_code: 'def',
          scan_count: 50,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'active',
          foreground_color: '#4F46E5',
          background_color: '#ffffff',
        },
        {
          id: '3',
          title: 'Contact Card',
          data_url: 'BEGIN:VCARD...',
          short_code: 'ghi',
          scan_count: 12,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          status: 'archived',
          foreground_color: '#000000',
          background_color: '#F3F4F6',
        },
      ];

      // Filter mock data based on search and status
      let filtered = mockQRCodes;
      if (search) {
        filtered = filtered.filter(qr => qr.title.toLowerCase().includes(search.toLowerCase()));
      }
      if (status !== 'all') {
        filtered = filtered.filter(qr => qr.status === status);
      }

      setQrcodes(filtered);
      setPagination({
        page: 1,
        limit: 12,
        total: filtered.length,
        totalPages: 1,
      });
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (user) {
      fetchQRCodes();
    }
  }, [user, pagination.page, search, status, sortBy]);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilter = (newStatus: string) => {
    setStatus(newStatus);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  if (authLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My QR Codes</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your QR codes
          </p>
        </div>
        <Link href="/">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create QR Code
          </Button>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* QR List */}
      {!loading && (
        <>
          <QRList
            qrcodes={qrcodes}
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(pagination.totalPages, prev.page + 1),
                  }))
                }
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
