const db = require("../config/db");

exports.getBalance = async (req, res) => {
  try {
    // Ambil email dari token JWT
    const email = req.user.email;

    const [rows] = await db.query("SELECT balance FROM users WHERE email = ?", [
      email,
    ]);

    // Jika user tidak ditemukan
    if (rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    // Jika sukses
    return res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: rows[0].balance,
      },
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
