const mongoose = require("mongoose");

const connect = async () =>
  mongoose
    .connect(
      "mongodb+srv://tminhkhoa91:jA2kXctn56WD2ST6@cluster0.bbqd7fl.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
module.exports = connect;
