import { useEffect, useState } from 'react';
import { CalendarDays, CarFront, CircleDollarSign, Clock3, UserCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FALLBACK_PROFILE_IMAGE = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80';

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

const ProfilePage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalSpent: 0,
    upcomingTrips: 0,
    cancelledBookings: 0,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        const [bookingsResponse, statsResponse] = await Promise.all([
          api.get('/bookings/my-bookings'),
          api.get('/bookings/my-dashboard'),
        ]);

        setBookings(bookingsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        toast.error('Could not load your dashboard data');
      }
    };

    fetchProfileData();
  }, [user]);

  const handleCancel = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      setBookings((prev) => prev.map((booking) => booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking));
      setStats((prev) => ({
        ...prev,
        activeBookings: Math.max(prev.activeBookings - 1, 0),
        cancelledBookings: prev.cancelledBookings + 1,
      }));
      toast.success('Booking cancelled');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    }
  };

  if (!user) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-lg font-medium text-slate-700">Please login to view your profile.</div>;
  }

  const statCards = [
    { label: 'Total bookings', value: stats.totalBookings, icon: CarFront, color: 'bg-brand-100 text-brand-700' },
    { label: 'Active bookings', value: stats.activeBookings, icon: Clock3, color: 'bg-amber-100 text-amber-700' },
    { label: 'Total spent', value: `₹${stats.totalSpent || 0}`, icon: CircleDollarSign, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Upcoming trips', value: stats.upcomingTrips, icon: CalendarDays, color: 'bg-sky-100 text-sky-700' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-700 p-6 text-white shadow-soft">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white/40 bg-white/10 shadow-xl">
              <img
                src={FALLBACK_PROFILE_IMAGE}
                alt={user.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0f172a&color=ffffff&size=200`;
                }}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-100">Profile dashboard</p>
              <h1 className="mt-2 text-3xl font-black text-white">Welcome back, {user.name}</h1>
              <p className="mt-2 text-sm text-slate-200">{user.email}</p>
              {user.phone && <p className="mt-1 text-sm text-brand-100">Phone: {user.phone}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-100 backdrop-blur-sm">
            <UserCircle2 className="h-5 w-5 text-brand-100" />
            <span>{user.role === 'admin' ? 'Administrator' : 'Customer account'}</span>
          </div>
        </div>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Your bookings</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {stats.cancelledBookings} cancelled
          </span>
        </div>

        {bookings.length === 0 ? (
          <p className="text-slate-600">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">{booking.car?.brand} {booking.car?.model}</p>
                  <p className="text-sm text-slate-600">{new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{booking.status}</span>
                  <p className="font-bold text-slate-900">₹{booking.totalAmount}</p>
                  {['pending'].includes(booking.status) && (
                    <button onClick={() => handleCancel(booking._id)} className="rounded-full bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
