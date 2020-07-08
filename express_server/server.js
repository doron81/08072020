const express = require("express");

const db = require("./src/db/database");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	if (req.method === "OPTION") {
		res.header(
			"Access-Control-Allow-Methods",
			"GET,POST,PUT,DELETE,PATCH"
		);
		return res.status(200).json({});
	}
	next();
});
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // keep this if your api accepts cross-origin requests
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, X-Access-Token"
	);
	next();
});
// Enable CORS in development
// app.use((req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header(
// 		"Access-Control-Allow-Headers",
// 		"Origin, X-Requested-With, Content-Type, Accept"
// 	);
// 	next();
// });

// app.use(function (req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
// 	res.header(
// 		"Access-Control-Allow-Headers",
// 		"Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With"
// 	);
// 	next();
// });

const jwt = require("jsonwebtoken");
const jwtKey = "my_secret_key";
const jwtExpirySeconds = 60 * 60;

const bcrypt = require("bcryptjs");
const { check, body, validationResult, Result } = require("express-validator");

const findByEmail = async (email) => {
	const result = await new Promise(function (resolve, reject) {
		db.all(
			`select username from user where email=(?)`,
			[email],
			(err, rows) => {
				if (err) {
					reject(false);
				} else if (Array.isArray(rows) && rows.length > 0) {
					resolve(true);
				} else {
					resolve(false);
				}
			}
		);
	});
	console.log(result , "findByEmail");
	return result;
};

const findByUser = async (user) => {
	const result = await new Promise(function (resolve, reject) {
		db.all(
			`select username from user where username=(?)`,
			[user],
			(err, rows) => {
				if (err) {
					reject(false);
				} else if (Array.isArray(rows) && rows.length > 0) {
					resolve(true);
				} else {
					resolve(false);
				}
			}
		);
	});
	console.log(result , "findByUser");
	return result;
};

app.post(
	"/api/auth/signup",
	[
		check("username").custom(async(value) => {
			const res = await findByUser(value);
			if (res) {
				throw new Error("Username is already in use");
			} else {
				return true;
			}
		}),
		check("email").custom(async(value) => {
			const res = await findByEmail(value);
			if (res) {
				throw new Error("E-mail already in use");
			} else {
				return true;
			}
		}),
		check("email").isEmail().withMessage("must be in form of email"),
		check("password")
			.isLength({ min: 5 })
			.withMessage("must be at least 5 chars long")
			.matches(/\d/)
			.withMessage("must contain a number"),

		check("username")
			.isLength({ min: 5 })
			.withMessage("Username must be at least 5 chars long"),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(200).json({ errors: errors.array() });
		}
		const { username, password, email } = req.body;
		bcrypt.hash(password, 10, function (err, hash) {
			db.run(
				`INSERT INTO user(username,email,password) VALUES(?,?,?)`,
				[username, email, hash],
				function (err) {
					if (err) {
						res.status(200).json({
							success: "false",
							msg: err.message,
						});
						return console.log(err.message);
					}
					// get the last insert id
					console.log(
						`A row has been inserted with rowid ${this.lastID}`
					);
					const token = jwt.sign({ username }, jwtKey, {
						algorithm: "HS256",
						expiresIn: jwtExpirySeconds,
					});

					res.status(200).json({
						success: "true",
						token,
					});
				}
			);
		});
	}
);

app.post("/api/auth/signin", (req, res) => {
	selfRes = res;
	const { username, password } = req.body;
	db.get(
		`select password from user where username=(?)`,
		[username],
		(err, row) => {
			console.log(err,row) 
			if (err) {
				selfRes.status(200).send({
					success: "false",
					msg: err.message,
				});
			}else if (err === null && row === undefined){
				selfRes.status(200).send({
					success: "false",
					msg: "password or email is invalid",
				});
			} else {
				bcrypt.compare(password, row.password, function (err, res) {
					if (res == true) {
						const token = jwt.sign({ username }, jwtKey, {
							algorithm: "HS256",
							expiresIn: jwtExpirySeconds,
						});
						selfRes.status(200).send({
							success: "true",
							token,
						});
					} else {
						selfRes.status(200).send({
							success: "false",
							msg: "password or email is invalid",
						});
					}
				});
			}
		}
	);
});
app.options("/", (req, res) => res.send());

app.get("/api/candidates", (req, res) => {
	// verify a token symmetric
	const token =
		(req.body && req.body.access_token) ||
		(req.query && req.query.access_token) ||
		req.headers["x-access-token"];
	jwt.verify(token, jwtKey, function (err, decoded) {
		if (err) {
			res.status(200).send({
				success: "false",
				msg: err.message,
			});
		} else {
			db.all(`select * from candidate`, (err, rows) => {
				if (err) {
					res.status(200).json({
						success: "false",
						msg: err.message,
					});
				} else {
					res.status(200).json({
						success: "true",
						candidates: rows,
					});
				}
			});
		}
	});
});

// set port, listen for requests
const PORT = 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
