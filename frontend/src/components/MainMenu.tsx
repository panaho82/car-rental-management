import { useNavigate, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  CalendarToday,
  DirectionsCar,
  People,
  Dashboard,
  CheckCircle,
  Settings,
  BookOnline,
} from '@mui/icons-material';

export default function MainMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Réservations', icon: <BookOnline />, path: '/reservations' },
    { text: 'Calendrier', icon: <CalendarToday />, path: '/calendar' },
    { text: 'Véhicules', icon: <DirectionsCar />, path: '/vehicles' },
    { text: 'Clients', icon: <People />, path: '/customers' },
    { text: 'Check Véhicule', icon: <CheckCircle />, path: '/vehicle-check' },
    { text: 'Paramètres', icon: <Settings />, path: '/settings' },
  ];

  return (
    <>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              borderRadius: 1,
              m: 0.5,
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? 'white' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  );
}
