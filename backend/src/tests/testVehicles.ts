import axios from 'axios';
import { Vehicle, VehicleStatus, VehicleCategory } from '../types/vehicle';

const API_URL = 'http://localhost:3000/api';

const testVehicles: Omit<Vehicle, 'id'>[] = [
  {
    brand: 'Renault',
    model: 'Clio',
    year: 2023,
    registration: 'AA-123-BB',
    mileage: 15000,
    status: VehicleStatus.AVAILABLE,
    category: VehicleCategory.ECONOMY,
    daily_rate: 45.00,
    features: ['Climatisation', 'Bluetooth', 'GPS'],
    images: []
  },
  {
    brand: 'Peugeot',
    model: '3008',
    year: 2022,
    registration: 'CC-456-DD',
    mileage: 25000,
    status: VehicleStatus.AVAILABLE,
    category: VehicleCategory.SUV,
    daily_rate: 75.00,
    features: ['Climatisation', 'Bluetooth', 'GPS', 'Caméra de recul', 'Toit panoramique'],
    images: []
  },
  {
    brand: 'Mercedes',
    model: 'Classe C',
    year: 2023,
    registration: 'EE-789-FF',
    mileage: 10000,
    status: VehicleStatus.AVAILABLE,
    category: VehicleCategory.LUXURY,
    daily_rate: 120.00,
    features: ['Climatisation', 'Bluetooth', 'GPS', 'Sièges chauffants', 'Toit ouvrant', 'Sound system premium'],
    images: []
  }
];

async function testAPI() {
  try {
    console.log('Test de l\'API des véhicules...');

    // Test 1: Création des véhicules
    console.log('\n1. Création des véhicules de test');
    for (const vehicle of testVehicles) {
      const response = await axios.post<Vehicle>(`${API_URL}/vehicles`, vehicle);
      console.log(`Véhicule créé: ${response.data.brand} ${response.data.model}`);
    }

    // Test 2: Récupération de tous les véhicules
    console.log('\n2. Récupération de tous les véhicules');
    const getAllResponse = await axios.get<Vehicle[]>(`${API_URL}/vehicles`);
    console.log(`${getAllResponse.data.length} véhicules trouvés`);

    // Test 3: Mise à jour du premier véhicule
    const firstVehicle = getAllResponse.data[0];
    console.log('\n3. Mise à jour du premier véhicule');
    const updateResponse = await axios.put<Vehicle>(`${API_URL}/vehicles/${firstVehicle.id}`, {
      mileage: firstVehicle.mileage + 1000,
      status: VehicleStatus.MAINTENANCE
    });
    console.log('Véhicule mis à jour:', updateResponse.data);

    // Test 4: Récupération d'un véhicule par ID
    console.log('\n4. Récupération d\'un véhicule par ID');
    const getByIdResponse = await axios.get<Vehicle>(`${API_URL}/vehicles/${firstVehicle.id}`);
    console.log('Véhicule récupéré:', getByIdResponse.data);

    console.log('\nTous les tests ont réussi !');
  } catch (error: any) {
    console.error('Erreur lors des tests:', error.response?.data || error.message);
  }
}

testAPI();
