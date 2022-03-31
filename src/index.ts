const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require("./routes/auth.ts");

const app = express()
const port = 3000

dotenv.config();

app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
});

app.use("/api/auth", authRoute);

app.listen(port, () => {
  console.log("Server is running")
})