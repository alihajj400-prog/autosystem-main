import { useCars } from '@/hooks/useCars';
import { useParts } from '@/hooks/useParts';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Car, FileText, TrendingUp, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { data: cars } = useCars();
  const { data: parts } = useParts();
  
  const { data: requests } = useQuery({
    queryKey: ['contact-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const totalCars = cars?.length || 0;
  const availableCars = cars?.filter((c) => c.status !== 'sold').length || 0;
  const soldCars = cars?.filter((c) => c.status === 'sold').length || 0;
  const totalParts = parts?.length || 0;
  const featuredCars = cars?.filter((c) => c.featured).length || 0;
  const totalRequests = requests?.length || 0;
  const pendingRequests = requests?.filter((r) => r.status === 'pending').length || 0;

  const recentRequests = requests?.slice(0, 5) || [];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your Autosystem inventory and inquiries
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <Car className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalCars}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{availableCars}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{soldCars}</p>
              <p className="text-xs text-muted-foreground">Sold</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{featuredCars}</p>
              <p className="text-xs text-muted-foreground">Featured</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalRequests}</p>
              <p className="text-xs text-muted-foreground">Inquiries</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold">{pendingRequests}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 font-display text-lg font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/cars/new">
            <Button>Add New Car</Button>
          </Link>
          <Link to="/admin/cars">
            <Button variant="outline">Manage Inventory</Button>
          </Link>
          <Link to="/admin/requests">
            <Button variant="outline">View Inquiries</Button>
          </Link>
          <Link to="/admin/parts/new">
            <Button variant="outline">Add Part / Screen</Button>
          </Link>
        </div>
        {totalParts > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">{totalParts} parts & screens in catalog</p>
        )}
      </div>

      {/* Recent Requests */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold">Recent Inquiries</h2>
        {recentRequests.length > 0 ? (
          <div className="rounded-lg border bg-card">
            <div className="divide-y">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{request.name}</p>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {request.status}
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No inquiries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
