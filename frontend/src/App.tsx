import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Home from './pages/Home';
import VehicleList from './pages/VehicleList';
import VehicleDetails from './pages/VehicleDetails';
import Reservations from './pages/Reservations';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Reports from './pages/Reports';
import Typography from '@mui/material/Typography';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Router basename="/car-rental-management">
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <Layout>
            <Typography variant="h4" component="h1" gutterBottom>
              Car Rental Management System - Test Deploy
            </Typography>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vehicles" element={<VehicleList />} />
              <Route path="/vehicles/:id" element={<VehicleDetails />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </Layout>
        </LocalizationProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
