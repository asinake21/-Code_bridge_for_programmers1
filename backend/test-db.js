
const mongoose = require('mongoose');
require('dotenv').config();

const uri = "mongodb+srv://besfaa:FxDsmhXDx14Qcf@cluster0.ruydflu.mongodb.net/?appName=Cluster0";

console.log("Attempting to connect to MongoDB...");
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log("Successfully connected!");
  process.exit(0);
})
.catch(err => {
  console.error("Connection failed:", err.message);
  process.exit(1);
});
