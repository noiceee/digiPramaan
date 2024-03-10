const { mongoose } = require("./mongoose");

const companySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
<<<<<<< HEAD
=======
  // isIndividual: {
  //   type: Boolean,
  //   required: true,
  // },
>>>>>>> 033b1a68d5c0b923654a6177ef781100c279ec29
  orgName: {
    type: String,
    required: true,
    trim: true,
  },
  orgLogo: {
    type: String,
    required: true,
  },
  orgSignature: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

const Companies = mongoose.model("companies", companySchema);

module.exports = Companies;
