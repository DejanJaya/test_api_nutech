const db = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const userEmail = req.user.email; // dari payload token

    const [rows] = await db.execute(
      "SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?",
      [userEmail]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    res.status(200).json({
      status: 0,
      message: "sukses",
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", data: null });
  }
};

exports.updateProfile = async (req, res) => {
  const { first_name, last_name } = req.body;
  const userEmail = req.user.email; // dari JWT

  if (!first_name || !last_name) {
    return res.status(400).json({
      status: 102,
      message: "first_name dan last_name wajib diisi",
      data: null,
    });
  }

  try {
    await db.query(
      `UPDATE users SET first_name = ?, last_name = ? WHERE email = ?`,
      [first_name, last_name, userEmail]
    );

    const [updated] = await db.query(
      `SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?`,
      [userEmail]
    );

    res.status(200).json({
      status: 0,
      message: "Update Profile berhasil",
      data: updated[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

exports.updateProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 102,
      message: "Format Image tidak sesuai",
      data: null,
    });
  }

  const email = req.user.email;
  const imagePath = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  try {
    await db.query(`UPDATE users SET profile_image = ? WHERE email = ?`, [
      imagePath,
      email,
    ]);

    const [userData] = await db.query(
      `SELECT email, first_name, last_name, profile_image FROM users WHERE email = ?`,
      [email]
    );

    res.status(200).json({
      status: 0,
      message: "Update Profile Image berhasil",
      data: userData[0],
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: 500, message: "Internal Server Error", data: null });
  }
};
