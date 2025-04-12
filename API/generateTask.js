import express from "express";
import generateRandomTask from "../Generate/generator.js";

const router = express.Router();

router.get("/generate", async (req, res) => {
  try {
    const task = await generateRandomTask();
    res.json(task);
  } catch (error) {
    console.error("Ошибка при генерации задания:", error);
    res.status(500).json({ error: "Не удалось сгенерировать задание" });
  }
});

export default router;
