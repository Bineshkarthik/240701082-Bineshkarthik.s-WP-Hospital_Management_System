const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

// Get Doctor Dashboard Data
const getDoctorDashboard = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByUserId(req.user.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const allAppointments = await Appointment.getByDoctorId(doctor.doctor_id);
    const todaysAppointments = await Appointment.getTodayByDoctorId(doctor.doctor_id, todayStr);
    const medicalRecords = await MedicalRecord.getByDoctorId(doctor.doctor_id);
    const prescriptions = await Prescription.getByDoctorId(doctor.doctor_id);

    // Filter unique assigned patients
    const patientMap = {};
    allAppointments.forEach(app => {
      if (app.patient_id && !patientMap[app.patient_id]) {
        patientMap[app.patient_id] = {
          patient_id: app.patient_id,
          name: app.patient_name,
          email: app.patient_email,
          phone: app.patient_phone,
          blood_group: app.blood_group,
          date_of_birth: app.date_of_birth
        };
      }
    });

    res.json({
      success: true,
      doctor,
      todaysAppointments,
      allAppointments,
      assignedPatients: Object.values(patientMap),
      medicalRecords,
      prescriptions
    });
  } catch (error) {
    next(error);
  }
};

// Add Medical Diagnosis / Notes
const addDiagnosis = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByUserId(req.user.id);
    if (!doctor) {
      return res.status(403).json({ success: false, message: 'Only authorized doctors can add medical records.' });
    }

    const { patient_id, diagnosis, symptoms, treatment, notes } = req.body;
    if (!patient_id || !diagnosis) {
      return res.status(400).json({ success: false, message: 'Patient ID and Diagnosis are required.' });
    }

    const recordId = await MedicalRecord.create({
      patient_id,
      doctor_id: doctor.doctor_id,
      diagnosis,
      symptoms,
      treatment,
      notes
    });

    res.status(201).json({ success: true, message: 'Medical diagnosis and treatment notes recorded!', recordId });
  } catch (error) {
    next(error);
  }
};

// Add Prescription
const addPrescription = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByUserId(req.user.id);
    if (!doctor) {
      return res.status(403).json({ success: false, message: 'Only authorized doctors can add prescriptions.' });
    }

    const { patient_id, medicine, dosage, duration, instructions } = req.body;
    if (!patient_id || !medicine || !dosage || !duration) {
      return res.status(400).json({ success: false, message: 'Patient, Medicine, Dosage, and Duration are required.' });
    }

    const prescriptionId = await Prescription.create({
      patient_id,
      doctor_id: doctor.doctor_id,
      medicine,
      dosage,
      duration,
      instructions
    });

    res.status(201).json({ success: true, message: 'Prescription successfully added!', prescriptionId });
  } catch (error) {
    next(error);
  }
};

// Update Appointment Status
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { appointment_id, status } = req.body;
    if (!appointment_id || !status) {
      return res.status(400).json({ success: false, message: 'Appointment ID and status are required.' });
    }

    await Appointment.updateStatus(appointment_id, status);
    res.json({ success: true, message: `Appointment status updated to ${status}.` });
  } catch (error) {
    next(error);
  }
};

// Get Patient History by Patient ID
const getPatientHistory = async (req, res, next) => {
  try {
    const { patient_id } = req.params;
    const patient = await Patient.findById(patient_id);
    const records = await MedicalRecord.getByPatientId(patient_id);
    const prescriptions = await Prescription.getByPatientId(patient_id);
    const appointments = await Appointment.getByPatientId(patient_id);

    res.json({
      success: true,
      patient,
      records,
      prescriptions,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctorDashboard,
  addDiagnosis,
  addPrescription,
  updateAppointmentStatus,
  getPatientHistory
};
