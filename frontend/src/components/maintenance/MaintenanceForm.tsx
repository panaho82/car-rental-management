import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MaintenanceRecord, MaintenanceType, MaintenanceStatus } from '../../types/maintenance';
import { maintenanceService } from '../../services/maintenanceService';

interface MaintenanceFormProps {
  vehicleId: string;
  onSubmit: (maintenance: MaintenanceRecord) => void;
  onCancel: () => void;
  initialData?: Partial<MaintenanceRecord>;
}

const maintenanceTypes: { value: MaintenanceType; label: string }[] = [
  { value: 'oil_change', label: 'Oil Change' },
  { value: 'filter_change', label: 'Filter Change' },
  { value: 'brake_service', label: 'Brake Service' },
  { value: 'tire_service', label: 'Tire Service' },
  { value: 'general_inspection', label: 'General Inspection' },
  { value: 'technical_control', label: 'Technical Control' },
  { value: 'repair', label: 'Repair' },
  { value: 'other', label: 'Other' },
];

const maintenanceStatuses: { value: MaintenanceStatus; label: string }[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  vehicleId,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<MaintenanceRecord>>({
    vehicle_id: vehicleId,
    maintenance_type: 'general_inspection',
    status: 'scheduled',
    scheduled_date: new Date().toISOString(),
    ...initialData,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof MaintenanceRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let documents: string[] = [];
      if (files.length > 0) {
        documents = await maintenanceService.uploadFiles(
          files,
          `maintenance/${vehicleId}`
        );
      }

      const maintenanceData = {
        ...formData,
        documents: [...(formData.documents || []), ...documents],
      } as Omit<MaintenanceRecord, 'id' | 'created_at' | 'updated_at'>;

      const result = await maintenanceService.createMaintenanceRecord(maintenanceData);
      onSubmit(result);
    } catch (error) {
      console.error('Error creating maintenance record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Maintenance Record' : 'New Maintenance Record'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Maintenance Type</InputLabel>
              <Select
                value={formData.maintenance_type}
                label="Maintenance Type"
                onChange={(e) => handleChange('maintenance_type', e.target.value)}
                required
              >
                {maintenanceTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleChange('status', e.target.value)}
                required
              >
                {maintenanceStatuses.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <DateTimePicker
              label="Scheduled Date"
              value={formData.scheduled_date}
              onChange={(newValue) => handleChange('scheduled_date', newValue)}
              sx={{ width: '100%' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mileage"
              type="number"
              value={formData.mileage_at_maintenance || ''}
              onChange={(e) => handleChange('mileage_at_maintenance', parseInt(e.target.value))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cost"
              type="number"
              value={formData.cost || ''}
              onChange={(e) => handleChange('cost', parseFloat(e.target.value))}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Performed By"
              value={formData.performed_by || ''}
              onChange={(e) => handleChange('performed_by', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={4}
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              sx={{ mr: 2 }}
            >
              Upload Documents
              <input
                type="file"
                hidden
                multiple
                onChange={handleFileChange}
              />
            </Button>
            {files.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {files.length} file(s) selected
              </Typography>
            )}
          </Grid>

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
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
