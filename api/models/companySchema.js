const { mongoose } = require("./mongoose");

const companySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  orgName: {
    type: String,
    required: true,
    trim: true,
  },
  orgLogo: {
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
