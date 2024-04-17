const mongoose = require("mongoose");
const { format } = require("date-fns/format");

const userSchema = mongoose.Schema(
  {
    personalInformation: {
      fullName: {
        type: String,
        required: true,
      },
      dateOfBirth: {
        type: Date,
        required: true,
        min: "1900-01-01",
        max: format(new Date(), "yyyy-MM-dd")
      },
      gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
      },
      contactNumber: {
        type: String,
        required: true,
      },
    },
    accountInformation: {
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      }
    },
    addressInformation: {
      residentialAddress: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    medicalInformation: {
      bloodGroup: String,
      knownAllergies: [String],
      chronicDiseases: [String],
      currentMedications: [String],
      pastSurgeriesOrHospitalizations: [String]
    },
    role:
    {
      type: String,
      default:"user"
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
