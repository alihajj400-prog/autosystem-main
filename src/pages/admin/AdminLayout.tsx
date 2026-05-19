import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Car, FileText, LogOut, LayoutDashboard, Loader2, Menu, Package } from 'lucide-react';
import { isNavActive } from '@/lib/format';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/cars', label: 'Manage Cars', icon: Car },
  { href: '/admin/parts', label: 'Manage Parts', icon: Package },
  { href: '/admin/requests', label: 'Contact Requests', icon: FileText },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <nav className="flex-1 space-y-1 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.exact
          ? location.pathname === item.href
          : isNavActive(location.pathname, item.href);
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ userEmail, signOut }: { userEmail?: string; signOut: () => void }) {
  return (
    <div className="border-t border-sidebar-border p-4">
      <div className="mb-3 text-xs text-sidebar-foreground/50">
        Signed in as
        <br />
        <span className="font-medium text-sidebar-foreground">{userEmail}</span>
      </div>
      <div className="space-y-2">
        <Link to="/" className="block">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            View Site
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don&apos;t have admin privileges to access this area.
        </p>
        <Link to="/" className="mt-6">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 bg-sidebar md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary">
              <span className="font-display text-sm font-bold text-sidebar-primary-foreground">A</span>
            </div>
            <span className="font-display text-lg font-semibold text-sidebar-foreground">Admin</span>
          </div>
          <SidebarNav />
          <SidebarFooter userEmail={user.email} signOut={signOut} />
        </div>
      </aside>

      <div className="flex flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0 text-sidebar-foreground">
              <div className="flex h-16 items-center border-b border-sidebar-border px-6 font-display text-lg font-semibold">
                Autosystem Admin
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
              <SidebarFooter userEmail={user.email} signOut={signOut} />
            </SheetContent>
          </Sheet>
          <span className="font-display font-semibold">Admin</span>
        </header>

        <main className="flex-1 bg-background">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
