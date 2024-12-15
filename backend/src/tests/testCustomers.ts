import axios from 'axios';
import type { Database } from '../supabase/types/database';

const API_URL = 'http://localhost:3000/api';

type Customer = Database['public']['Tables']['customers']['Row'];

async function testCustomers() {
    console.log('\nTesting customers API...\n');

    try {
        // 1. Create a customer
        console.log('1. Creating a customer');
        const customer = await axios.post<Customer>(`${API_URL}/customers`, {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            address: '123 Main St, City, Country',
            driver_license: 'DL123456',
            driver_license_expiry: '2025-12-31'
        });
        console.log('Customer created:', customer.data);

        // 2. Get all customers
        console.log('\n2. Getting all customers');
        const allCustomers = await axios.get<Customer[]>(`${API_URL}/customers`);
        console.log(`${allCustomers.data.length} customers found`);

        // 3. Update a customer
        console.log('\n3. Updating a customer');
        const updatedCustomer = await axios.put<Customer>(`${API_URL}/customers/${customer.data.id}`, {
            phone: '+0987654321'
        });
        console.log('Customer updated:', updatedCustomer.data);

        // 4. Get a customer by ID
        console.log('\n4. Getting a customer by ID');
        const getCustomer = await axios.get<Customer>(`${API_URL}/customers/${customer.data.id}`);
        console.log('Customer retrieved:', getCustomer.data);

        // 5. Delete a customer
        console.log('\n5. Deleting a customer');
        await axios.delete(`${API_URL}/customers/${customer.data.id}`);
        console.log('Customer successfully deleted');

        console.log('\nAll tests passed!');
    } catch (error: any) {
        console.error('Error during tests:', error.response?.data || error.message);
    }
}

testCustomers();
