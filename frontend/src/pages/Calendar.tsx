import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
} from '@mui/icons-material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { supabase } from '../supabase/client';
import { ReservationStatus, STATUS_COLORS } from '../types/reservation';
import ReservationStatusChip from '../components/ReservationStatus';
import { checkOverlap, getReservationDuration, isReservationLate, updateReservationStatus } from '../utils/reservationUtils';

interface CalendarEvent {
  id: string;
  vehicleId: string;
  customerId: string;
  title: string;
  start: Date;
  end: Date;
  status: ReservationStatus;
  notes?: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  image?: string;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [viewMode, setViewMode] = useState<'jour' | 'semaine' | 'mois' | 'timeline' | 'année'>('timeline');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchVehicles();
    fetchReservations();
    fetchCustomers();
  }, [currentDate]);

  async function fetchVehicles() {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*');

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  }

  async function fetchReservations() {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          vehicle:vehicles(brand, model),
          customer:customers(first_name, last_name)
        `);

      if (error) throw error;

      const formattedEvents = (data || []).map((reservation: any) => ({
        id: reservation.id,
        vehicleId: reservation.vehicle_id,
        customerId: reservation.customer_id,
        title: `${reservation.customer.first_name} ${reservation.customer.last_name}`,
        start: new Date(reservation.start_date),
        end: new Date(reservation.end_date),
        status: reservation.status,
        notes: reservation.notes,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  }

  async function fetchCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getHourPositionPercentage = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
  };

  const formatTimeRange = (start: Date, end: Date) => {
    const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const days = Math.floor(diffInHours / 24);
    const hours = Math.floor(diffInHours % 24);
    const minutes = Math.round((diffInHours % 1) * 60);

    let result = '';
    if (days > 0) result += `${days} jour${days > 1 ? 's' : ''}, `;
    if (hours > 0) result += `${hours} heure${hours > 1 ? 's' : ''}, `;
    if (minutes > 0) result += `${minutes} minute${minutes > 1 ? 's' : ''}`;

    return result.replace(/, $/, '');
  };

  const renderTimelineHeader = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(
        <Box
          key={i}
          sx={{
            position: 'relative',
            flex: 1,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            textAlign: 'center',
            minWidth: '50px',
          }}
        >
          {i}:00
        </Box>
      );
    }
    return hours;
  };

  const handleTimelineClick = (vehicleId: string, event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentageX = (clickX / rect.width) * 100;
    
    const hours = Math.floor((percentageX / 100) * 24);
    const minutes = Math.floor(((percentageX / 100) * 24 - hours) * 60);
    
    const clickedDate = new Date(currentDate);
    clickedDate.setHours(hours, minutes, 0, 0);
    
    setNewEvent({
      vehicleId,
      start: clickedDate,
      end: new Date(clickedDate.getTime() + 2 * 60 * 60 * 1000),
      status: 'pending'
    });
    setSelectedEvent(null);
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleSaveEvent = async () => {
    try {
      const eventData = isEditing ? selectedEvent : newEvent;
      const { start, end, vehicleId, customerId, status, notes } = eventData as CalendarEvent;
      
      if (!start || !end || !vehicleId || !customerId) {
        showSnackbar('Veuillez remplir tous les champs obligatoires', 'error');
        return;
      }

      // Vérifier les chevauchements
      const hasOverlap = checkOverlap(
        start,
        end,
        vehicleId,
        events,
        isEditing ? selectedEvent?.id : undefined
      );

      if (hasOverlap) {
        showSnackbar('Il y a déjà une réservation sur cette période', 'error');
        return;
      }

      if (isEditing && selectedEvent?.id) {
        const { error } = await supabase
          .from('reservations')
          .update({
            start_date: start.toISOString(),
            end_date: end.toISOString(),
            vehicle_id: vehicleId,
            customer_id: customerId,
            status,
            notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedEvent.id);

        if (error) throw error;
        showSnackbar('Réservation modifiée avec succès', 'success');
      } else {
        const { error } = await supabase
          .from('reservations')
          .insert({
            start_date: start.toISOString(),
            end_date: end.toISOString(),
            vehicle_id: vehicleId,
            customer_id: customerId,
            status,
            notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
        showSnackbar('Réservation créée avec succès', 'success');
      }

      setOpenDialog(false);
      fetchReservations();
    } catch (error) {
      console.error('Error saving reservation:', error);
      showSnackbar('Une erreur est survenue lors de la sauvegarde', 'error');
    }
  };

  const handleDragEnd = async (result: any) => {
    setIsDragging(false);
    if (!result.destination) return;

    const eventId = result.draggableId;
    const sourceVehicleId = result.source.droppableId;
    const destinationVehicleId = result.destination.droppableId;
    const event = events.find(e => e.id === eventId);

    if (!event) return;

    // Calculer la nouvelle heure de début basée sur la position de dépôt
    const timelineElement = document.getElementById(`timeline-${destinationVehicleId}`);
    if (!timelineElement) return;

    const rect = timelineElement.getBoundingClientRect();
    const dropX = result.destination.x - rect.left;
    const percentageX = (dropX / rect.width) * 100;
    
    const hours = Math.floor((percentageX / 100) * 24);
    const minutes = Math.floor(((percentageX / 100) * 24 - hours) * 60);
    
    const newStart = new Date(currentDate);
    newStart.setHours(hours, minutes, 0, 0);
    
    const duration = event.end.getTime() - event.start.getTime();
    const newEnd = new Date(newStart.getTime() + duration);

    // Vérifier les chevauchements
    const hasOverlap = checkOverlap(newStart, newEnd, destinationVehicleId, events, event.id);
    if (hasOverlap) {
      showSnackbar('Il y a déjà une réservation sur cette période', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('reservations')
        .update({
          start_date: newStart.toISOString(),
          end_date: newEnd.toISOString(),
          vehicle_id: destinationVehicleId,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) throw error;
      showSnackbar('Réservation déplacée avec succès', 'success');
      fetchReservations();
    } catch (error) {
      console.error('Error moving reservation:', error);
      showSnackbar('Une erreur est survenue lors du déplacement', 'error');
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const renderVehicleEvents = (vehicleId: string) => {
    const vehicleEvents = events
      .filter(event => event.vehicleId === vehicleId)
      .map(event => updateReservationStatus(event));
    
    return (
      <Droppable droppableId={vehicleId} direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ height: '100%', position: 'relative' }}
          >
            {vehicleEvents.map((event, index) => {
              const startPercent = getHourPositionPercentage(event.start);
              const endPercent = getHourPositionPercentage(event.end);
              const duration = getReservationDuration(event.start, event.end);
              const isLate = isReservationLate(event);

              return (
                <Draggable key={event.id} draggableId={event.id} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        position: 'absolute',
                        left: `${startPercent}%`,
                        width: `${endPercent - startPercent}%`,
                        height: '80%',
                        backgroundColor: isLate ? STATUS_COLORS.late : STATUS_COLORS[event.status],
                        color: 'white',
                        borderRadius: '4px',
                        padding: '4px',
                        overflow: 'hidden',
                        cursor: 'move',
                        '&:hover': {
                          opacity: 0.9,
                          transform: 'scale(1.02)',
                        },
                      }}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          {event.title}
                        </Typography>
                        <ReservationStatusChip status={event.status} size="small" />
                      </Box>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        {duration}
                      </Typography>
                    </Box>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, px: '12px' }}>
        <Paper sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() - 7);
                setCurrentDate(newDate);
              }}>
                <ChevronLeft />
              </IconButton>
              <IconButton onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() + 7);
                setCurrentDate(newDate);
              }}>
                <ChevronRight />
              </IconButton>
              <Button
                startIcon={<Today />}
                onClick={() => setCurrentDate(new Date())}
                sx={{ ml: 1 }}
              >
                Aujourd'hui
              </Button>
            </Box>

            <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
              {currentDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'jour' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('jour')}
              >
                Jour
              </Button>
              <Button
                variant={viewMode === 'semaine' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('semaine')}
              >
                Semaine
              </Button>
              <Button
                variant={viewMode === 'mois' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('mois')}
              >
                Mois
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('timeline')}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === 'année' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('année')}
              >
                Année
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Timeline View */}
          <Box ref={scrollContainerRef} sx={{ display: 'flex', height: 'calc(100vh - 250px)', overflow: 'auto' }}>
            {/* Vehicle Column */}
            <Box
              sx={{
                width: '200px',
                flexShrink: 0,
                borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                backgroundColor: '#f5f5f5',
              }}
            >
              <Box sx={{ height: '50px', p: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Typography variant="subtitle2">Véhicules</Typography>
              </Box>
              {vehicles.map((vehicle) => (
                <Box
                  key={vehicle.id}
                  sx={{
                    height: '100px',
                    p: 1,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {vehicle.image && (
                      <img
                        src={vehicle.image}
                        alt={vehicle.model}
                        style={{
                          width: '60px',
                          height: '40px',
                          objectFit: 'cover',
                          marginRight: '8px',
                        }}
                      />
                    )}
                    <Box>
                      <Typography variant="subtitle2">
                        {vehicle.brand} {vehicle.model}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {vehicle.licensePlate}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Timeline Content */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {/* Hours Header */}
              <Box
                sx={{
                  display: 'flex',
                  height: '50px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  position: 'sticky',
                  top: 0,
                  backgroundColor: 'white',
                  zIndex: 1,
                }}
              >
                {renderTimelineHeader()}
              </Box>

              {/* Timeline Rows */}
              {vehicles.map((vehicle) => (
                <Box
                  key={vehicle.id}
                  id={`timeline-${vehicle.id}`}
                  sx={{
                    height: '100px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                  onClick={(e) => handleTimelineClick(vehicle.id, e)}
                >
                  {/* Hour columns */}
                  {Array.from({ length: 24 }).map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: 1,
                        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                        minWidth: '50px',
                      }}
                    />
                  ))}
                  {renderVehicleEvents(vehicle.id)}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Reservation Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              {isEditing ? 'Modifier la réservation' : 'Nouvelle réservation'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={isEditing ? selectedEvent?.customerId : newEvent.customerId || ''}
                    onChange={(e) => isEditing 
                      ? setSelectedEvent({ ...selectedEvent!, customerId: e.target.value })
                      : setNewEvent({ ...newEvent, customerId: e.target.value })}
                    label="Client"
                  >
                    {customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Véhicule</InputLabel>
                  <Select
                    value={isEditing ? selectedEvent?.vehicleId : newEvent.vehicleId || ''}
                    onChange={(e) => isEditing
                      ? setSelectedEvent({ ...selectedEvent!, vehicleId: e.target.value })
                      : setNewEvent({ ...newEvent, vehicleId: e.target.value })}
                    label="Véhicule"
                  >
                    {vehicles.map((vehicle) => (
                      <MenuItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={isEditing ? selectedEvent?.status : newEvent.status || 'pending'}
                    onChange={(e) => isEditing
                      ? setSelectedEvent({ ...selectedEvent!, status: e.target.value as ReservationStatus })
                      : setNewEvent({ ...newEvent, status: e.target.value as ReservationStatus })}
                    label="Statut"
                  >
                    {Object.entries(STATUS_COLORS).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ReservationStatusChip status={value as ReservationStatus} />
                          {label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Date et heure de début"
                  type="datetime-local"
                  value={isEditing ? selectedEvent?.start.toISOString().slice(0, 16) : newEvent.start?.toISOString().slice(0, 16) || ''}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    isEditing
                      ? setSelectedEvent({ ...selectedEvent!, start: date })
                      : setNewEvent({ ...newEvent, start: date });
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Date et heure de fin"
                  type="datetime-local"
                  value={isEditing ? selectedEvent?.end.toISOString().slice(0, 16) : newEvent.end?.toISOString().slice(0, 16) || ''}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    isEditing
                      ? setSelectedEvent({ ...selectedEvent!, end: date })
                      : setNewEvent({ ...newEvent, end: date });
                  }}
                  fullWidth
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Notes"
                  multiline
                  rows={4}
                  value={isEditing ? selectedEvent?.notes : newEvent.notes || ''}
                  onChange={(e) => isEditing
                    ? setSelectedEvent({ ...selectedEvent!, notes: e.target.value })
                    : setNewEvent({ ...newEvent, notes: e.target.value })}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
              {isEditing && (
                <Button onClick={handleDeleteEvent} color="error">
                  Supprimer
                </Button>
              )}
              <Button onClick={handleSaveEvent} variant="contained" color="primary">
                {isEditing ? 'Modifier' : 'Créer'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </DragDropContext>
  );
}
