import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Rating,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import SignatureCanvas from 'react-signature-canvas';
import { VehicleInspection } from '../../types/maintenance';
import { maintenanceService } from '../../services/maintenanceService';

interface VehicleInspectionFormProps {
  reservationId: string;
  type: 'check_in' | 'check_out';
  onSubmit: (inspection: VehicleInspection) => void;
  onCancel: () => void;
  initialData?: Partial<VehicleInspection>;
}

const conditionAreas = {
  exterior: [
    'Front Bumper',
    'Rear Bumper',
    'Hood',
    'Trunk',
    'Left Front Door',
    'Right Front Door',
    'Left Rear Door',
    'Right Rear Door',
    'Roof',
    'Windows',
    'Lights',
    'Wheels',
  ],
  interior: [
    'Dashboard',
    'Steering Wheel',
    'Seats',
    'Floor Mats',
    'Controls',
    'Air Conditioning',
    'Radio/Entertainment',
    'Trunk Space',
  ],
};

export const VehicleInspectionForm: React.FC<VehicleInspectionFormProps> = ({
  reservationId,
  type,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<VehicleInspection>>({
    reservation_id: reservationId,
    type,
    inspection_date: new Date().toISOString(),
    mileage: 0,
    fuel_level: 100,
    exterior_condition: {},
    interior_condition: {},
    ...initialData,
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [signaturePad, setSignaturePad] = useState<any>(null);

  const handleChange = (field: keyof VehicleInspection, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConditionChange = (
    area: 'exterior' | 'interior',
    item: string,
    field: 'condition' | 'notes',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [`${area}_condition`]: {
        ...(prev[`${area}_condition`] || {}),
        [item]: {
          ...(prev[`${area}_condition`]?.[item] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPhotos(prev => [...prev, ...Array.from(event.target.files || [])]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload photos
      const photoUrls = await maintenanceService.uploadFiles(
        photos,
        `inspections/${reservationId}/${type}`
      );

      // Get signature as data URL
      const signatureUrl = signaturePad
        ? signaturePad.getTrimmedCanvas().toDataURL('image/png')
        : null;

      // Create inspection data
      const inspectionData = {
        ...formData,
        photos: photoUrls,
        customer_signature: signatureUrl,
      } as Omit<VehicleInspection, 'id' | 'created_at' | 'updated_at'>;

      const result = await maintenanceService.createVehicleInspection(inspectionData);
      onSubmit(result);
    } catch (error) {
      console.error('Error creating inspection:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {type === 'check_in' ? 'Vehicle Check-In Inspection' : 'Vehicle Check-Out Inspection'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mileage"
              type="number"
              required
              value={formData.mileage || ''}
              onChange={(e) => handleChange('mileage', parseInt(e.target.value))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fuel Level (%)"
              type="number"
              required
              value={formData.fuel_level || ''}
              onChange={(e) => handleChange('fuel_level', parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
          </Grid>

          {/* Exterior Condition */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Exterior Condition
            </Typography>
            <Grid container spacing={2}>
              {conditionAreas.exterior.map((item) => (
                <Grid item xs={12} sm={6} key={item}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1">{item}</Typography>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                      <TextField
                        select
                        label="Condition"
                        value={formData.exterior_condition?.[item]?.condition || 'good'}
                        onChange={(e) => handleConditionChange('exterior', item, 'condition', e.target.value)}
                      >
                        <MenuItem value="good">Good</MenuItem>
                        <MenuItem value="fair">Fair</MenuItem>
                        <MenuItem value="poor">Poor</MenuItem>
                      </TextField>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Notes"
                      multiline
                      rows={2}
                      sx={{ mt: 1 }}
                      value={formData.exterior_condition?.[item]?.notes || ''}
                      onChange={(e) => handleConditionChange('exterior', item, 'notes', e.target.value)}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Interior Condition */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Interior Condition
            </Typography>
            <Grid container spacing={2}>
              {conditionAreas.interior.map((item) => (
                <Grid item xs={12} sm={6} key={item}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1">{item}</Typography>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                      <TextField
                        select
                        label="Condition"
                        value={formData.interior_condition?.[item]?.condition || 'good'}
                        onChange={(e) => handleConditionChange('interior', item, 'condition', e.target.value)}
                      >
                        <MenuItem value="good">Good</MenuItem>
                        <MenuItem value="fair">Fair</MenuItem>
                        <MenuItem value="poor">Poor</MenuItem>
                      </TextField>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Notes"
                      multiline
                      rows={2}
                      sx={{ mt: 1 }}
                      value={formData.interior_condition?.[item]?.notes || ''}
                      onChange={(e) => handleConditionChange('interior', item, 'notes', e.target.value)}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Photos */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Photos
            </Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
            >
              Add Photos
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Button>
            <List>
              {photos.map((photo, index) => (
                <ListItem key={index}>
                  <ListItemText primary={photo.name} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => removePhoto(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Customer Signature */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Customer Signature
            </Typography>
            <Paper
              sx={{
                border: '1px solid #ccc',
                borderRadius: 1,
                overflow: 'hidden',
                touchAction: 'none',
              }}
            >
              <SignatureCanvas
                ref={(ref) => setSignaturePad(ref)}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'signature-canvas',
                }}
              />
            </Paper>
            <Button
              size="small"
              onClick={() => signaturePad?.clear()}
              sx={{ mt: 1 }}
            >
              Clear Signature
            </Button>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Inspector Notes"
              multiline
              rows={4}
              value={formData.inspector_notes || ''}
              onChange={(e) => handleChange('inspector_notes', e.target.value)}
            />
          </Grid>

          {/* Submit Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Complete Inspection'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
