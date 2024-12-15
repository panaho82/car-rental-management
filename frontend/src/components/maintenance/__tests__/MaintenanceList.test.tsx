import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MaintenanceList } from '../MaintenanceList';
import { MaintenanceRecord } from '../../../types/maintenance';

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: '1',
    vehicle_id: 'v1',
    maintenance_type: 'oil_change',
    status: 'completed',
    scheduled_date: '2024-01-15',
    completed_date: '2024-01-15',
    cost: 50.00,
    performed_by: 'John Doe',
    notes: 'Regular maintenance',
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
  {
    id: '2',
    vehicle_id: 'v1',
    maintenance_type: 'tire_rotation',
    status: 'scheduled',
    scheduled_date: '2024-02-15',
    cost: 30.00,
    performed_by: 'Jane Smith',
    notes: 'Upcoming maintenance',
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  }
];

describe('MaintenanceList', () => {
  const mockOnAdd = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders maintenance records correctly', () => {
    render(
      <MaintenanceList
        maintenanceRecords={mockMaintenanceRecords}
        vehicleId="v1"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Check if the title is rendered
    expect(screen.getByText('Maintenance Records')).toBeInTheDocument();

    // Check if the table headers are rendered
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
    expect(screen.getByText('Performed By')).toBeInTheDocument();

    // Check if maintenance records are rendered
    expect(screen.getByText('OIL CHANGE')).toBeInTheDocument();
    expect(screen.getByText('TIRE ROTATION')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('opens add form when Add Maintenance button is clicked', () => {
    render(
      <MaintenanceList
        maintenanceRecords={mockMaintenanceRecords}
        vehicleId="v1"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const addButton = screen.getByText('Add Maintenance');
    fireEvent.click(addButton);

    // Check if the form dialog is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens edit form when edit button is clicked', () => {
    render(
      <MaintenanceList
        maintenanceRecords={mockMaintenanceRecords}
        vehicleId="v1"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByTestId('edit-button');
    fireEvent.click(editButtons[0]);

    // Check if the form dialog is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <MaintenanceList
        maintenanceRecords={mockMaintenanceRecords}
        vehicleId="v1"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByTestId('delete-button');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('handles pagination correctly', () => {
    render(
      <MaintenanceList
        maintenanceRecords={mockMaintenanceRecords}
        vehicleId="v1"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const rowsPerPageSelect = screen.getByLabelText('Rows per page:');
    fireEvent.change(rowsPerPageSelect, { target: { value: '5' } });

    expect(screen.getByText('1-2 of 2')).toBeInTheDocument();
  });
});
