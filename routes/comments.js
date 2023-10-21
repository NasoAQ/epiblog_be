const express = require("express");
const commentModel = require("../models/comment");
const postModel = require("../models/post");
const comments = express.Router();

//Rotta per ricevere i commenti di un singolo post
comments.get("/posts/byId/:id/comments", async (req, res) => {
	const { id } = req.params;
	try {
		const post = await postModel.findById(id);
		console.log(post);

		if (!post) {
			return res.status(404).json({
				statusCode: 404,
				message: "Post non trovato",
			});
		}
		const comments = await commentModel.find({ post: id });

		console.log(comments);

		if (!comments || comments.length === 0) {
			return res.status(404).json({
				statusCode: 404,
				message: "Nessun commento per questo post",
			});
		}

		res.status(200).json({
			statusCode: 200,
			comments,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Errore interno",
			error,
		});
	}
});

//Rotta per creare un commento
comments.post("/posts/byId/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const post = await postModel.findById(id);
		if (!post) {
			return res.status(404).json({
				statusCode: 404,
				message: "Post non trovato",
			});
		}

		const { comment, rate } = req.body;
		const newComment = new commentModel({
			comment,
			rate,
			post: id,
		});

		const savedComment = await newComment.save();
		res.status(201).send({
			statusCode: 201,
			message: "commento creato",
			payload: savedComment,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Errore durante la creazione del commento",
			error,
		});
	}
});

//Rotta per cercare un singolo commento di un singolo post
comments.get("/posts/byId/:id/comments/:commentId", async (req, res) => {
	const { id, commentId } = req.params;
	try {
		const post = await postModel.findById(id);
		if (!post) {
			return res.status(404).json({
				statusCode: 404,
				message: "Post non trovato",
			});
		}
		const comment = await commentModel.findOne({ _id: commentId, post: id });
		console.log(comment);
		if (!comment) {
			return res.status(404).json({
				statusCode: 404,
				message: "Commento non trovato per questo post",
			});
		}
		res.status(200).send({
			statusCode: 200,
			comment,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Errore interno",
			error,
		});
	}
});

//Rotta per cancellare un commento
comments.delete("/posts/byId/:id/comments/:commentId", async (req, res) => {
	const { id, commentId } = req.params;
	try {
		const post = await postModel.findById(id);
		if (!post) {
			return res.status(404).json({
				statusCode: 404,
				message: "Post non trovato",
			});
		}
		const comment = await commentModel.findOne({ _id: commentId, post: id });
		console.log(comment);
		if (!comment) {
			return res.status(404).json({
				statusCode: 404,
				message: "Commento non trovato per questo post",
			});
		}
		await commentModel.findByIdAndDelete(commentId);
		res.status(200).send({
			statusCode: 200,
			message: "Commento eliminato correttamente",
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Errore interno",
			error,
		});
	}
});

//Rotta per modificare un commento di un post
comments.put("/posts/byId/:id/comments/:commentId", async (req, res) => {
	const { id, commentId } = req.params;
	try {
		const post = await postModel.findById(id);
		if (!post) {
			return res.status(404).json({
				statusCode: 404,
				message: "Post non trovato",
			});
		}
		const comment = await commentModel.findOne({ _id: commentId, post: id });
		console.log(comment);
		if (!comment) {
			return res.status(404).json({
				statusCode: 404,
				message: "Commento non trovato per questo post",
			});
		}
		const { Comment, rate } = req.body;

		await commentModel.findByIdAndUpdate(commentId, { Comment, rate });
		const updatedComment = await commentModel.findById(commentId);

		res.status(200).send({
			statusCode: 200,
			updatedComment,
		});
	} catch (error) {
		res.status(500).send({
			statusCode: 500,
			message: "Errore interno",
			error,
		});
	}
});
module.exports = comments;
