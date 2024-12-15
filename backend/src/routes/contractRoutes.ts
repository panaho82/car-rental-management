import express from 'express';
import { supabaseAdmin } from '../supabase/client';
import type { Database } from '../supabase/types/database';

const router = express.Router();

// Générer un numéro de contrat unique
const generateContractNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CTR-${year}${month}-${random}`;
};

// Créer un nouveau contrat
router.post('/', async (req, res) => {
    try {
        const {
            reservation_id,
            initial_mileage,
            insurance_details
        } = req.body;

        // Vérifier que la réservation existe et est confirmée
        const { data: reservation, error: reservationError } = await supabaseAdmin
            .from('reservations')
            .select('*')
            .eq('id', reservation_id)
            .single();

        if (reservationError) throw reservationError;
        if (!reservation) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }
        if (reservation.status !== 'confirmed') {
            return res.status(400).json({ error: 'La réservation doit être confirmée avant de créer un contrat' });
        }

        // Créer le contrat
        const { data, error } = await supabaseAdmin
            .from('rental_contracts')
            .insert({
                reservation_id,
                contract_number: generateContractNumber(),
                initial_mileage,
                insurance_details,
                terms_accepted: false
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Récupérer tous les contrats
router.get('/', async (_req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('rental_contracts')
            .select(`
                *,
                reservation:reservations(
                    *,
                    customer:customers(*),
                    vehicle:vehicles(*)
                )
            `);

        if (error) throw error;

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Récupérer un contrat par ID
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('rental_contracts')
            .select(`
                *,
                reservation:reservations(
                    *,
                    customer:customers(*),
                    vehicle:vehicles(*)
                )
            `)
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Contrat non trouvé' });
        }

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Mettre à jour un contrat
router.put('/:id', async (req, res) => {
    try {
        const {
            final_mileage,
            damage_notes,
            additional_charges,
            insurance_details
        } = req.body;

        const { data, error } = await supabaseAdmin
            .from('rental_contracts')
            .update({
                final_mileage,
                damage_notes,
                additional_charges,
                insurance_details
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Contrat non trouvé' });
        }

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Signer un contrat
router.post('/:id/sign', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('rental_contracts')
            .update({
                signed_at: new Date().toISOString(),
                terms_accepted: true
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Contrat non trouvé' });
        }

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
