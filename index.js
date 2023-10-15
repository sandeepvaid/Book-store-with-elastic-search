const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 8001;
//Set up the database
const db = require("./config/mongoose");
app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error listening on port", port);
    return;
  }
  console.log("Listening on port", port);
  return;
});
