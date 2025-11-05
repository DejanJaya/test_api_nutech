const db = require("../config/db");

exports.getServices = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT service_code, service_name, service_icon, service_tariff FROM services"
    );

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 102,
      message: "Internal Server Error",
      data: null,
    });
  }
};
