import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { supabase } from '../supabase/client';

interface Reservation {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  vehicle: {
    brand: string;
    model: string;
    year: number;
  };
}

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          vehicle:vehicles(brand, model, year)
        `)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelReservation(id: string) {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
      fetchReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Reservations
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  {reservation.vehicle.brand} {reservation.vehicle.model} (
                  {reservation.vehicle.year})
                </TableCell>
                <TableCell>
                  {format(new Date(reservation.start_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(reservation.end_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>${reservation.total_price}</TableCell>
                <TableCell>
                  <Typography
                    color={
                      reservation.status === 'active'
                        ? 'primary'
                        : reservation.status === 'cancelled'
                        ? 'error'
                        : 'text.secondary'
                    }
                  >
                    {reservation.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  {reservation.status === 'active' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
