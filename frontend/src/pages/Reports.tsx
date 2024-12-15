import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  DownloadOutlined,
  FilterList,
  Refresh,
  PictureAsPdf,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { maintenanceService } from '../services/maintenanceService';
import { VehicleStats } from '../components/stats/VehicleStats';
import { CustomerStats } from '../components/stats/CustomerStats';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const Reports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<any[]>([]);
  const [damageReports, setDamageReports] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [vehicleStats, setVehicleStats] = useState<any>(null);
  const [customerStats, setCustomerStats] = useState<any>(null);

  const supabase = useSupabaseClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch vehicles
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select('*');
      setVehicles(vehiclesData || []);

      // Fetch maintenance records
      if (selectedVehicle) {
        const records = await maintenanceService.getMaintenanceRecords(selectedVehicle);
        setMaintenanceRecords(records);

        // Fetch vehicle stats
        const stats = await maintenanceService.getVehicleStats(selectedVehicle);
        setVehicleStats(stats);
      }

      // Fetch damage reports
      const reports = await maintenanceService.getDamageReports(selectedVehicle);
      setDamageReports(reports);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToPDF = () => {
    // Implement PDF export functionality
    console.log('Exporting to PDF...');
  };

  const exportToExcel = () => {
    // Implement Excel export functionality
    console.log('Exporting to Excel...');
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Reports & Analytics
        </Typography>
        
        <Paper sx={{ mt: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="reports tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Overview" />
            <Tab label="Maintenance Records" />
            <Tab label="Damage Reports" />
            <Tab label="Vehicle Analytics" />
            <Tab label="Customer Analytics" />
          </Tabs>

          {/* Filters */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  fullWidth
                  label="Select Vehicle"
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                >
                  <MenuItem value="">All Vehicles</MenuItem>
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} ({vehicle.registration})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={fetchData}
                  >
                    Apply Filters
                  </Button>
                  <IconButton onClick={fetchData}>
                    <Refresh />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* Summary Cards */}
              <Grid item xs={12} md={6} lg={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Vehicles
                    </Typography>
                    <Typography variant="h4">
                      {vehicles.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Active Maintenance
                    </Typography>
                    <Typography variant="h4">
                      {maintenanceRecords.filter(r => r.status === 'in_progress').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Pending Repairs
                    </Typography>
                    <Typography variant="h4">
                      {damageReports.filter(r => r.repair_status === 'pending').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Maintenance Cost
                    </Typography>
                    <Typography variant="h4">
                      ${maintenanceRecords.reduce((sum, record) => sum + (record.cost || 0), 0).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Export Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<PictureAsPdf />}
                    onClick={exportToPDF}
                  >
                    Export as PDF
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadOutlined />}
                    onClick={exportToExcel}
                  >
                    Export as Excel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Maintenance Records Tab */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Performed By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceRecords
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.scheduled_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {vehicles.find(v => v.id === record.vehicle_id)?.registration}
                        </TableCell>
                        <TableCell>{record.maintenance_type}</TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell>${record.cost || 0}</TableCell>
                        <TableCell>{record.performed_by}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={maintenanceRecords.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </TabPanel>

          {/* Damage Reports Tab */}
          <TabPanel value={tabValue} index={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Repair Status</TableCell>
                    <TableCell>Estimate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {damageReports
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{new Date(report.report_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {vehicles.find(v => v.id === report.vehicle_id)?.registration}
                        </TableCell>
                        <TableCell>{report.damage_severity}</TableCell>
                        <TableCell>{report.damage_description}</TableCell>
                        <TableCell>{report.repair_status}</TableCell>
                        <TableCell>${report.repair_estimate || 0}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={damageReports.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </TabPanel>

          {/* Vehicle Analytics Tab */}
          <TabPanel value={tabValue} index={3}>
            {vehicleStats && <VehicleStats stats={vehicleStats} loading={loading} />}
          </TabPanel>

          {/* Customer Analytics Tab */}
          <TabPanel value={tabValue} index={4}>
            {customerStats && <CustomerStats stats={customerStats} loading={loading} />}
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};
