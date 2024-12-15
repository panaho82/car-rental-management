import { Reservation } from '../types/reservation';

export function checkOverlap(
  start: Date,
  end: Date,
  vehicleId: string,
  existingReservations: Reservation[],
  excludeReservationId?: string
): boolean {
  return existingReservations.some(reservation => {
    if (reservation.vehicleId !== vehicleId) return false;
    if (excludeReservationId && reservation.id === excludeReservationId) return false;
    
    const reservationStart = new Date(reservation.start);
    const reservationEnd = new Date(reservation.end);
    
    return (
      (start >= reservationStart && start < reservationEnd) ||
      (end > reservationStart && end <= reservationEnd) ||
      (start <= reservationStart && end >= reservationEnd)
    );
  });
}

export function getReservationDuration(start: Date, end: Date): string {
  const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const days = Math.floor(diffInHours / 24);
  const hours = Math.floor(diffInHours % 24);
  const minutes = Math.round((diffInHours % 1) * 60);

  let result = '';
  if (days > 0) result += `${days}j `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;

  return result.trim();
}

export function isReservationLate(reservation: Reservation): boolean {
  const now = new Date();
  return reservation.status === 'in_progress' && new Date(reservation.end) < now;
}

export function updateReservationStatus(reservation: Reservation): Reservation {
  const now = new Date();
  const start = new Date(reservation.start);
  const end = new Date(reservation.end);

  if (reservation.status === 'cancelled') {
    return reservation;
  }

  if (now < start) {
    return { ...reservation, status: 'confirmed' };
  }

  if (now >= start && now <= end) {
    return { ...reservation, status: 'in_progress' };
  }

  if (now > end) {
    return { ...reservation, status: 'completed' };
  }

  return reservation;
}
