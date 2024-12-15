import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import carImage from '../assets/car-hero.jpg';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              component="h1"
              variant="h2"
              color="text.primary"
              gutterBottom
            >
              Find Your Perfect Ride
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Choose from our wide selection of vehicles. Whether you need a
              compact car for city driving or an SUV for a family trip, we've
              got you covered.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/vehicles')}
                sx={{ mr: 2 }}
              >
                Browse Vehicles
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/reservations')}
              >
                My Reservations
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={carImage}
              alt="Luxury car"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                Wide Selection
              </Typography>
              <Typography color="text.secondary">
                Choose from our diverse fleet of vehicles, from economy to luxury.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                Easy Booking
              </Typography>
              <Typography color="text.secondary">
                Simple online reservation process. Book your car in minutes.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                24/7 Support
              </Typography>
              <Typography color="text.secondary">
                Our customer service team is always here to help you.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
