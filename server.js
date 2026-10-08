const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const receptionistRoutes = require('./routes/receptionistRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const billingRoutes = require('./routes/billingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & Body Parsers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API Router Setup
const apiRouter = express.Router();

// Public Health Check Endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'MediCare Hospital Management System',
    timestamp: new Date().toISOString()
  });
});

// Mount Sub-Routes on API Router
apiRouter.use('/auth', authRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/doctor', doctorRoutes);
apiRouter.use('/patient', patientRoutes);
apiRouter.use('/receptionist', receptionistRoutes);
apiRouter.use('/departments', departmentRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/medical-records', medicalRecordRoutes);
apiRouter.use('/prescriptions', prescriptionRoutes);
apiRouter.use('/billing', billingRoutes);

// Mount API Router for local server and Netlify Functions
app.use('/api', apiRouter);
app.use('/.netlify/functions/api', apiRouter);

// Catch-all route to serve index.html for frontend navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server locally if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` MediCare - Hospital Management System Server Running `);
    console.log(` Server URL : http://localhost:${PORT}`);
    console.log(` API Health  : http://localhost:${PORT}/api/health`);
    console.log(` Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
