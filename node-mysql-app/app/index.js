const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "mysql", // service name trong docker-compose.yml
  user: "user",
  password: "password",
  database: "mydb",
});

connection.connect((error) => {
  if (error) {
    console.error("Kết nối MySQL thất bại:", error);
    return;
  }
  console.log("✅ Đã kết nối MySQL thành công!");

  connection.query("SELECT NOW()", (err, results) => {
    if (err) throw err;
    console.log("Thời gian hiện tại từ DB:", results[0]);
    connection.end();
  });
});
