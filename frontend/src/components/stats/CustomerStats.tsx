import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Rating,
  Chip,
  Divider,
} from '@mui/material';
import {
  TimelineOutlined,
  AttachMoney,
  Cancel,
  Warning,
  Star,
} from '@mui/icons-material';
import { CustomerStats as CustomerStatsType } from '../../types/maintenance';

interface CustomerStatsProps {
  stats: CustomerStatsType;
  loading?: boolean;
}

export const CustomerStats: React.FC<CustomerStatsProps> = ({ stats, loading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateCustomerRating = () => {
    let rating = 5;
    
    // Deduct points for cancellations
    if (stats.cancelled_reservations > 0) {
      rating -= Math.min(stats.cancelled_reservations * 0.5, 2);
    }

    // Deduct points for damage incidents
    if (stats.damage_incidents > 0) {
      rating -= Math.min(stats.damage_incidents * 1, 2);
    }

    // Bonus points for loyalty (number of rentals)
    if (stats.total_rentals > 10) {
      rating = Math.min(rating + 0.5, 5);
    }

    return Math.max(rating, 1);
  };

  const getCustomerStatus = () => {
    const spent = stats.total_spent;
    if (spent >= 10000) return { label: 'Platinum', color: 'primary' };
    if (spent >= 5000) return { label: 'Gold', color: 'warning' };
    if (spent >= 2000) return { label: 'Silver', color: 'secondary' };
    return { label: 'Bronze', color: 'default' };
  };

  const customerStatus = getCustomerStatus();
  const customerRating = calculateCustomerRating();

  const statItems = [
    {
      icon: <TimelineOutlined />,
      label: 'Total Rentals',
      value: stats.total_rentals.toString(),
      color: 'primary.main',
    },
    {
      icon: <AttachMoney />,
      label: 'Total Spent',
      value: formatCurrency(stats.total_spent),
      color: 'success.main',
    },
    {
      icon: <Cancel />,
      label: 'Cancellations',
      value: stats.cancelled_reservations.toString(),
      color: 'error.main',
    },
    {
      icon: <Warning />,
      label: 'Damage Incidents',
      value: stats.damage_incidents.toString(),
      color: 'warning.main',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography>Loading customer statistics...</Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Customer Profile
          </Typography>
          <Chip
            label={customerStatus.label}
            color={customerStatus.color as any}
            size="small"
          />
        </Box>

        <Grid container spacing={3}>
          {/* Customer Rating */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Star sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="subtitle2" color="textSecondary">
                Customer Rating
              </Typography>
            </Box>
            <Rating
              value={customerRating}
              precision={0.5}
              readOnly
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="textSecondary">
              Based on rental history, reliability, and care for vehicles
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Key Metrics */}
          {statItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: `${item.color}15`,
                    color: item.color,
                    mr: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h6">
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}

          {/* Average Rental Duration */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Average Rental Duration
              </Typography>
              <Typography variant="h6">
                {stats.avg_rental_duration.toFixed(1)} days
              </Typography>
            </Box>
          </Grid>

          {/* Last Rental */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Last Rental
              </Typography>
              <Typography variant="h6">
                {stats.last_rental_date
                  ? new Date(stats.last_rental_date).toLocaleDateString()
                  : 'No rentals yet'}
              </Typography>
            </Box>
          </Grid>

          {/* Last Update */}
          <Grid item xs={12}>
            <Typography variant="caption" color="textSecondary">
              Last updated: {new Date(stats.last_calculated_at).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
