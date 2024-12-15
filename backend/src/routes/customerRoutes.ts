import express from 'express';
import { supabaseAdmin } from '../supabase/client';
import type { Database } from '../supabase/types/database';

const router = express.Router();

// Créer un nouveau client
router.post('/', async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            address,
            driver_license,
            driver_license_expiry
        } = req.body;

        const { data, error } = await supabaseAdmin
            .from('customers')
            .insert({
                first_name,
                last_name,
                email,
                phone,
                address,
                driver_license,
                driver_license_expiry
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Récupérer tous les clients
router.get('/', async (_req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('customers')
            .select('*');

        if (error) throw error;

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Récupérer un client par ID
router.get('/:id', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('customers')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Mettre à jour un client
router.put('/:id', async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            address,
            driver_license,
            driver_license_expiry
        } = req.body;

        const { data, error } = await supabaseAdmin
            .from('customers')
            .update({
                first_name,
                last_name,
                email,
                phone,
                address,
                driver_license,
                driver_license_expiry
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }

        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Supprimer un client
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabaseAdmin
            .from('customers')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
