const Appointment = require('../models/Appointment');

const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.getAll();
    res.json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};

const checkDoctorAvailability = async (req, res, next) => {
  try {
    const { doctor_id, date, time } = req.query;
    if (!doctor_id || !date || !time) {
      return res.status(400).json({ success: false, message: 'doctor_id, date, and time query parameters are required.' });
    }

    const isBooked = await Appointment.checkConflict(doctor_id, date, time);
    res.json({
      success: true,
      available: !isBooked,
      message: isBooked ? 'Doctor is unavailable at this time slot.' : 'Time slot is available!'
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Appointment.updateStatus(id, status);
    res.json({ success: true, message: `Appointment status changed to ${status}.` });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Appointment.delete(id);
    res.json({ success: true, message: 'Appointment deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAppointments,
  checkDoctorAvailability,
  updateStatus,
  deleteAppointment
};
