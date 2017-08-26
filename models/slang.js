const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slangSchema = new Schema({
  slang: String,
  definition: String
});

const Slang = mongoose.model('Slang', slangSchema);

module.exports = Slang;
