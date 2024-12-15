import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface VehiclePerformanceProps {
  stats: {
    totalRentals: number;
    totalRevenue: number;
    averageRentalDuration: number;
    maintenanceCosts: number;
    utilization: number;
    monthlyRevenue: Array<{ month: string; revenue: number }>;
    monthlyMaintenance: Array<{ month: string; cost: number }>;
    statusDistribution: Array<{ name: string; value: number }>;
  };
}

export const VehiclePerformance: React.FC<VehiclePerformanceProps> = ({ stats }) => {
  const theme = useTheme();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const KPICard = ({ title, value, unit }: { title: string; value: number; unit: string }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom variant="h6">
          {title}
        </Typography>
        <Typography variant="h4">
          {unit === '$' ? `${unit}${value.toLocaleString()}` : `${value}${unit}`}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Rentals"
            value={stats.totalRentals}
            unit=""
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Revenue"
            value={stats.totalRevenue}
            unit="$"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Avg. Rental Duration"
            value={stats.averageRentalDuration}
            unit=" days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Utilization Rate"
            value={stats.utilization}
            unit="%"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Revenue vs Maintenance Costs */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue vs Maintenance Costs
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={stats.monthlyRevenue.map((item, index) => ({
                    month: item.month,
                    revenue: item.revenue,
                    maintenance: stats.monthlyMaintenance[index]?.cost || 0,
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.primary.main}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="maintenance"
                    stroke={theme.palette.error.main}
                    name="Maintenance Costs"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vehicle Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VehiclePerformance;
