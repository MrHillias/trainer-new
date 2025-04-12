const express = require("express");
const router = express.Router();
const generateRandomTask = require("../Generate/generator.js");

router.get("/generate", async (req, res) => {
  try {
    const task = await generateRandomTask();
    res.json(task);
  } catch (error) {
    console.error("Ошибка при генерации задания:", error);
    res.status(500).json({ error: "Ошибка при генерации задания" });
  }
});

module.exports = router;
