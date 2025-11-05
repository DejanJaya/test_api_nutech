const db = require("../config/db");

const generateInvoice = async () => {
  const today = new Date();
  const dateString = `${String(today.getDate()).padStart(2, "0")}${String(
    today.getMonth() + 1
  ).padStart(2, "0")}${today.getFullYear()}`;

  // Cari invoice terakhir di tanggal ini
  const [rows] = await db.query(
    "SELECT invoice_number FROM transactions WHERE invoice_number LIKE ? ORDER BY invoice_number DESC LIMIT 1",
    [`INV${dateString}%`]
  );

  if (rows.length === 0) {
    return `INV${dateString}-001`;
  } else {
    // Ambil nomor urut terakhir
    const lastNumber = rows[0].invoice_number.split("-")[1];
    const nextNumber = String(parseInt(lastNumber) + 1).padStart(3, "0");
    return `INV${dateString}-${nextNumber}`;
  }
};

exports.topUpBalance = async (req, res) => {
  const email = req.user.email; // email dari JWT
  const { top_up_amount } = req.body;

  try {
    // Validasi input
    if (
      top_up_amount === undefined ||
      isNaN(top_up_amount) ||
      top_up_amount < 0
    ) {
      return res.status(400).json({
        status: 102,
        message:
          "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        data: null,
      });
    }

    // data user
    const [user] = await db.query(
      "SELECT id, balance FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    const userId = user[0].id;
    const newBalance = user[0].balance + parseInt(top_up_amount);

    // Update saldo user
    await db.query("UPDATE users SET balance = ? WHERE id = ?", [
      newBalance,
      userId,
    ]);

    const invoice = await generateInvoice();

    // Simpan ke table transactions
    await db.query(
      "INSERT INTO transactions (user_id, transaction_type, total_amount,invoice_number, description) VALUES (?, 'TOPUP', ?, ?,?)",
      [userId, top_up_amount, invoice, "Top Up balance"]
    );

    //  Response sukses
    return res.status(200).json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: {
        balance: newBalance,
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

exports.postTransaction = async (req, res) => {
  const userId = req.user.id;
  const { service_code } = req.body;

  try {
    // 1. Cek service
    const [serviceRows] = await db.query(
      "SELECT * FROM services WHERE service_code = ?",
      [service_code]
    );
    if (serviceRows.length === 0) {
      return res.status(400).json({
        status: 102,
        message: "Service atau Layanan tidak ditemukan",
        data: null,
      });
    }
    const service = serviceRows[0];

    // 2. Ambil saldo user
    const [userRows] = await db.query(
      "SELECT id, balance FROM users WHERE id = ?",
      [userId]
    );
    if (userRows.length === 0) {
      return res.status(401).json({
        status: 108,
        message: "User tidak ditemukan atau token tidak valid",
        data: null,
      });
    }

    const user = userRows[0];

    // 3. Cek saldo cukup
    if (user.balance < service.service_tariff) {
      return res.status(400).json({
        status: 102,
        message: "Saldo tidak mencukupi",
        data: null,
      });
    }

    // 4. Kurangi saldo user
    const newBalance = user.balance - service.service_tariff;
    await db.query("UPDATE users SET balance = ? WHERE id = ?", [
      newBalance,
      userId,
    ]);

    // 5. Simpan transaksi
    const invoice = await generateInvoice();
    const created_on = new Date();

    await db.query(
      `INSERT INTO transactions 
        (user_id, service_code, service_name, transaction_type, total_amount, invoice_number,description, created_on)
       VALUES (?, ?, ?, 'PAYMENT', ?, ?, ?,?)`,
      [
        userId,
        service.service_code,
        service.service_name,
        service.service_tariff,
        invoice,
        service.service_name,
        created_on,
      ]
    );

    // 6. Response sukses
    return res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number: invoice,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: "PAYMENT",
        total_amount: service.service_tariff,
        created_on,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
      data: null,
    });
  }
};

exports.getTransactionHistory = async (req, res) => {
  const userId = req.user.id;
  let { offset = 0, limit } = req.query;

  offset = parseInt(offset);
  limit = limit ? parseInt(limit) : null;

  try {
    // Jika limit dikirim  pakai LIMIT & OFFSET
    let query = `
      SELECT invoice_number, transaction_type, description, total_amount, created_on
      FROM transactions
      WHERE user_id = ?
      ORDER BY invoice_number ASC
    `;

    let params = [userId];

    if (limit !== null) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);
    }

    const [records] = await db.query(query, params);

    return res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset: offset,
        limit: limit || records.length,
        records: records,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
      data: null,
    });
  }
};
