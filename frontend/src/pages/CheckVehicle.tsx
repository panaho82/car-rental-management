import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  PhotoCamera,
  ArrowBack,
  ArrowForward,
  Check,
} from '@mui/icons-material';

const steps = ['Informations', 'État extérieur', 'État intérieur', 'Photos', 'Validation'];

interface DamageReport {
  location: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe';
}

export default function CheckVehicle() {
  const [activeStep, setActiveStep] = useState(0);
  const [checkType, setCheckType] = useState<'departure' | 'return'>('departure');
  const [vehicleId, setVehicleId] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelLevel, setFuelLevel] = useState('');
  const [damages, setDamages] = useState<DamageReport[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleAddDamage = () => {
    setDamages([
      ...damages,
      { location: '', description: '', severity: 'minor' },
    ]);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPhotos([...photos, ...Array.from(event.target.files)]);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type de contrôle</InputLabel>
                <Select
                  value={checkType}
                  onChange={(e) => setCheckType(e.target.value as 'departure' | 'return')}
                >
                  <MenuItem value="departure">Départ</MenuItem>
                  <MenuItem value="return">Retour</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID du véhicule"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kilométrage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Niveau de carburant"
                value={fuelLevel}
                onChange={(e) => setFuelLevel(e.target.value)}
              />
            </Grid>
          </Grid>
        );

      case 1:
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button variant="outlined" onClick={handleAddDamage}>
                Ajouter un dommage
              </Button>
            </Grid>
            {damages.map((damage, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Emplacement"
                          value={damage.location}
                          onChange={(e) => {
                            const newDamages = [...damages];
                            newDamages[index].location = e.target.value;
                            setDamages(newDamages);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Description"
                          value={damage.description}
                          onChange={(e) => {
                            const newDamages = [...damages];
                            newDamages[index].description = e.target.value;
                            setDamages(newDamages);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Sévérité</InputLabel>
                          <Select
                            value={damage.severity}
                            onChange={(e) => {
                              const newDamages = [...damages];
                              newDamages[index].severity = e.target.value as 'minor' | 'moderate' | 'severe';
                              setDamages(newDamages);
                            }}
                          >
                            <MenuItem value="minor">Mineur</MenuItem>
                            <MenuItem value="moderate">Modéré</MenuItem>
                            <MenuItem value="severe">Sévère</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                multiple
                type="file"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Ajouter des photos
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {photos.map((photo, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Résumé du contrôle</Typography>
              <Typography>Type: {checkType === 'departure' ? 'Départ' : 'Retour'}</Typography>
              <Typography>Véhicule ID: {vehicleId}</Typography>
              <Typography>Kilométrage: {mileage}</Typography>
              <Typography>Niveau de carburant: {fuelLevel}</Typography>
              <Typography>Nombre de dommages: {damages.length}</Typography>
              <Typography>Nombre de photos: {photos.length}</Typography>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Contrôle du véhicule
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              sx={{ mr: 1 }}
              startIcon={<ArrowBack />}
            >
              Précédent
            </Button>
          )}
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? undefined : handleNext}
            endIcon={activeStep === steps.length - 1 ? <Check /> : <ArrowForward />}
          >
            {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
