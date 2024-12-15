import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  DirectionsCar,
  AttachMoney,
  Timer,
  Build,
  Warning,
} from '@mui/icons-material';
import { VehicleStats as VehicleStatsType } from '../../types/maintenance';

interface VehicleStatsProps {
  stats: VehicleStatsType;
  loading?: boolean;
}

export const VehicleStats: React.FC<VehicleStatsProps> = ({ stats, loading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDuration = (days: number) => {
    return `${days.toFixed(1)} days`;
  };

  const calculateUtilization = (totalDaysRented: number) => {
    const daysInYear = 365;
    return (totalDaysRented / daysInYear) * 100;
  };

  const statItems = [
    {
      icon: <DirectionsCar />,
      label: 'Total Rentals',
      value: stats.total_rentals.toString(),
      color: 'primary.main',
    },
    {
      icon: <AttachMoney />,
      label: 'Total Revenue',
      value: formatCurrency(stats.total_revenue),
      color: 'success.main',
    },
    {
      icon: <Timer />,
      label: 'Average Rental Duration',
      value: formatDuration(stats.avg_rental_duration),
      color: 'info.main',
    },
    {
      icon: <Build />,
      label: 'Maintenance Costs',
      value: formatCurrency(stats.maintenance_costs),
      color: 'warning.main',
    },
    {
      icon: <Warning />,
      label: 'Damage Incidents',
      value: stats.damage_incidents.toString(),
      color: 'error.main',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Vehicle Performance Metrics
        </Typography>

        <Grid container spacing={3}>
          {/* Utilization Rate */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Vehicle Utilization Rate
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateUtilization(stats.total_days_rented)}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                {calculateUtilization(stats.total_days_rented).toFixed(1)}% of the year
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Key Metrics */}
          {statItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
