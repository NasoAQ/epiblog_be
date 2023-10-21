const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
	{
		nome: {
			type: String,
			required: true,
		},
		cognome: {
			type: String,
			required: true,
		},
		dataDiNascita: {
			type: String,
			required: false,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			require: true,
		},
		avatar: {
			type: String,
			required: false,
			default:
				"https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU=",
		},
	},
	{ timestamps: true, strict: true }
);

module.exports = mongoose.model("Author", authorSchema, "authors");
