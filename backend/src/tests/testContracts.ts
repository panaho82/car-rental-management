import axios from 'axios';
import type { Database } from '../supabase/types/database';

const API_URL = 'http://localhost:3000/api';

type Reservation = Database['public']['Tables']['reservations']['Row'];
type RentalContract = Database['public']['Tables']['rental_contracts']['Row'];

async function testContracts() {
    console.log('\nTest de l\'API des contrats...\n');

    try {
        // 0. Récupérer une réservation confirmée
        console.log('0. Récupération des données de test');
        const reservations = await axios.get<Reservation[]>(`${API_URL}/reservations`);
        const confirmedReservation = reservations.data.find((r) => r.status === 'confirmed');

        if (!confirmedReservation) {
            throw new Error('Veuillez d\'abord créer et confirmer une réservation');
        }

        // 1. Création d'un contrat
        console.log('\n1. Création d\'un contrat');
        const contract = await axios.post<RentalContract>(`${API_URL}/contracts`, {
            reservation_id: confirmedReservation.id,
            initial_mileage: 50000,
            insurance_details: {
                type: 'full',
                coverage: 'all-risk',
                deductible: 500
            }
        });
        console.log('Contrat créé:', contract.data);

        // 2. Récupération de tous les contrats
        console.log('\n2. Récupération de tous les contrats');
        const allContracts = await axios.get<RentalContract[]>(`${API_URL}/contracts`);
        console.log(`${allContracts.data.length} contrats trouvés`);

        // 3. Signature du contrat
        console.log('\n3. Signature du contrat');
        const signedContract = await axios.post<RentalContract>(`${API_URL}/contracts/${contract.data.id}/sign`);
        console.log('Contrat signé:', signedContract.data);

        // 4. Mise à jour du contrat (retour du véhicule)
        console.log('\n4. Mise à jour du contrat (retour du véhicule)');
        const updatedContract = await axios.put<RentalContract>(`${API_URL}/contracts/${contract.data.id}`, {
            final_mileage: 50300,
            damage_notes: 'Aucun dommage constaté',
            additional_charges: 0
        });
        console.log('Contrat mis à jour:', updatedContract.data);

        console.log('\nTous les tests ont réussi !');
    } catch (error: any) {
        console.error('Erreur lors des tests:', error.response?.data || error.message);
    }
}

testContracts();
