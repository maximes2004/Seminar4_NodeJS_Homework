const express = require("express"); // Подключаем Express
const bodyParser = require("body-parser"); // Подключаем body-parser для обработки JSON запросов
const fs = require("fs"); // Подключаем файловую систему для работы с файлами

const app = express(); // Создаем приложение Express
const PORT = 3000; // Устанавливаем порт сервера

app.use(bodyParser.json()); // Используем body-parser для обработки JSON запросов

const USERS_FILE = "./users.json"; // Путь к файлу для хранения данных пользователей

// Функция для чтения данных из файла
const readUsersFromFile = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// Функция для записи данных в файл
const writeUsersToFile = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));
};

// Обработчик для получения всех пользователей
app.get("/users", (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
});

// Обработчик для получения пользователя по ID
app.get("/users/:id", (req, res) => {
  const users = readUsersFromFile();
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Обработчик для создания нового пользователя
app.post("/users", (req, res) => {
  const users = readUsersFromFile();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    ...req.body,
  };
  users.push(newUser);
  writeUsersToFile(users);
  res.status(201).json(newUser);
});

// Обработчик для обновления пользователя по ID
app.put("/users/:id", (req, res) => {
  const users = readUsersFromFile();
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index !== -1) {
    users[index] = { id: parseInt(req.params.id), ...req.body };
    writeUsersToFile(users);
    res.json(users[index]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Обработчик для удаления пользователя по ID
app.delete("/users/:id", (req, res) => {
  let users = readUsersFromFile();
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index !== -1) {
    users = users.filter((u) => u.id !== parseInt(req.params.id));
    writeUsersToFile(users);
    res.json({ message: "User deleted" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
