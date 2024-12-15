export type ReservationStatus = 
  | 'pending'    // En attente de confirmation
  | 'confirmed'  // Confirmée
  | 'in_progress'// En cours
  | 'completed'  // Terminée
  | 'cancelled'  // Annulée
  | 'late'       // En retard
  | 'maintenance'; // Maintenance

export interface Reservation {
  id: string;
  vehicleId: string;
  customerId: string;
  start: Date;
  end: Date;
  status: ReservationStatus;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export const STATUS_COLORS: Record<ReservationStatus, string> = {
  pending: '#FFA726',     // Orange
  confirmed: '#66BB6A',   // Vert
  in_progress: '#42A5F5', // Bleu
  completed: '#78909C',   // Gris-bleu
  cancelled: '#EF5350',   // Rouge
  late: '#E53935',        // Rouge foncé
  maintenance: '#8E24AA'  // Violet
};

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée',
  late: 'En retard',
  maintenance: 'Maintenance'
};
