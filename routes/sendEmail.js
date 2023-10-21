const express = require("express");
const { createTransport } = require("nodemailer");
const email = express.Router();

const transporter = createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "veronica.feil@ethereal.email",
		pass: "ncQAQ7Sg5d75uGaMHu",
	},
});

email.post("/send-email", async (req, res) => {
	const { recipient, subject, text } = req.body;
	const mailOptions = {
		from: "nasoAQ@gmail.com",
		to: "veronica.feil@ethereal.email",
		subject,
		text,
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
			res.status(500).send("Errore invio mail");
		} else {
			console.log("Mail inviata");
			res.status(200).send("Mail inviata correttamente");
		}
	});
});

module.exports = email;
