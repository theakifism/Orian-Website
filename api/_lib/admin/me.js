import { requireAdmin } from '../auth.js';

export default requireAdmin(async (req, res) => {
  const { sub, email, name, role } = req.admin;
  return res.status(200).json({ admin: { id: sub, email, name, role } });
});
