const mongoose = require('mongoose');
const readline = require('readline');
const bcrypt = require('bcryptjs');
const config = require('../src/config/env');
const Admin = require('../src/models/Admin');

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
};

// Masked password prompt
const askPassword = (query) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    process.stdout.write(query);

    let password = '';
    const stdin = process.stdin;

    // Set raw mode to capture individual keystrokes for masking
    if (stdin.isTTY) {
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf8');

      const onData = (char) => {
        char = char.toString();

        switch (char) {
          case '\n':
          case '\r':
          case '\u0004':
            stdin.setRawMode(false);
            stdin.pause();
            stdin.removeListener('data', onData);
            process.stdout.write('\n');
            rl.close();
            resolve(password);
            break;
          case '\u0003': // Ctrl+C
            process.stdout.write('\n');
            process.exit(1);
            break;
          case '\u007f': // Backspace
          case '\b':
            if (password.length > 0) {
              password = password.slice(0, -1);
              process.stdout.write('\b \b');
            }
            break;
          default:
            password += char;
            process.stdout.write('*');
            break;
        }
      };

      stdin.on('data', onData);
    } else {
      // Fallback for non-TTY environments
      rl.question('', (ans) => {
        rl.close();
        resolve(ans.trim());
      });
    }
  });
};

const createAdmin = async () => {
  try {
    console.log('====================================================');
    console.log('🔐 NexaTech — Initial Administrator Account Creator');
    console.log('====================================================\n');

    let email = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim() : '';
    let name = process.env.ADMIN_NAME ? process.env.ADMIN_NAME.trim() : '';
    let password = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD : '';

    // If environment variables are missing, prompt interactively
    if (!email) {
      email = await askQuestion('Enter Admin Email: ');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Error: A valid email address is required.');
      process.exit(1);
    }

    if (!name) {
      name = await askQuestion('Enter Admin Full Name: ');
    }
    if (!name || name.length < 2) {
      console.error('❌ Error: Name must be at least 2 characters.');
      process.exit(1);
    }

    if (!password) {
      password = await askPassword('Enter Admin Password (minimum 12 characters): ');
    }
    if (!password || password.length < 12) {
      console.error('\n❌ Error: Password must be at least 12 characters long.');
      process.exit(1);
    }

    console.log('\nConnecting to database...');
    await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });

    // Check if an admin with this email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      console.warn(`\n⚠️ Notice: An admin account with email "${email}" already exists. Will not overwrite.`);
      process.exit(0);
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = new Admin({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'superadmin',
    });

    await admin.save();

    console.log('\n✅ Initial Administrator account created successfully!');
    console.log(`👤 Name:  ${admin.name}`);
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🛡️ Role:  ${admin.role}`);
    console.log('\nYou can now log in at http://localhost:5173/admin/login');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to create administrator account:', error.message);
    process.exit(1);
  }
};

createAdmin();
