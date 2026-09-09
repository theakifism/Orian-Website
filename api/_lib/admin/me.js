import { requireAdmin } from '../auth.js';

export default requireAdmin(async (req, res) => {
  const { email, name, role } = req.admin;
  return res.status(200).json({ admin: { email, name, role } });
});
