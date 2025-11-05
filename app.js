const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./src/routes/authRoutes");
const bannerRoutes = require("./src/routes/bannerRoutes");
const serviceRoutes = require("./src/routes/serviceRoutes");
const balanceRoutes = require("./src/routes/balanceRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use("/api", authRoutes);
app.use("/api", bannerRoutes);
app.use("/api", serviceRoutes);
app.use("/api", balanceRoutes);
app.use("/api", transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
