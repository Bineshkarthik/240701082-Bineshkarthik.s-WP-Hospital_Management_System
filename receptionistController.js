const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Billing = require('../models/Billing');

// Get Receptionist Dashboard Summary
const getReceptionistDashboard = async (req, res, next) => {
  try {
    const patients = await Patient.getAll();
    const doctors = await Doctor.getAll();
    const appointments = await Appointment.getAll();
    const bills = await Billing.getAll();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => {
      const aDate = typeof a.appointment_date === 'string' ? a.appointment_date.split('T')[0] : a.appointment_date;
      return aDate === todayStr;
    });

    res.json({
      success: true,
      patients,
      doctors,
      appointments,
      todayAppointments,
      bills
    });
  } catch (error) {
    next(error);
  }
};

// Register Walk-in Patient
const registerPatient = async (req, res, next) => {
  try {
    const { name, email, phone, date_of_birth, gender, blood_group, address, emergency_contact } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Patient Name and Phone Number are required.' });
    }

    const patientEmail = email || `patient_${Date.now()}@medicare.com`;
    const defaultPassword = 'Patient@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const userId = await User.create({
      name,
      email: patientEmail,
      password: hashedPassword,
      role: 'patient',
      phone
    });

    const patientId = await Patient.create({
      user_id: userId,
      date_of_birth,
      gender,
      blood_group,
      address,
      emergency_contact
    });

    res.status(201).json({
      success: true,
      message: 'Walk-in Patient registered successfully!',
      patientId,
      tempCredentials: { email: patientEmail, password: defaultPassword }
    });
  } catch (error) {
    next(error);
  }
};

// Generate custom bill
const generateBill = async (req, res, next) => {
  try {
    const { patient_id, appointment_id, amount, payment_method, payment_status } = req.body;

    if (!patient_id || !amount) {
      return res.status(400).json({ success: false, message: 'Patient ID and Bill Amount are required.' });
    }

    const billId = await Billing.create({
      patient_id,
      appointment_id: appointment_id || null,
      amount: parseFloat(amount),
      payment_status: payment_status || 'unpaid',
      payment_method: payment_method || 'Cash'
    });

    res.status(201).json({ success: true, message: 'Bill generated successfully!', billId });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReceptionistDashboard,
  registerPatient,
  generateBill
};
