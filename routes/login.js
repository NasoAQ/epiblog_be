const express = require("express");
const login = express.Router();
const bcrypt = require("bcrypt");
const Author = require("../models/author");
const jwt = require("jsonwebtoken");
require("dotenv").config();

login.post("/login", async (req, res) => {
	const user = await Author.findOne({ email: req.body.email });

	if (!user) {
		return res.status(404).send({
			message: "Nome utente errato o inesistente",
			statusCode: 404,
		});
	}

	const validPassword = await bcrypt.compare(req.body.password, user.password);

	if (!validPassword) {
		return res.status(404).send({
			statusCode: 404,
			message: "Email o password errati",
		});
	}

	//Generiamo il token con informazioni non private
	const token = jwt.sign(
		{
			id: user._id,
			nome: user.nome,
			cognome: user.cognome,
			dataDiNascita: user.dataDiNascita,
			email: user.email,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: 24, //dopo quanto tempo il token scadrà
		}
	);

	res.header("Authorization", token).status(200).send({
		message: "Login effettuato correttamente",
		statusCode: 200,
		token,
	});
});

module.exports = login;
