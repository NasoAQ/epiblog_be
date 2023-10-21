const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
	const token = req.header("Authorization");

	if (!token) {
		return res.status(401).send({
			errorType: "Token non presente",
			statusCode: 401,
			message:
				"Per poter utilizzare il servizio è necessario un token di accesso",
		});
	}

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	} catch (e) {
		res.status(403).send({
			errorType: "Token error",
			statusCode: 403,
			message: "Il token è scaduto o non valido",
		});
	}
};
