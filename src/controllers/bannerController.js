const db = require("../config/db");

exports.getBanners = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT banner_name, banner_image, description FROM banners"
    );

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 102,
      message: "Internal server error",
      data: null,
    });
  }
};
