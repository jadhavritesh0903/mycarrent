import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await api.get(`/cars/${id}`);
        setCar(data);
      } catch (error) {
        toast.error('Could not load car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (end <= start) return 0;
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  }, [pickupDate, returnDate]);

  const totalPrice = car ? rentalDays * (car.pricePerDay ?? 0) : 0;

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error('Please select pickup and return dates');
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    try {
      const { data } = await api.post('/bookings', {
        carId: id,
        pickupDate,
        returnDate,
        phoneNumber,
      });
      toast.success(data.message || 'Booking created successfully');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-16">Loading car details...</div>;
  }

  if (!car) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-center">Car not found.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <img
            src={car.image || 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80'}
            alt={`${car.brand} ${car.model}`}
            className="h-[440px] w-full rounded-[28px] object-cover shadow-soft"
            onError={(event) => {
              event.currentTarget.src = 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <h1 className="text-3xl font-black text-slate-900">{car.brand} {car.model}</h1>
            <p className="mt-3 text-slate-600">{car.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Year</p><p className="font-bold text-slate-900">{car.year}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Fuel</p><p className="font-bold text-slate-900">{car.fuelType}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Transmission</p><p className="font-bold text-slate-900">{car.transmission}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Seats</p><p className="font-bold text-slate-900">{car.seats}</p></div>
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-600">From</p>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${car.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {car.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
<p className="mt-4 text-4xl font-black text-slate-900">₹{car.pricePerDay ?? 0}<span className="text-lg font-medium text-slate-500">/day</span></p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Pickup Date</label>
              <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Return Date</label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-400" />
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Rental days</span>
              <span>{rentalDays}</span>
            </div>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Location</span>
              <span>{car.location}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <button onClick={handleBooking} className="mt-6 w-full rounded-full bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700">
            Book Now
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CarDetailsPage;
