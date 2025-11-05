const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const {
  getProfile,
  updateProfile,
  updateProfileImage,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/registration", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile/update", authMiddleware, updateProfile);
router.put(
  "/profile/image",
  authMiddleware,
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err) {
        // Jika error karena format file tidak sesuai
        if (err.message === "FORMAT_IMAGE_INVALID") {
          return res.status(400).json({
            status: 102,
            message: "Format Image tidak sesuai",
            data: null,
          });
        }
        // Error lain
        return res.status(500).json({
          status: 500,
          message: err.message || "Upload gagal",
          data: null,
        });
      }

      next();
    });
  },
  updateProfileImage
);

module.exports = router;
