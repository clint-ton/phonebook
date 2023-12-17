const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGODB_URI;
console.log("connecting to", url);
mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    minLength: 8,
    validate: (number) => {
      for (let i = 0; i < number.length; i++) {
        if (!(i === 2 || i === 3)) {
          if (isNaN(number[i])) {
            return false;
          }
        }
      }
      return true;
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
