import { Chip } from '@mui/material';
import { ReservationStatus, STATUS_COLORS, STATUS_LABELS } from '../types/reservation';

interface ReservationStatusChipProps {
  status: ReservationStatus;
  size?: 'small' | 'medium';
}

export default function ReservationStatusChip({ status, size = 'small' }: ReservationStatusChipProps) {
  return (
    <Chip
      label={STATUS_LABELS[status]}
      size={size}
      sx={{
        backgroundColor: STATUS_COLORS[status],
        color: 'white',
        fontWeight: 'medium',
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
}
