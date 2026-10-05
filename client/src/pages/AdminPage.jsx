import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const handleAcceptBooking = async (bookingId) => {
    try {
      const { data } = await api.put(`/bookings/${bookingId}/status`, { status: 'confirmed' });
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: data.booking?.status || 'confirmed' } : booking
        )
      );
      toast.success('Booking accepted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept booking');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (user?.role !== 'admin') return;

      try {
        const [statsRes, carsRes, usersRes, bookingsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/cars'),
          api.get('/admin/users'),
          api.get('/bookings'),
        ]);

        setStats(statsRes.data);
        setCars(carsRes.data);
        setUsers(usersRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        toast.error('Failed to load admin dashboard');
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    const handleBookingNotifications = (event) => {
      const { newBookings = [], pendingBookings, totalBookings } = event.detail;

      if (newBookings.length > 0) {
        setBookings((previousBookings) => {
          const existingIds = new Set(previousBookings.map((booking) => booking._id));
          const unseenBookings = newBookings.filter((booking) => !existingIds.has(booking._id));
          return [...unseenBookings, ...previousBookings];
        });
      }

      setStats((previousStats) => ({
        ...previousStats,
        pendingBookings,
        totalBookings,
      }));
    };

    window.addEventListener('admin-booking-notifications', handleBookingNotifications);
    return () => window.removeEventListener('admin-booking-notifications', handleBookingNotifications);
  }, []);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-slate-900">Admin Dashboard</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl bg-white p-6 shadow-soft"><p className="text-sm text-slate-500">Total Cars</p><p className="mt-2 text-3xl font-black text-slate-900">{stats.totalCars || 0}</p></div>
        <div className="rounded-3xl bg-white p-6 shadow-soft"><p className="text-sm text-slate-500">Total Users</p><p className="mt-2 text-3xl font-black text-slate-900">{stats.totalUsers || 0}</p></div>
        <div className="rounded-3xl bg-white p-6 shadow-soft"><p className="text-sm text-slate-500">Bookings</p><p className="mt-2 text-3xl font-black text-slate-900">{stats.totalBookings || 0}</p></div>
        <div className="rounded-3xl bg-white p-6 shadow-soft"><p className="text-sm text-slate-500">Available Cars</p><p className="mt-2 text-3xl font-black text-slate-900">{stats.availableCars || 0}</p></div>
        <div className="rounded-3xl bg-white p-6 shadow-soft"><p className="text-sm text-slate-500">Pending Bookings</p><p className="mt-2 text-3xl font-black text-amber-600">{stats.pendingBookings || 0}</p></div>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Cars</h2>
          <div className="space-y-3">
            {cars.map((car) => (
              <div key={car._id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <div>
                  <p className="font-bold text-slate-900">{car.brand} {car.model}</p>
                  <p className="text-sm text-slate-600">{car.location}</p>
                </div>
                <span className="text-sm font-semibold text-brand-600">₹{car.pricePerDay ?? 0}/day</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Users</h2>
          <div className="space-y-3">
            {users.map((userItem) => (
              <div key={userItem._id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <div>
                  <p className="font-bold text-slate-900">{userItem.name}</p>
                  <p className="text-sm text-slate-600">{userItem.email}</p>
                </div>
                <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">{userItem.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Bookings</h2>
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold text-slate-900">Booker: {booking.user?.name || 'Unknown User'}</p>
                <p className="text-sm text-slate-600">{booking.car?.brand} {booking.car?.model}</p>
                <p className="text-sm text-slate-600">{new Date(booking.pickupDate).toLocaleDateString()} to {new Date(booking.returnDate).toLocaleDateString()}</p>
                <p className="text-sm text-slate-600">Email: {booking.user?.email || 'Not available'}</p>
                <p className="text-sm text-slate-600">Phone: {booking.phoneNumber || booking.user?.phone || 'Not available'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">{booking.status}</span>
                <span className="font-bold text-slate-900">₹{booking.totalAmount}</span>
                {booking.status !== 'confirmed' && (
                  <button
                    onClick={() => handleAcceptBooking(booking._id)}
                    className="rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Accept
                  </button>
                )}
                {booking.user?.email && (
                  <a
                    href={`mailto:${booking.user.email}`}
                    className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    Contact
                  </a>
                )}
                {(booking.phoneNumber || booking.user?.phone) && (
                  <a
                    href={`tel:${encodeURIComponent(booking.phoneNumber || booking.user?.phone || '')}`}
                    className="rounded-full bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    Call
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
