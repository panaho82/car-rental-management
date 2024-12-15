import express from 'express';
import { supabaseAdmin } from '../supabase/client';
import type { Database } from '../supabase/types/database';

const router = express.Router();

// Créer une nouvelle réservation
router.post('/', async (req, res) => {
    try {
        const {
            customer_id,
            vehicle_id,
            start_date,
            end_date,
            total_price
        } = req.body;

        // Vérifier la disponibilité du véhicule
        const { data: existingReservations, error: checkError } = await supabaseAdmin
            .from('reservations')
            .select('*')
            .eq('vehicle_id', vehicle_id)
            .eq('status', 'confirmed')
            .or(`start_date.lte.${end_date},end_date.gte.${start_date}`);

        if (checkError) throw checkError;

        if (existingReservations && existingReservations.length > 0) {
            return res.status(400).json({ error: 'Le véhicule n\'est pas disponible pour ces dates' });
        }

        // Créer la réservation
        const { data, error } = await supabaseAdmin
            .from('reservations')
            .insert({
                customer_id,
                vehicle_id,
                start_date,
                end_date,
                status: 'pending',
                total_price,
                payment_status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Récupérer toutes les réservations
router.get('/', async (_req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('reservations')
            .select(`
                *,
                customer:customers(*),
                vehicle:vehicles(*)
            `);

        if (error) throw error;

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Récupérer une réservation par ID
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('reservations')
            .select(`
                *,
                customer:customers(*),
                vehicle:vehicles(*)
            `)
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Mettre à jour une réservation
router.put('/:id', async (req, res) => {
    try {
        const {
            start_date,
            end_date,
            status,
            total_price,
            payment_status,
            notes
        } = req.body;

        const { data, error } = await supabaseAdmin
            .from('reservations')
            .update({
                start_date,
                end_date,
                status,
                total_price,
                payment_status,
                notes
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Annuler une réservation
router.post('/:id/cancel', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('reservations')
            .update({
                status: 'cancelled'
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Confirmer une réservation
router.post('/:id/confirm', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('reservations')
            .update({
                status: 'confirmed'
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Réservation non trouvée' });
        }

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
