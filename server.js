const mysql = require("mysql");
const express = require("express");
const app = express();
const cors = require("cors");
const util = require("util");
const crypto = require("crypto");
const fs = require('fs')

app.use(express.json());
app.use(
  cors({
    credentials: true,
    headers: "*",
    origin: "*",
    methods: "*",
  })
);

const con = mysql.createConnection({
  host: "frpro2.fcomet.com",
  user: "auraxium_440group",
  password: "im696fz3OG2g",
  database: "auraxium_440",
});

const query = util.promisify(con.query).bind(con);

app.get("/reinit", async (req, res) => {
  let init = JSON.parse(fs.readFileSync('./init.json', 'utf8'))
	await query("DELETE FROM user")

	for (let i = 0; i < init.tuples.length; i++) {
		const {username, password, firstname, lastname, email} = init.tuples[i];

		let salted = "dfjhg584967y98ehg75498y" + password + "fdsjghiuo54jyi";
		let hashed = crypto.createHash("sha512").update(salted).digest("hex");

		await query(
			"INSERT INTO user(username,password,firstName,lastName,email) VALUES ( ?,?,?,?,?)",
			[username, hashed, firstname, lastname, email]
		);
	}
	res.end()
});

app.post("/signin", async (req, res) => {
  let { username, password } = req.body;

  if (!username || !password) return res.status(400).send("fill all fields");

  let result = await query(
    `select * from user where username = '${username}' limit 1`
  ).catch((err) => {
    return { error: "Query failed" };
  });

  if (result.error) return res.staus(500).send("Query failed");
  if (result.length == 0) return res.status(400).send("wrong username or password!");

  let salted = "dfjhg584967y98ehg75498y" + password + "fdsjghiuo54jyi";
  let hashed = crypto.createHash("sha512").update(salted).digest("hex");

  if (result[0]["password"] != hashed) return res.status(403).send("wrong username or password!");

  if (!res.headersSent) res.status(200).send('Signin successful');
});

app.post("/signup", async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;

	//check username taken
	let result = await query(
    `SELECT username FROM user WHERE username = '${username}' limit 1`
  ).catch((err) => {
    return { error: "Query failed" };
  });

  if (result.error) return res.status(500).send(result.error);
  if (result.length > 0) return res.status(400).send("Username taken");

	//check email taken
  result = await query(
    `SELECT email FROM user WHERE email = '${email}' limit 1`
  ).catch((err) => {
    return { error: "Query failed" };
  });

  if (result.error) return res.status(500).send(result.error);
  if (result.length > 0) return res.status(400).send("Email already in use");

	//hash and store
  let salted = "dfjhg584967y98ehg75498y" + password + "fdsjghiuo54jyi";
  let hashed = crypto.createHash("sha512").update(salted).digest("hex");

  await query(
    "INSERT INTO user(username,password,firstName,lastName,email) VALUES ( ?,?,?,?,?)",
    [username, hashed, firstname, lastname, email]
  );

  if (!res.headersSent) res.status(200).send('Signup successful');
});

con.connect(function (err) {
  if (err) throw err;
  console.log("connected to db");
});

app.listen(3001, () => {
  console.log("running server");
});
