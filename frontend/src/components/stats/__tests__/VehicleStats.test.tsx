import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VehicleStats } from '../VehicleStats';

const mockStats = {
  totalRentals: 150,
  totalRevenue: 15000,
  averageRentalDuration: 3.5,
  maintenanceCosts: 2500,
  utilization: 85,
  upcomingMaintenances: [
    {
      id: '1',
      maintenance_type: 'oil_change',
      scheduled_date: '2024-02-15',
    },
    {
      id: '2',
      maintenance_type: 'tire_rotation',
      scheduled_date: '2024-03-01',
    }
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1500 },
    { month: 'Mar', revenue: 1800 },
  ]
};

describe('VehicleStats', () => {
  it('renders all statistics correctly', () => {
    render(<VehicleStats vehicleId="v1" stats={mockStats} />);

    // Check if key metrics are displayed
    expect(screen.getByText('Total Rentals')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$15,000.00')).toBeInTheDocument();

    expect(screen.getByText('Average Rental Duration')).toBeInTheDocument();
    expect(screen.getByText('3.5 days')).toBeInTheDocument();

    expect(screen.getByText('Maintenance Costs')).toBeInTheDocument();
    expect(screen.getByText('$2,500.00')).toBeInTheDocument();

    expect(screen.getByText('Utilization Rate')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders upcoming maintenances section', () => {
    render(<VehicleStats vehicleId="v1" stats={mockStats} />);

    expect(screen.getByText('Upcoming Maintenances')).toBeInTheDocument();
    expect(screen.getByText('Oil Change')).toBeInTheDocument();
    expect(screen.getByText('Tire Rotation')).toBeInTheDocument();
  });

  it('renders revenue chart', () => {
    render(<VehicleStats vehicleId="v1" stats={mockStats} />);

    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    // Check if all months are displayed
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('Mar')).toBeInTheDocument();
  });

  it('handles empty stats gracefully', () => {
    const emptyStats = {
      totalRentals: 0,
      totalRevenue: 0,
      averageRentalDuration: 0,
      maintenanceCosts: 0,
      utilization: 0,
      upcomingMaintenances: [],
      monthlyRevenue: []
    };

    render(<VehicleStats vehicleId="v1" stats={emptyStats} />);

    expect(screen.getByText('Total Rentals')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('No upcoming maintenances')).toBeInTheDocument();
  });
});
