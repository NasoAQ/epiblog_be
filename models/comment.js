const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
	{
		comment: {
			type: String,
			require: true,
		},
		rate: {
			type: Number,
			require: true,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "postModel",
		},
	},
	{ timestamps: true, strict: true }
);

module.exports = mongoose.model("commentModel", CommentSchema, "comments");
