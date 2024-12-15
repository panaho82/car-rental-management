import { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../supabase/client';
import { Vehicle } from '../types/vehicle';

export const vehicleController = {
  // Récupérer tous les véhicules
  getAllVehicles: async (_req: Request, res: Response): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*');

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      console.error('Erreur getAllVehicles:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la récupération des véhicules' });
    }
  },

  // Récupérer un véhicule par ID
  getVehicleById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        res.status(404).json({ error: 'Véhicule non trouvé' });
        return;
      }
      res.json(data);
    } catch (error: any) {
      console.error('Erreur getVehicleById:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la récupération du véhicule' });
    }
  },

  // Créer un nouveau véhicule
  createVehicle: async (req: Request, res: Response): Promise<void> => {
    try {
      const vehicleData: Omit<Vehicle, 'id'> = req.body;
      console.log('Données du véhicule à créer:', vehicleData);

      const { data, error } = await supabaseAdmin
        .from('vehicles')
        .insert([vehicleData])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error: any) {
      console.error('Erreur createVehicle:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la création du véhicule' });
    }
  },

  // Mettre à jour un véhicule
  updateVehicle: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const vehicleData: Partial<Vehicle> = req.body;
      const { data, error } = await supabaseAdmin
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        res.status(404).json({ error: 'Véhicule non trouvé' });
        return;
      }
      res.json(data);
    } catch (error: any) {
      console.error('Erreur updateVehicle:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la mise à jour du véhicule' });
    }
  },

  // Supprimer un véhicule
  deleteVehicle: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { error } = await supabaseAdmin
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.status(204).send();
    } catch (error: any) {
      console.error('Erreur deleteVehicle:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la suppression du véhicule' });
    }
  },

  // Mettre à jour le statut d'un véhicule
  updateVehicleStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { data, error } = await supabaseAdmin
        .from('vehicles')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        res.status(404).json({ error: 'Véhicule non trouvé' });
        return;
      }
      res.json(data);
    } catch (error: any) {
      console.error('Erreur updateVehicleStatus:', error);
      res.status(500).json({ error: error.message || 'Erreur lors de la mise à jour du statut' });
    }
  }
};
