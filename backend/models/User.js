import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    authMethod: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },
    role: {
      type: String,
      enum: ['STUDENT', 'PROFESSOR', 'ADMIN'],
      default: 'STUDENT',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    // Student profile fields
    rollNumber: {
      type: String,
      sparse: true,
    },
    department: {
      type: String,
      enum: ['CSE', 'AI & DS', 'AI & ML', 'CYBER', 'MECH', 'ECE', null],
      default: null,
    },
    year: {
      type: Number,
      min: 1,
      max: 4,
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
    },
    // Professor profile fields
    collegeName: {
      type: String,
      sparse: true,
    },
    subjects: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

