import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await api.get('/cars', {
          params: { search },
        });
        setCars(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [search]);

  const filteredCars = useMemo(() => {
    return [...cars].sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0));
  }, [cars]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Find your ride</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Available cars</h1>
        </div>

        <div className="flex items-center gap-3">
          <input
            defaultValue={search}
            onChange={(e) => setSearchParams({ search: e.target.value })}
            placeholder="Search cars"
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400"
          />
          <button className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Sort: Low to High</button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4].map((item) => <div key={item} className="h-80 animate-pulse rounded-3xl bg-slate-200" />)}
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-slate-700">No cars match your search.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCars.map((car) => (
            <div key={car._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
              <img
                src={car.image || 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80'}
                alt={`${car.brand} ${car.model}`}
                className="h-56 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">{car.brand}</p>
                    <h2 className="text-xl font-bold text-slate-900">{car.model}</h2>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${car.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {car.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
                  <span>⛽ {car.fuelType}</span>
                  <span>⚙ {car.transmission}</span>
                  <span>👥 {(car.seats || car.seating || 5)} Seats</span>
                  <span>📍 {car.location}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <p className="text-2xl font-bold text-slate-900">₹{car.pricePerDay ?? 0}<span className="text-sm font-medium text-slate-500">/day</span></p>
                  <Link to={`/cars/${car._id}`} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarsPage;
