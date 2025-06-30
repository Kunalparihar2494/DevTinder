const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);

connectDB
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(8080, () => {
      console.log("Server successfully running at 8080");
    });
  })
  .catch((err) => {
    console.error(err);
    console.error("Database Connection Failed");
  });
