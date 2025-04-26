import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: String,
  industry: String,
  location: String,
  email: { type: String, required: true, unique: true },
  phone: String,
});

const Company = mongoose.model('Company', companySchema);
export default Company;
