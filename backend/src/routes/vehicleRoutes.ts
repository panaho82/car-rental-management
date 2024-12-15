import express, { Router } from 'express';
import { vehicleController } from '../controllers/vehicleController';

const router: Router = express.Router();

// Routes pour les véhicules
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', vehicleController.createVehicle);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);
router.patch('/:id/status', vehicleController.updateVehicleStatus);

export default router;
