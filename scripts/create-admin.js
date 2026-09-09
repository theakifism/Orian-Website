// Run with: npm run create-admin
//
// This is the ONLY way an admin account gets created — there is no public
// signup endpoint or form. Run this locally whenever a new employee needs
// access to the admin panel.
import { config } from 'dotenv';
config({ path: '.env.local' });
import readline from 'node:readline/promises';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in your environment (.env).');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function isStrongEnough(password) {
  return password.length >= 10;
}

async function main() {
  const name = (await rl.question('Employee full name: ')).trim();
  const email = (await rl.question('Employee email: ')).trim().toLowerCase();
  const password = await rl.question('Temporary password (min 10 characters, they should change it later): ');

  if (!name || !email) {
    console.error('Name and email are required.');
    process.exit(1);
  }
  if (!isStrongEnough(password)) {
    console.error('Password must be at least 10 characters.');
    process.exit(1);
  }

  const password_hash = await bcrypt.hash(password, 12);

  const { error } = await supabase
    .from('admins')
    .insert({ name, email, password_hash, role: 'employee' });

  if (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  }

  console.log(`\nAdmin account created for ${email}. They can now log in at /admin/login.`);
  rl.close();
process.exit(0);
}

main();