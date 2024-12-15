import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const departmentData = [
    { name: 'SUV', active: 6, total: 8 },
    { name: 'Sedan', active: 4, total: 6 },
    { name: 'Sports', active: 3, total: 4 },
    { name: 'Electric', active: 2, total: 3 },
    { name: 'Luxury', active: 5, total: 6 },
    { name: 'Van', active: 3, total: 4 },
  ];

  const announcements = [
    {
      id: 1,
      title: 'New vehicle maintenance schedule',
      date: 'Monday, December 18, 2023',
      timeAgo: '5 minutes ago',
    },
    {
      id: 2,
      title: 'Customer satisfaction survey results',
      date: 'Monday, December 18, 2023',
      timeAgo: '5 minutes ago',
    },
    {
      id: 3,
      title: 'Holiday season special rates',
      date: 'Monday, December 18, 2023',
      timeAgo: '5 minutes ago',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Vehicle inspection completed',
      description: 'SUV #1234 passed all safety checks',
      time: '10:40 AM',
      date: 'Fri, Sept. 10, 2023',
    },
    {
      id: 2,
      title: 'New reservation confirmed',
      description: 'Customer #5678 booked Sedan for next week',
      time: '10:40 AM',
      date: 'Fri, Sept. 10, 2023',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#F8FAFC', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton>
              <Badge badgeContent={4} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar alt="User Name" src="/avatar.jpg" />
              <Typography variant="subtitle1">Admin User</Typography>
            </Box>
          </Box>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography color="text.secondary">Fleet utilization rate</Typography>
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  85%
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                  <ArrowUpwardIcon fontSize="small" />
                  <Typography variant="body2">vs. Previous month</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography color="text.secondary">Revenue this month</Typography>
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  $45,432
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                  <ArrowUpwardIcon fontSize="small" />
                  <Typography variant="body2">vs. Previous month</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography color="text.secondary">Maintenance costs</Typography>
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  $12,845
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                  <ArrowDownwardIcon fontSize="small" />
                  <Typography variant="body2">vs. Previous month</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Vehicles by category
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="total" fill="#E3F2FD" />
                    <Bar dataKey="active" fill="#2196F3" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quality metrics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      98%
                    </Typography>
                    <Typography color="text.secondary">Customer satisfaction</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      95%
                    </Typography>
                    <Typography color="text.secondary">On-time delivery</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      92%
                    </Typography>
                    <Typography color="text.secondary">Vehicle cleanliness</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Announcements</Typography>
                <Typography variant="body2" color="primary">
                  Today, Dec. 12.2023
                </Typography>
              </Box>

              <Box>
                {announcements.map((announcement) => (
                  <Box
                    key={announcement.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {announcement.timeAgo}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {announcement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {announcement.date}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button color="primary" sx={{ width: '100%' }}>
                See all announcements
              </Button>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent activity
              </Typography>

              <Box>
                {recentActivity.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block">
                      {activity.time} {activity.date}
                    </Typography>
                    <Typography variant="subtitle1">{activity.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2">Today you've completed 12 tasks</Typography>
                <Button size="small">See all tasks</Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
