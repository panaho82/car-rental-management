import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  TextField,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { supabase } from '../supabase/client';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  daily_rate: number;
  status: string;
  description: string;
  features: string[];
  images: string[];
}

export default function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  async function fetchVehicleDetails() {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReservation() {
    if (!startDate || !endDate || !vehicle) return;

    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([
          {
            vehicle_id: vehicle.id,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            total_price: calculateTotalPrice(),
          },
        ]);

      if (error) throw error;
      navigate('/reservations');
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  }

  function calculateTotalPrice() {
    if (!startDate || !endDate || !vehicle) return 0;
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days * vehicle.daily_rate;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!vehicle) {
    return (
      <Container>
        <Typography>Vehicle not found</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </Typography>
          <Box sx={{ mb: 4 }}>
            <img
              src={vehicle.images[0] || 'https://via.placeholder.com/800x400?text=No+Image'}
              alt={`${vehicle.brand} ${vehicle.model}`}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Box>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography paragraph>{vehicle.description}</Typography>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={2}>
            {vehicle.features.map((feature, index) => (
              <Grid item key={index}>
                <Paper sx={{ px: 2, py: 1 }}>
                  <Typography>{feature}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Book this vehicle
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                ${vehicle.daily_rate}/day
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ mb: 2 }}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    minDate={startDate || undefined}
                  />
                </Box>
              </LocalizationProvider>
              {startDate && endDate && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    Total: ${calculateTotalPrice()}
                  </Typography>
                </Box>
              )}
              <Button
                variant="contained"
                fullWidth
                onClick={handleReservation}
                disabled={!startDate || !endDate}
              >
                Reserve Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
