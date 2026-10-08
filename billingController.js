const Billing = require('../models/Billing');

const getAllBills = async (req, res, next) => {
  try {
    const bills = await Billing.getAll();
    const totalRevenue = await Billing.getTotalRevenue();
    res.json({ success: true, bills, totalRevenue });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_method } = req.body;
    await Billing.updatePaymentStatus(id, payment_status, payment_method);
    res.json({ success: true, message: `Payment status updated to ${payment_status}.` });
  } catch (error) {
    next(error);
  }
};

const deleteBill = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Billing.delete(id);
    res.json({ success: true, message: 'Billing record deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBills,
  updateStatus,
  deleteBill
};
