const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Отсутствует токен авторизации" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Добавляем данные пользователя в объект запроса
    next();
  } catch (error) {
    return res.status(403).json({ error: "Неверный или истекший токен" });
  }
};
module.exports = authMiddleware;
