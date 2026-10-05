import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, User, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pendingBookings, setPendingBookings] = useState(0);
  const profileRef = useRef(null);

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Cars', to: '/cars' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.role !== 'admin') {
      setPendingBookings(0);
      return undefined;
    }

    let lastCheckedAt;
    let isMounted = true;
    let isPolling = false;
    let hasCompletedInitialCheck = false;
    let hasReportedInitialError = false;
    const seenBookingIds = new Set();

    const checkBookingNotifications = async () => {
      if (isPolling) return;
      isPolling = true;

      try {
        const { data } = await api.get('/admin/booking-notifications', {
          params: lastCheckedAt ? { since: lastCheckedAt } : {},
        });
        if (!isMounted) return;

        lastCheckedAt = data.checkedAt;
        setPendingBookings(data.pendingBookings);
        window.dispatchEvent(new CustomEvent('admin-booking-notifications', { detail: data }));

        const unseenBookings = data.newBookings.filter((booking) => !seenBookingIds.has(booking._id));
        unseenBookings.forEach((booking) => seenBookingIds.add(booking._id));

        if (hasCompletedInitialCheck && unseenBookings.length > 0) {
          const count = unseenBookings.length;
          toast.success(count === 1
            ? `New booking received for ${unseenBookings[0].car?.brand || 'a car'} ${unseenBookings[0].car?.model || ''}`.trim()
            : `${count} new bookings received`);
        }

        hasCompletedInitialCheck = true;
      } catch (error) {
        console.error('Failed to check booking notifications:', error);
        if (isMounted && !hasCompletedInitialCheck && !hasReportedInitialError) {
          toast.error(error.response?.data?.message || 'Could not load booking notifications');
          hasReportedInitialError = true;
        }
      } finally {
        isPolling = false;
      }
    };

    checkBookingNotifications();
    const intervalId = window.setInterval(checkBookingNotifications, 15000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white sm:h-10 sm:w-10 sm:text-lg">CR</div>
          <div>
            <p className="whitespace-nowrap text-base font-bold text-slate-900 sm:text-lg">Car Rental</p>
            <p className="hidden text-[10px] uppercase tracking-[0.25em] text-slate-500 sm:block">Drive with ease</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  aria-label={pendingBookings ? `${pendingBookings} pending bookings` : 'Admin notifications'}
                  title={pendingBookings ? `${pendingBookings} pending bookings` : 'Admin notifications'}
                  className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-brand-600"
                >
                  <Bell size={20} />
                  {pendingBookings > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                      {pendingBookings > 99 ? '99+' : pendingBookings}
                    </span>
                  )}
                </Link>
              )}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full bg-slate-100 px-2 py-2 transition hover:bg-slate-200 sm:px-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden text-sm font-medium text-slate-700 sm:inline-block">{user.name}</span>
                  <ChevronDown size={16} className={`text-slate-600 transition ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <p className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700 capitalize">
                        {user.role}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        <User size={16} />
                        My Profile
                      </Link>
                      <Link
                        to="/"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                      >
                        <Home size={16} />
                        Home
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
              )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 sm:px-4 sm:text-sm">
                Login
              </Link>
              <Link to="/register" className="whitespace-nowrap rounded-full bg-brand-600 px-3 py-2 text-xs font-medium text-white hover:bg-brand-700 sm:px-4 sm:text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
        <nav aria-label="Mobile navigation" className="mt-3 flex basis-full items-center gap-5 border-t border-slate-100 pt-3 md:hidden">
          <NavLink to="/" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-brand-600' : 'text-slate-600'}`}>
            Home
          </NavLink>
          <NavLink to="/cars" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-brand-600' : 'text-slate-600'}`}>
            Cars
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-brand-600' : 'text-slate-600'}`}>
              Admin
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
