const { mongoose } = require("./mongoose");

const certificatesSchema = new mongoose.Schema({
  receiverEmail: {
    type: String,
    required: true,
    trim: true,
  },
  eventName: {
    type: String,
    required: true,
    trim: true,
  },
  orgLogo: {
    type: String,
    required: true,
    trim: true,
  },
  certLink: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfIssuance: {
    type: String,
    required: true,
    trim: true,
  },
  certificateId: {
    type: String,
    required: true,
    trim: true,
  },
});

const Certificates = mongoose.model("certificates", certificatesSchema);

module.exports = Certificates;
