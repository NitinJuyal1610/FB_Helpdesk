import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the user schema with a separate password field:
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, // Ensure unique email addresses
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Enforce a minimum password length
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving the user document:
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next(); // No password change, skip hashing
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate a random salt with 10 rounds
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err); // Handle hashing errors
  }
});

// Compare hashed password during login attempts:
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    console.error(err); // Log errors but don't reveal sensitive information
    return false;
  }
};

export default mongoose.models['User'] || mongoose.model('User', userSchema);
