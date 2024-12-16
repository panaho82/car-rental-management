import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

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
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenUserDialog = (user?: any) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setSelectedUser(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Paramètres
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Général" />
              <Tab label="Utilisateurs" />
              <Tab label="Notifications" />
              <Tab label="Sécurité" />
            </Tabs>

            {/* Paramètres généraux */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom de l'entreprise"
                    defaultValue="Car Rental Management"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email de contact"
                    type="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adresse"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Devise"
                    defaultValue="EUR"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fuseau horaire"
                    defaultValue="Europe/Paris"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                  >
                    Enregistrer les modifications
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Gestion des utilisateurs */}
            <TabPanel value={tabValue} index={1}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenUserDialog()}
                sx={{ mb: 2 }}
              >
                Ajouter un utilisateur
              </Button>
              <List>
                <ListItem>
                  <ListItemText
                    primary="John Doe"
                    secondary="Administrateur - john@example.com"
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleOpenUserDialog({ name: 'John Doe' })}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </TabPanel>

            {/* Paramètres de notification */}
            <TabPanel value={tabValue} index={2}>
              <List>
                <ListItem>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Notifications par email"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Notifications de réservation"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    control={<Switch />}
                    label="Notifications de maintenance"
                  />
                </ListItem>
                <ListItem>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Rappels automatiques"
                  />
                </ListItem>
              </List>
            </TabPanel>

            {/* Paramètres de sécurité */}
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Politique de mot de passe
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Exiger des caractères spéciaux"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Longueur minimale de 8 caractères"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Expiration après 90 jours"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Authentification à deux facteurs
                  </Typography>
                  <FormControlLabel
                    control={<Switch />}
                    label="Activer pour tous les utilisateurs"
                  />
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogue d'ajout/modification d'utilisateur */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog}>
        <DialogTitle>
          {selectedUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom complet"
                defaultValue={selectedUser?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rôle"
                select
                defaultValue="user"
              >
                <option value="admin">Administrateur</option>
                <option value="manager">Manager</option>
                <option value="user">Utilisateur</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Annuler</Button>
          <Button onClick={handleCloseUserDialog} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
