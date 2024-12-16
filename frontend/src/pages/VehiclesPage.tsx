import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Button,
  Typography,
  Container,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { VehicleList } from '../components/vehicles/VehicleList';
import { VehicleForm } from '../components/vehicles/VehicleForm';
import { vehicleService } from '../services/vehicleService';
import { Vehicle } from '../types/vehicle';

export default function VehiclesPage() {
  const [openForm, setOpenForm] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | undefined>();
  const [alert, setAlert] = React.useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  const queryClient = useQueryClient();

  // Mutations
  const createMutation = useMutation(vehicleService.createVehicle, {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
      setAlert({ message: 'Véhicule ajouté avec succès', type: 'success' });
      handleCloseForm();
    },
    onError: () => {
      setAlert({ message: 'Erreur lors de l\'ajout du véhicule', type: 'error' });
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Vehicle> }) =>
      vehicleService.updateVehicle(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('vehicles');
        setAlert({ message: 'Véhicule mis à jour avec succès', type: 'success' });
        handleCloseForm();
      },
      onError: () => {
        setAlert({ message: 'Erreur lors de la mise à jour du véhicule', type: 'error' });
      },
    }
  );

  const deleteMutation = useMutation(vehicleService.deleteVehicle, {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
      setAlert({ message: 'Véhicule supprimé avec succès', type: 'success' });
    },
    onError: () => {
      setAlert({ message: 'Erreur lors de la suppression du véhicule', type: 'error' });
    },
  });

  const handleOpenForm = () => {
    setSelectedVehicle(undefined);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedVehicle(undefined);
    setOpenForm(false);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenForm(true);
  };

  const handleDelete = async (vehicleId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      deleteMutation.mutate(vehicleId);
    }
  };

  const handleSubmit = async (vehicleData: Partial<Vehicle>) => {
    if (selectedVehicle) {
      updateMutation.mutate({ id: selectedVehicle.id, data: vehicleData });
    } else {
      createMutation.mutate(vehicleData as Omit<Vehicle, 'id'>);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            Gestion des Véhicules
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Ajouter un véhicule
          </Button>
        </Box>

        <VehicleList onEdit={handleEdit} onDelete={handleDelete} />

        <VehicleForm
          open={openForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          vehicle={selectedVehicle}
        />

        <Snackbar
          open={!!alert}
          autoHideDuration={6000}
          onClose={() => setAlert(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          {alert && (
            <Alert onClose={() => setAlert(null)} severity={alert.type}>
              {alert.message}
            </Alert>
          )}
        </Snackbar>
      </Box>
    </Container>
  );
};
