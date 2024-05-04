const mongoose = require("mongoose");
const { format } = require("date-fns/format");

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
      min: "1900-01-01",
      max: format(new Date(), "yyyy-MM-dd"),
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contactnumber: {
      type: String,
      required: true,
    },
    address: {
      residentialaddress: String,
      state: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
/*
medicalInformation: {
      bloodGroup: {
        type: String,
        required: true,
      },
      knownAllergies: [
        {
          type: String,
          default: null,
        },
      ],
      chronicDiseases: [
        {
          type: String,
          default: null,
        },
      ],
      currentMedications: [
        {
          type: String,
          default: null,
        },
      ],
      pastSurgeriesOrHospitalizations: [
        {
          type: String,
          default: null,
        },
      ],
    },*/
