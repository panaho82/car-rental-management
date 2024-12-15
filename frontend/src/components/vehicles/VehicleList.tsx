import React from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
} from '@mui/icons-material';
import { vehicleService } from '../../services/vehicleService';
import { Vehicle, VehicleStatus } from '../../../../backend/src/types/vehicle';

const statusColors = {
  [VehicleStatus.AVAILABLE]: 'success',
  [VehicleStatus.RESERVED]: 'warning',
  [VehicleStatus.MAINTENANCE]: 'info',
  [VehicleStatus.OUT_OF_SERVICE]: 'error',
};

interface VehicleListProps {
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
}

export const VehicleList: React.FC<VehicleListProps> = ({ onEdit, onDelete }) => {
  const { data: vehicles, isLoading, error } = useQuery('vehicles', vehicleService.getAllVehicles);

  if (isLoading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography color="error">Erreur lors du chargement des véhicules</Typography>;

  return (
    <Box>
      <Grid container spacing={3}>
        {vehicles?.map((vehicle) => (
          <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    {vehicle.brand} {vehicle.model}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => onEdit(vehicle)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDelete(vehicle.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography color="textSecondary" gutterBottom>
                  Immatriculation: {vehicle.registration}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Année: {vehicle.year}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Kilométrage: {vehicle.mileage} km
                </Typography>

                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={vehicle.status}
                    color={statusColors[vehicle.status] as any}
                    size="small"
                  />
                  <Typography variant="h6" color="primary">
                    {vehicle.dailyRate}€/jour
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
