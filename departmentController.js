const Department = require('../models/Department');

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.getAll();
    res.json({ success: true, departments });
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { department_name, description } = req.body;
    if (!department_name) {
      return res.status(400).json({ success: false, message: 'Department name is required.' });
    }

    const deptId = await Department.create({ department_name, description });
    res.status(201).json({ success: true, message: 'Department created successfully!', department_id: deptId });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { department_name, description } = req.body;
    await Department.update(id, { department_name, description });
    res.json({ success: true, message: 'Department updated successfully.' });
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Department.delete(id);
    res.json({ success: true, message: 'Department deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
