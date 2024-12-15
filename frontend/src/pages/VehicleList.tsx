import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  daily_rate: number;
  status: string;
  images: string[];
}

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    try {
      let query = supabase.from('vehicles').select('*');

      if (category) {
        query = query.eq('category', category);
      }

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        query = query
          .gte('daily_rate', min)
          .lte('daily_rate', max);
      }

      const { data, error } = await query;

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value);
    fetchVehicles();
  };

  const handlePriceRangeChange = (event: any) => {
    setPriceRange(event.target.value);
    fetchVehicles();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Vehicles
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="compact">Compact</MenuItem>
                <MenuItem value="sedan">Sedan</MenuItem>
                <MenuItem value="suv">SUV</MenuItem>
                <MenuItem value="luxury">Luxury</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={priceRange}
                label="Price Range"
                onChange={handlePriceRangeChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="0-50">$0 - $50</MenuItem>
                <MenuItem value="51-100">$51 - $100</MenuItem>
                <MenuItem value="101-200">$101 - $200</MenuItem>
                <MenuItem value="201-500">$201+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {vehicles.map((vehicle) => (
          <Grid item key={vehicle.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={vehicle.images[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
                alt={`${vehicle.brand} ${vehicle.model}`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {vehicle.brand} {vehicle.model}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Year: {vehicle.year}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {vehicle.category}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ${vehicle.daily_rate}/day
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
