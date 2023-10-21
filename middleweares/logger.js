const logger = (req, res, next) => {
	const { url, ip, method } = req;

	console.log(
		`${new Date().toISOString()} Effettuata richiesta ${method} all'endpoint ${url} da ip ${ip}`
	);

	next();
};

module.exports = logger;
