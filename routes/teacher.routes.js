const express = require("express");
const router = express.Router();
const { getUsers, signup, login } = require("../controllers/teacher.controller");

router.get("/get_all_users", getUsers);

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
