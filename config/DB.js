const { Client } = require("pg");
const client = new Client(process.env.DATABASE_URL);
const connectToClient = async () => {
  try {
    await client.connect();
    // Drop DATABASE if exists lms;
    const query = `
    Drop DATABASE if exists lms;
    CREATE DATABASE IF NOT EXISTS lms;
    Use lms;
    CREATE TABLE IF NOT EXISTS teachers (
        teacher_id varchar(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        );
    CREATE TABLE IF NOT EXISTS students (
        student_id  varchar(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        );

    CREATE TABLE IF NOT EXISTS classrooms (
        classroom_id  varchar(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        teacher_id varchar(255) NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
        created_at TIMESTAMP DEFAULT NOW()
        );
    CREATE TABLE IF NOT EXISTS students_classrooms (
        student_id  varchar(255) NOT NULL,
        classroom_id  varchar(255) NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id),
        created_at TIMESTAMP DEFAULT NOW()
        );
        `;

    await client.query(query);
    console.log("DB and Tables created");
  } catch (e) {
    console.log(e);
  }
};
connectToClient();

module.exports = client;
