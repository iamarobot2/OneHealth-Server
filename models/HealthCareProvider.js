const mongoose = require("mongoose");
const { format } = require("date-fns/format");

const healthCareProviderSchema = new mongoose.Schema({
  personalInformation: {
    fullName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      min: "1900-01-01",
      max: format(new Date(), "yyyy-MM-dd"),
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
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  professionalInformation: {
    specialization: {
      type: String,
      required: true,
    },
    medicalLicenseNumber: {
      type: String,
      required: true,
    },
    workExperience: Number,
    clinicHospitalDetails: 
    [
        {
            name:String,
            address:String,
        }
    ]
  },
  addressInformation: {
    clinicHospitalAddress: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  consultationInformation: {
    consultationHours: [String],
    consultationFees: Number
  },
  role:
    {
      type: String,
      default:"healthcareprovider"
    }
});

const HealthCareProvider = mongoose.model("HealthCareProvider", healthCareProviderSchema);
module.exports = HealthCareProvider;
