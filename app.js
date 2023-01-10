const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();
const url = process.env.MONGODB_URL;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "https://MohamedAwde.github.io",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.use("/api/users/", require("./routes/user.route"));
app.use("/api/posts/", require("./routes/post.route"));

app.get("/", (_req, res) =>
  res.sendFile(path.join(__dirname, "views", "index.html"))
);
app.get("*", (_req, res) =>
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
);

// require("./models/users.module").remove({}, function (err) {
//   console.log("collection removed");
// });

mongoose
  .connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connection to MongoDB is started!");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`server is runing on port:${PORT}`)
    );
  })
  .catch((e) => {
    console.log("error while connecting to MongoDB");
  });
