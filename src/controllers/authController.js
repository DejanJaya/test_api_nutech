const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    // 1. Validasi input
    if (!email || !first_name || !last_name || !password) {
      return res.status(400).json({
        status: 102,
        message: "Semua field wajib diisi",
        data: null,
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 102,
        message: "Parameter email tidak sesuai format",
        data: null,
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 102,
        message: "Password minimal 8 karakter",
        data: null,
      });
    }

    // 2. Cek email sudah terpakai atau belum
    const [user] = await db.execute("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length > 0) {
      return res.status(400).json({
        status: 102,
        message: "Email sudah terdaftar",
        data: null,
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert user baru
    await db.execute(
      "INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)",
      [email, first_name, last_name, hashedPassword]
    );

    // 5. Response sukses sesuai Swagger
    res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error", data: null });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validasi input kosong
    if (!email || !password) {
      return res.status(400).json({
        status: 102,
        message: "Email dan password wajib diisi",
        data: null,
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 102,
        message: "Password minimal 8 karakter",
        data: null,
      });
    }

    // 2. Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 102,
        message: "Parameter email tidak sesuai format",
        data: null,
      });
    }

    // 3. Cek user di database
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }

    const user = rows[0];

    // 4. Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }

    // 5. Generate JWT Token (expired 12 jam)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // 6. Response sukses
    res.status(200).json({
      status: 0,
      message: "Login Sukses",
      data: { token: token },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Server error", data: null });
  }
};
