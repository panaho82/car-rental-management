import dotenv from 'dotenv';
import path from 'path';

// Configuration des variables d'environnement en premier
const envPath = path.resolve(__dirname, '../.env');
console.log('Chemin du fichier .env:', envPath);
dotenv.config({ path: envPath });

console.log('Variables d\'environnement chargées:', {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: !!process.env.SUPABASE_KEY,
  SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY
});

// Import des autres modules après le chargement des variables d'environnement
import express from 'express';
import cors from 'cors';
import vehicleRoutes from './routes/vehicleRoutes';
import customerRoutes from './routes/customerRoutes';
import reservationRoutes from './routes/reservationRoutes';
import contractRoutes from './routes/contractRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contracts', contractRoutes);

// Route de base
app.get('/', (_req, res) => {
  res.json({ message: 'API de gestion de location de voitures' });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
