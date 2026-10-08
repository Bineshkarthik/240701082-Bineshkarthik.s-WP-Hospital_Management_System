const Prescription = require('../models/Prescription');

const getAllPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.getAll();
    res.json({ success: true, prescriptions });
  } catch (error) {
    next(error);
  }
};

const getPatientPrescriptions = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const prescriptions = await Prescription.getByPatientId(patientId);
    res.json({ success: true, prescriptions });
  } catch (error) {
    next(error);
  }
};

const deletePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Prescription.delete(id);
    res.json({ success: true, message: 'Prescription deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPrescriptions,
  getPatientPrescriptions,
  deletePrescription
};
