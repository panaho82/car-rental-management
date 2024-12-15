import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VehiclePerformance } from '../VehiclePerformance';

const mockStats = {
  totalRentals: 150,
  totalRevenue: 15000,
  averageRentalDuration: 3.5,
  maintenanceCosts: 2500,
  utilization: 85,
  monthlyRevenue: [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1500 },
    { month: 'Mar', revenue: 1800 },
  ],
  monthlyMaintenance: [
    { month: 'Jan', cost: 200 },
    { month: 'Feb', cost: 300 },
    { month: 'Mar', cost: 250 },
  ],
  statusDistribution: [
    { name: 'Available', value: 70 },
    { name: 'Rented', value: 20 },
    { name: 'Maintenance', value: 10 },
  ],
};

describe('VehiclePerformance', () => {
  it('renders KPI cards correctly', () => {
    render(<VehiclePerformance stats={mockStats} />);

    // Check if all KPI cards are rendered with correct values
    expect(screen.getByText('Total Rentals')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();

    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$15,000')).toBeInTheDocument();

    expect(screen.getByText('Avg. Rental Duration')).toBeInTheDocument();
    expect(screen.getByText('3.5 days')).toBeInTheDocument();

    expect(screen.getByText('Utilization Rate')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders charts correctly', () => {
    render(<VehiclePerformance stats={mockStats} />);

    // Check if chart titles are rendered
    expect(screen.getByText('Revenue vs Maintenance Costs')).toBeInTheDocument();
    expect(screen.getByText('Vehicle Status Distribution')).toBeInTheDocument();

    // Check if legend items are present
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Maintenance Costs')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const emptyStats = {
      totalRentals: 0,
      totalRevenue: 0,
      averageRentalDuration: 0,
      maintenanceCosts: 0,
      utilization: 0,
      monthlyRevenue: [],
      monthlyMaintenance: [],
      statusDistribution: [],
    };

    render(<VehiclePerformance stats={emptyStats} />);

    // Check if KPI cards show zero values correctly
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('0 days')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
