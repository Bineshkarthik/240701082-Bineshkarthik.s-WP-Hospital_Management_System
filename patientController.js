const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const MedicalRecord = require('../models/MedicalRecord');
const Billing = require('../models/Billing');

// Get Patient Dashboard Data
const getPatientDashboard = async (req, res, next) => {
  try {
    const patient = await Patient.findByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found.' });
    }

    const appointments = await Appointment.getByPatientId(patient.patient_id);
    const prescriptions = await Prescription.getByPatientId(patient.patient_id);
    const medicalRecords = await MedicalRecord.getByPatientId(patient.patient_id);
    const bills = await Billing.getByPatientId(patient.patient_id);

    res.json({
      success: true,
      patient,
      appointments,
      prescriptions,
      medicalRecords,
      bills
    });
  } catch (error) {
    next(error);
  }
};

// Book Appointment with double booking check & automatic invoice creation
const bookAppointment = async (req, res, next) => {
  try {
    let patient = await Patient.findByUserId(req.user.id);
    if (!patient && req.user.role === 'patient') {
      return res.status(400).json({ success: false, message: 'Patient profile details missing.' });
    }

    const { doctor_id, appointment_date, appointment_time, reason, patient_id } = req.body;
    const targetPatientId = patient ? patient.patient_id : patient_id;

    if (!targetPatientId || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ success: false, message: 'Doctor, appointment date, and time slot are required.' });
    }

    // Double Booking Prevention
    const isConflicting = await Appointment.checkConflict(doctor_id, appointment_date, appointment_time);
    if (isConflicting) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked for the selected doctor. Please choose a different date or time.'
      });
    }

    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(44).json({ success: false, message: 'Doctor not found.' });
    }

    const appointmentId = await Appointment.create({
      patient_id: targetPatientId,
      doctor_id,
      appointment_date,
      appointment_time,
      reason,
      status: 'pending'
    });

    // Auto-generate Bill Invoice for consultation
    await Billing.create({
      patient_id: targetPatientId,
      appointment_id: appointmentId,
      amount: doctor.consultation_fee || 50.00,
      payment_status: 'unpaid',
      payment_method: 'Cash / Online'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment successfully booked! Consultation bill created.',
      appointmentId
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Appointment
const cancelAppointment = async (req, res, next) => {
  try {
    const { appointment_id } = req.params;
    await Appointment.updateStatus(appointment_id, 'cancelled');
    res.json({ success: true, message: 'Appointment has been cancelled.' });
  } catch (error) {
    next(error);
  }
};

// Pay Bill
const payBill = async (req, res, next) => {
  try {
    const { bill_id, payment_method = 'Credit Card' } = req.body;
    await Billing.updatePaymentStatus(bill_id, 'paid', payment_method);
    res.json({ success: true, message: 'Payment successfully processed! Thank you.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatientDashboard,
  bookAppointment,
  cancelAppointment,
  payBill
};
