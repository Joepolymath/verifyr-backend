const mongoose = require('mongoose');

const staffSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    companyRole: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },

    dateOfBirth: {
      type: String,
      required: true,
    },

    company: {
      type: mongoose.Types.ObjectId,
      ref: 'Company',
      required: true,
    },

    password: {
      type: String,
    },
    resetPin: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Staff', staffSchema);
