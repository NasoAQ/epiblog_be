const express = require("express");
const verify = express.Router();

verify.get("/verifyToken", async (req, res) => {
	const isTokenValid = JsonWebTokenError.verify(
		req.body.sessionTokens,
		process.env.JWT_SECRET
	);
});
