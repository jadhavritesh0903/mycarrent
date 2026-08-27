const mongoose = require('mongoose');
const Car = require('../models/Car');

// In-memory car storage (for development without MongoDB)
const cars = new Map();

// Mock car data
const initializeMockCars = () => {
  const mockCars = [
    {
      _id: '1',
      brand: 'Toyota',
      model: 'Fortuner',
      year: 2023,
      pricePerDay: 2999,
      location: 'Mumbai',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      seats: 7,
      available: true,
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
      description: 'A premium SUV ideal for city travel, long drives, and family outings.',
    },
    {
      _id: '2',
      brand: 'Honda',
      model: 'City',
      year: 2023,
      pricePerDay: 1499,
      location: 'Mumbai',
      fuelType: 'Petrol',
      transmission: 'Manual',
      seats: 5,
      available: true,
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
      description: 'A smooth and efficient sedan that balances comfort, style, and affordability.',
    },
    {
      _id: '3',
      brand: 'Maruti',
      model: 'Swift',
      year: 2022,
      pricePerDay: 999,
      location: 'Delhi',
      fuelType: 'Petrol',
      transmission: 'Manual',
      seats: 5,
      available: true,
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
      description: 'Compact, sporty, and easy to handle for daily commutes and short trips.',
    },
    {
      _id: '6',
      brand: 'Tata',
      model: 'Nano',
      year: 2021,
      pricePerDay: 799,
      location: 'Pune',
      fuelType: 'Petrol',
      transmission: 'Manual',
      seats: 4,
      available: true,
      image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80',
      description: 'A budget-friendly city car built for affordable, practical everyday use.',
    },
    {
      _id: '7',
      brand: 'Maruti',
      model: 'WagonR',
      year: 2023,
      pricePerDay: 1099,
      location: 'Jaipur',
      fuelType: 'Petrol',
      transmission: 'Manual',
      seats: 5,
      available: true,
      image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80',
      description: 'A practical hatchback with roomy interiors and quick city-friendly handling.',
    },
    {
      _id: '8',
      brand: 'Hyundai',
      model: 'Aura',
      year: 2023,
      pricePerDay: 1299,
      location: 'Bangalore',
      fuelType: 'Diesel',
      transmission: 'Manual',
      seats: 5,
      available: true,
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
      description: 'A smart compact sedan with premium comfort and efficient mileage.',
    },
    {
      _id: '9',
      brand: 'Toyota',
      model: 'Innova',
      year: 2022,
      pricePerDay: 2799,
      location: 'Hyderabad',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      seats: 7,
      available: true,
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
      description: 'A strong family MPV for long distance trips and group travel comfort.',
    },
    {
      _id: '10',
      brand: 'Mahindra',
      model: 'Scorpio',
      year: 2021,
      pricePerDay: 2499,
      location: 'Pune',
      fuelType: 'Diesel',
      transmission: 'Manual',
      seats: 7,
      available: true,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      description: 'A rugged SUV built for power, road presence, and family touring.',
    },
    {
      _id: '11',
      brand: 'Hyundai',
      model: 'Creta',
      year: 2023,
      pricePerDay: 1999,
      location: 'Bangalore',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      seats: 5,
      available: true,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      description: 'A versatile SUV with great cabin space and a confident, modern design.',
    },
    {
      _id: '12',
      brand: 'Mahindra',
      model: 'Bolero',
      year: 2022,
      pricePerDay: 2199,
      location: 'Nagpur',
      fuelType: 'Diesel',
      transmission: 'Manual',
      seats: 7,
      available: true,
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
      description: 'A reliable and durable SUV for long drives and budget-friendly travel.',
    },
    {
      _id: '13',
      brand: 'Tata',
      model: 'Fortuner',
      year: 2022,
      pricePerDay: 3499,
      location: 'Mumbai',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      seats: 7,
      available: true,
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
      description: 'A high-demand premium SUV offering comfort, safety, and commanding road presence.',
    },
  ];

  mockCars.forEach((car) => cars.set(car._id, car));
};

initializeMockCars();

const getCars = async (req, res) => {
  try {
    const { search, fuelType, transmission, available, sort } = req.query;
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (search) query.$or = ['brand', 'model', 'location'].map((field) => ({ [field]: { $regex: search, $options: 'i' } }));
      if (fuelType) query.fuelType = fuelType;
      if (transmission) query.transmission = transmission;
      if (available !== undefined) query.available = available === 'true';
      const order = sort === 'low-to-high' ? { pricePerDay: 1 } : sort === 'high-to-low' ? { pricePerDay: -1 } : { createdAt: -1 };
      return res.json(await Car.find(query).sort(order));
    }
    let filteredCars = Array.from(cars.values());

    if (search) {
      filteredCars = filteredCars.filter(
        (car) =>
          car.brand.toLowerCase().includes(search.toLowerCase()) ||
          car.model.toLowerCase().includes(search.toLowerCase()) ||
          car.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (fuelType) filteredCars = filteredCars.filter((car) => car.fuelType === fuelType);
    if (transmission) filteredCars = filteredCars.filter((car) => car.transmission === transmission);
    if (available !== undefined) filteredCars = filteredCars.filter((car) => car.available === (available === 'true'));

    if (sort === 'low-to-high') filteredCars.sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0));
    if (sort === 'high-to-low') filteredCars.sort((a, b) => (b.pricePerDay ?? 0) - (a.pricePerDay ?? 0));

    return res.json(filteredCars);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCarById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const car = await Car.findById(req.params.id);
      if (!car) return res.status(404).json({ message: 'Car not found' });
      return res.json(car);
    }
    const car = cars.get(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    return res.json(car);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createCar = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const car = await Car.create(req.body);
      return res.status(201).json({ message: 'Car added successfully', car });
    }
    const carId = Date.now().toString();
    const car = { _id: carId, ...req.body };
    cars.set(carId, car);
    return res.status(201).json({ message: 'Car added successfully', car });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCar = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!car) return res.status(404).json({ message: 'Car not found' });
      return res.json({ message: 'Car updated successfully', car });
    }
    const car = cars.get(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    const updatedCar = { ...car, ...req.body };
    cars.set(req.params.id, updatedCar);
    return res.json({ message: 'Car updated successfully', car: updatedCar });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const car = await Car.findByIdAndDelete(req.params.id);
      if (!car) return res.status(404).json({ message: 'Car not found' });
      return res.json({ message: 'Car deleted successfully' });
    }
    if (!cars.has(req.params.id)) return res.status(404).json({ message: 'Car not found' });
    cars.delete(req.params.id);
    return res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const seedCars = async () => {
  if (mongoose.connection.readyState !== 1 || await Car.exists()) return;
  const seedData = Array.from(cars.values()).map(({ _id, ...car }) => car);
  await Car.insertMany(seedData);
  console.log(`Seeded ${seedData.length} cars into MongoDB`);
};

module.exports = { cars, getCars, getCarById, createCar, updateCar, deleteCar, seedCars };
