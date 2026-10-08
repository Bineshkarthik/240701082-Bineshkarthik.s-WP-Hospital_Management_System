const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { JWT_SECRET } = require('../middleware/auth');

// Patient Registration
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role = 'patient', date_of_birth, gender, blood_group, address, emergency_contact } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields (name, email, password).' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create({ name, email, password: hashedPassword, role, phone });

    if (role === 'patient') {
      await Patient.create({
        user_id: userId,
        date_of_birth,
        gender,
        blood_group,
        address,
        emergency_contact
      });
    }

    const token = jwt.sign({ id: userId, email, role, name }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: { id: userId, name, email, role, phone }
    });
  } catch (error) {
    next(error);
  }
};

// Login User
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password.' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    let profileData = null;
    if (user.role === 'patient') {
      profileData = await Patient.findByUserId(user.id);
    } else if (user.role === 'doctor') {
      profileData = await Doctor.findByUserId(user.id);
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profile: profileData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    let extraProfile = null;
    if (user.role === 'patient') {
      extraProfile = await Patient.findByUserId(user.id);
    } else if (user.role === 'doctor') {
      extraProfile = await Doctor.findByUserId(user.id);
    }

    res.json({
      success: true,
      user: {
        ...user,
        profile: extraProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, date_of_birth, gender, blood_group, address, emergency_contact, specialization, qualification, experience, consultation_fee, availability } = req.body;

    await User.update(req.user.id, { name, email, phone, role: req.user.role });

    if (req.user.role === 'patient') {
      const patient = await Patient.findByUserId(req.user.id);
      if (patient) {
        await Patient.update(patient.patient_id, { date_of_birth, gender, blood_group, address, emergency_contact });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findByUserId(req.user.id);
      if (doctor) {
        await Doctor.update(doctor.doctor_id, {
          department_id: doctor.department_id,
          specialization,
          qualification,
          experience,
          consultation_fee,
          availability
        });
      }
    }

    res.json({ success: true, message: 'Profile updated successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
