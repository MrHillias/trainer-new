const express = require("express");
const User = require("../Models/User");

const router = express.Router();

router.get("/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { confirmationToken: token } });

    if (!user) {
      return res.status(400).json({ error: "Неверный или устаревший токен." });
    }

    user.isConfirmed = true;
    user.confirmationToken = null;
    await user.save();

    res.json({ message: "Email успешно подтвержден!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
