const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		category: {
			type: String,
			required: false,
			default: "General",
		},
		title: {
			type: String,
			required: true,
		},
		cover: {
			type: String,
			required: false,
			default:
				"https://cms-assets.tutsplus.com/cdn-cgi/image/width=850/uploads/users/30/posts/21015/image/picture.png",
		},
		readTime: {
			value: {
				type: Number,
				required: false,
			},
			unit: {
				type: String,
				required: false,
				enum: ["views", "hours", "quarti"],
			},
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Author",
		},
		content: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true, strict: true }
);

module.exports = mongoose.model("postModel", PostSchema, "posts");
