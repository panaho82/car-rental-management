import axios from 'axios';
import type { Database } from '../supabase/types/database';

const API_URL = 'http://localhost:3000/api';

type Customer = Database['public']['Tables']['customers']['Row'];
type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type Reservation = Database['public']['Tables']['reservations']['Row'];

async function testReservations() {
    console.log('\nTesting reservations API...\n');

    try {
        // 0. Create test data
        console.log('0. Creating test data');

        // Create a customer
        const customer = await axios.post<Customer>(`${API_URL}/customers`, {
            first_name: 'Jane',
            last_name: 'Smith',
            email: `jane.smith.${Date.now()}@example.com`,
            phone: '+1234567890',
            address: '456 Oak St, City, Country',
            driver_license: `DL${Date.now()}`,
            driver_license_expiry: '2025-12-31'
        });
        console.log('Customer created:', customer.data.first_name, customer.data.last_name);

        // Create a vehicle
        const vehicle = await axios.post<Vehicle>(`${API_URL}/vehicles`, {
            brand: 'Toyota',
            model: 'Camry',
            year: 2023,
            registration: 'ABC123',
            mileage: 15000,
            status: 'available',
            category: 'midsize',
            daily_rate: 50.00,
            features: ['GPS', 'Bluetooth', 'Backup Camera'],
            images: []
        });
        console.log('Vehicle created:', vehicle.data.brand, vehicle.data.model);

        // 1. Create a reservation
        console.log('\n1. Creating a reservation');
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1); // Tomorrow
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 3); // In 3 days

        const reservation = await axios.post<Reservation>(`${API_URL}/reservations`, {
            customer_id: customer.data.id,
            vehicle_id: vehicle.data.id,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            status: 'pending',
            total_price: vehicle.data.daily_rate * 3,
            payment_status: 'pending'
        });
        console.log('Reservation created:', reservation.data);

        // 2. Get all reservations
        console.log('\n2. Getting all reservations');
        const allReservations = await axios.get<Reservation[]>(`${API_URL}/reservations`);
        console.log(`${allReservations.data.length} reservations found`);

        // 3. Confirm the reservation
        console.log('\n3. Confirming the reservation');
        const confirmedReservation = await axios.put<Reservation>(`${API_URL}/reservations/${reservation.data.id}`, {
            status: 'confirmed'
        });
        console.log('Reservation confirmed:', confirmedReservation.data);

        // 4. Get a reservation by ID
        console.log('\n4. Getting a reservation by ID');
        const getReservation = await axios.get<Reservation>(`${API_URL}/reservations/${reservation.data.id}`);
        console.log('Reservation retrieved:', getReservation.data);

        // Clean up
        console.log('\nCleaning up test data...');
        await axios.delete(`${API_URL}/reservations/${reservation.data.id}`);
        await axios.delete(`${API_URL}/customers/${customer.data.id}`);
        await axios.delete(`${API_URL}/vehicles/${vehicle.data.id}`);

        console.log('\nAll tests passed!');
    } catch (error: any) {
        console.error('Error during tests:', error.response?.data || error.message);
    }
}

testReservations();
