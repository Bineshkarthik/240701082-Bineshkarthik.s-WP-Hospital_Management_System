const MedicalRecord = require('../models/MedicalRecord');

const getAllRecords = async (req, res, next) => {
  try {
    const records = await MedicalRecord.getAll();
    res.json({ success: true, records });
  } catch (error) {
    next(error);
  }
};

const getPatientRecords = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const records = await MedicalRecord.getByPatientId(patientId);
    res.json({ success: true, records });
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    await MedicalRecord.delete(id);
    res.json({ success: true, message: 'Medical record deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecords,
  getPatientRecords,
  deleteRecord
};
