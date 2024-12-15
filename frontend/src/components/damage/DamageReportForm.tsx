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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { DamageReport, DamageSeverity } from '../../types/maintenance';
import { maintenanceService } from '../../services/maintenanceService';
import { CarDamageMarker } from './CarDamageMarker';

interface DamageReportFormProps {
  vehicleId: string;
  reservationId?: string;
  inspectionId?: string;
  onSubmit: (report: DamageReport) => void;
  onCancel: () => void;
  initialData?: Partial<DamageReport>;
}

const severityOptions: { value: DamageSeverity; label: string }[] = [
  { value: 'minor', label: 'Minor' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'major', label: 'Major' },
  { value: 'critical', label: 'Critical' },
];

export const DamageReportForm: React.FC<DamageReportFormProps> = ({
  vehicleId,
  reservationId,
  inspectionId,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<DamageReport>>({
    vehicle_id: vehicleId,
    reservation_id: reservationId,
    inspection_id: inspectionId,
    report_date: new Date().toISOString(),
    damage_severity: 'minor',
    damage_location: { area: '', coordinates: { x: 0, y: 0 } },
    repair_status: 'pending',
    ...initialData,
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof DamageReport, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPhotos(prev => [...prev, ...Array.from(event.target.files || [])]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleDamageLocation = (area: string, coordinates: { x: number; y: number }) => {
    setFormData(prev => ({
      ...prev,
      damage_location: { area, coordinates },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload photos
      const photoUrls = await maintenanceService.uploadFiles(
        photos,
        `damage-reports/${vehicleId}`
      );

      // Create damage report
      const reportData = {
        ...formData,
        photos: photoUrls,
      } as Omit<DamageReport, 'id' | 'created_at' | 'updated_at'>;

      const result = await maintenanceService.createDamageReport(reportData);
      onSubmit(result);
    } catch (error) {
      console.error('Error creating damage report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Damage Report' : 'New Damage Report'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                label="Damage Severity"
                value={formData.damage_severity}
                onChange={(e) => handleChange('damage_severity', e.target.value)}
                required
              >
                {severityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                label="Repair Status"
                value={formData.repair_status}
                onChange={(e) => handleChange('repair_status', e.target.value)}
                required
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Damage Description"
              multiline
              rows={4}
              required
              value={formData.damage_description || ''}
              onChange={(e) => handleChange('damage_description', e.target.value)}
            />
          </Grid>

          {/* Car Damage Marker Component */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Mark Damage Location
            </Typography>
            <CarDamageMarker
              selectedArea={formData.damage_location?.area}
              selectedCoordinates={formData.damage_location?.coordinates}
              onChange={handleDamageLocation}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Repair Estimate"
              type="number"
              value={formData.repair_estimate || ''}
              onChange={(e) => handleChange('repair_estimate', parseFloat(e.target.value))}
              InputProps={{
                startAdornment: <Typography>$</Typography>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Insurance Claim Number"
              value={formData.insurance_claim_number || ''}
              onChange={(e) => handleChange('insurance_claim_number', e.target.value)}
            />
          </Grid>

          {/* Photos */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Damage Photos
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
                {loading ? 'Saving...' : 'Save Report'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
