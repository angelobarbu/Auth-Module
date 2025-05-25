import { sequelize, User } from '../../models/index.js';
import { hashPassword } from '../../utils/password.js';

const seedAdmin = async () => {
  await sequelize.sync();

  const existing = await User.findOne({ where: { email: 'admin@example.com' } });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const admin = await User.create({
    full_name: 'Test Admin',
    email: 'admin@example.com',
    password_hash: await hashPassword('admin123'),
    nationality: 'N/A',
    role: 'admin'
  });

  console.log('Admin created:', admin.email);
  process.exit(0);
};

seedAdmin();