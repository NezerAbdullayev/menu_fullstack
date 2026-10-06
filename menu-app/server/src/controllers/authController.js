import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function login(req, res) {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.checkPassword(password))) {
    return res.status(401).json({ message: 'Email və ya parol yanlışdır' });
  }
  const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  res.json({ token, admin: { id: admin._id, email: admin.email } });
}

export function me(req, res) {
  res.json({ admin: req.admin });
}
