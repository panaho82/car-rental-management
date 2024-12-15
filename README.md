# Car Rental Management System

A modern car rental management system built with React and Supabase.

![CI/CD](https://github.com/panaho82/car-rental-management/workflows/Frontend%20CI%2FCD/badge.svg)

## Features

- 🚗 Modern vehicle management interface
- 📊 Real-time analytics dashboard
- 📱 Responsive design
- 🔒 Secure authentication with Supabase
- 📅 Advanced booking system
- 📈 Performance monitoring
- 🛠️ Maintenance tracking

## Tech Stack

- Frontend:
  - React with TypeScript
  - Vite
  - Material-UI
  - Recharts for data visualization
  - Supabase Client

- Backend:
  - Node.js
  - Supabase
  - PostgreSQL

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/panaho82/car-rental-management.git
   cd car-rental-management
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Fill in your Supabase credentials

5. Start the development servers:
   ```bash
   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd backend
   npm run dev
   ```

## Deployment

The application is automatically deployed to Vercel when changes are pushed to the main branch.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
