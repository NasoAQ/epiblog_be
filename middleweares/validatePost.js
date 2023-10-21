const validatePost = (req, res, next) => {
	const errors = [];
	const { category, title, cover, readTime, author, content } = req.body;
	/* const { value, unit } = readTime; */
	/* const { name, avatar } = author; */

	if (typeof category !== "string") {
		errors.push("Category must be a string");
	}

	if (typeof title !== "string") {
		errors.push("Title must be a string");
	}

	/* if (typeof cover !== "string") {
		errors.push("Cover must be a string");
	} */

	/* if (typeof value !== "number") {
		errors.push("Value must be a number");
	} */

	/* if (typeof unit !== "string") {
		errors.push("Unit must be a string");
	} */

	/* if (typeof name !== "string") {
		errors.push("Name must be a string");
	} */

	/* if (typeof avatar !== "string") {
		errors.push("Avatar must be a string");
	} */

	if (typeof content !== "string") {
		errors.push("Content must be a string");
	}

	if (errors.length > 0) {
		res.status(400).send({ errors });
	} else {
		next();
	}
};

module.exports = validatePost;
