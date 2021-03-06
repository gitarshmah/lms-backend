const client = require("../config/DB");
const { v4: uuidv4 } = require("uuid");
const { Encrypt, Decrypt } = require("../securityConfig/crypto");
const { getToken } = require("../securityConfig/jwt");
const getUsers = async (req, res, next) => {
  const query = `select * from teachers`;
  console.log(client);
  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  const queryStudent = `select * from students where email = '${email}'`;
  const queryTeacher = `select * from teachers where email = '${email}'`;
  try {
    const resultStudent = await client.query(queryStudent);
    const resultTeacher = await client.query(queryTeacher);
    if (resultStudent.rowCount > 0) {
      res.status(400).json({ message: "Email already used by a student" });
    } else if (resultTeacher.rowCount > 0) {
      res.status(400).json({ message: "Email already used by a teacher" });
    } else {
      const passwordEncrypted = await Encrypt(password);
      const query = `insert into teachers(teacher_id, name, email, password) values('${uuidv4()}', '${name}', '${email}', '${passwordEncrypted}')`;
      const result = await client.query(query);
      res.json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const query = `select * from teachers where email = '${email}'`;
  try {
    const result = await client.query(query);
    const user = result.rows[0];
    if (user) {
      const passwordDecrypted = await Decrypt(user.password);
      if (password === passwordDecrypted) {
        const token = await getToken({ userId: user.teacher_id });
        res.cookie("token", token);
        res.json({ message: "Login Successful" });
      } else {
        res.status(400).json({ message: "Invalid Password" });
      }
    } else {
      res.status(400).json({ message: "Invalid Email" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

module.exports = {
  getUsers,
  signup,
  login,
};
