import axios from 'axios';
import { Vehicle, VehicleStatus } from '../../../backend/src/types/vehicle';

const API_URL = 'http://localhost:3000/api';

export const vehicleService = {
  // Récupérer tous les véhicules
  async getAllVehicles() {
    const response = await axios.get<Vehicle[]>(`${API_URL}/vehicles`);
    return response.data;
  },

  // Récupérer un véhicule par ID
  async getVehicleById(id: string) {
    const response = await axios.get<Vehicle>(`${API_URL}/vehicles/${id}`);
    return response.data;
  },

  // Créer un nouveau véhicule
  async createVehicle(vehicleData: Omit<Vehicle, 'id'>) {
    const response = await axios.post<Vehicle>(`${API_URL}/vehicles`, vehicleData);
    return response.data;
  },

  // Mettre à jour un véhicule
  async updateVehicle(id: string, vehicleData: Partial<Vehicle>) {
    const response = await axios.put<Vehicle>(`${API_URL}/vehicles/${id}`, vehicleData);
    return response.data;
  },

  // Supprimer un véhicule
  async deleteVehicle(id: string) {
    await axios.delete(`${API_URL}/vehicles/${id}`);
  },

  // Mettre à jour le statut d'un véhicule
  async updateVehicleStatus(id: string, status: VehicleStatus) {
    const response = await axios.patch<Vehicle>(`${API_URL}/vehicles/${id}/status`, { status });
    return response.data;
  }
};
