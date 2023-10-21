const express = require("express");
const PostModel = require("../models/post");
const logger = require("../middleweares/logger");
const validatePost = require("../middleweares/validatePost");
const posts = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
const crypto = require("crypto");
const verifyToken = require("../middleweares/verifyToken");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "public",
		format: async (req, res) => "jpeg",
		public_id: (req, file) => file.name,
	},
});

const internalStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads"); //posizione di salvataggio
	},
	//dobbiamo risolvere il conflitto dei nomi, quindi assegniamo un nome univoco
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`; //crypto genera un randomID

		const fileExtension = file.originalname.split(".").pop(); //recuperiamo l'estensione
		cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`); //eseguiamo la callback con il titolo completo
	},
});

const upload = multer({ storage: internalStorage });
const cloudUpload = multer({ storage: cloudStorage });

posts.post(
	"/posts/cloudUpload",
	cloudUpload.single("cover"),
	async (req, res) => {
		try {
			res.status(200).json({ cover: req.file.path });
		} catch (error) {
			res.status(500).json({
				statusCode: 500,
				message: "Errore interno del server",
			});
		}
	}
);

posts.post("/posts/upload", upload.single("cover"), async (req, res) => {
	const url = `${req.protocol}://${req.get("host")}`; //rendiamo dinamico il recupero dell'url

	try {
		const imgUrl = req.file.filename; //nella req è presente il file che riceviamo dal FE
		res.status(200).json({ cover: `${url}/uploads/${imgUrl}` });
	} catch (error) {
		res.status(500).json({
			statusCode: 500,
			message: "Errore interno del server",
		});
	}
});

//Rotta per caricare una nuova immagine in un post specifico
posts.patch(
	"/posts/byId/:id/cover/",
	cloudUpload.single("cover"),
	async (req, res) => {
		try {
			const postId = req.params.id;
			const post = await PostModel.findById(postId);

			if (!post) {
				return res.status(404).json({
					statusCode: 404,
					message: "Post non trovato",
				});
			}
			const cloudinaryResponse = req.file;

			if (!cloudinaryResponse) {
				return res.status(400).json({
					statusCode: 400,
					message: "Upload immagine non riuscito",
				});
			}

			post.cover = cloudinaryResponse.secure_url;
			await post.save();
			res.status(200).json({
				statusCode: 200,
				message: "Immagine caricata con successo",
			});
		} catch (error) {
			res.status(500).json({
				statusCode: 500,
				message: "Errore interno del server",
			});
		}
	}
);

//Rotta per recuperare tutti posts
posts.get("/posts", async (req, res) => {
	const { page = 1, pageSize = 3 } = req.query;
	try {
		const posts = await PostModel.find()
			.populate("author", "nome cognome avatar")
			.limit(pageSize)
			.skip((page - 1) * pageSize);

		const totalPosts = await PostModel.count();
		res.status(200).send({
			statusCode: 200,
			currentPage: Number(page),
			totalPages: Math.ceil(totalPosts / pageSize),
			totalPosts,
			posts,
		});
	} catch (e) {
		res.status(500).send({
			statusCode: 500,
			message: "Errore interno",
			e,
		});
	}
});

//Rotta per recuperare un singolo post
posts.get("/posts/byId/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const post = await PostModel.findById(id);
		if (!post) {
			return res.status(404).send({
				statusCode: 404,
				message: "Post inesistente",
			});
		}
		res.status(200).send({
			statusCode: 200,
			post,
		});
	} catch (e) {
		res.status(500).send({
			statusCode: 500,
			message: "Errore interno",
			e,
		});
	}
});

//Rotta per creare un post
posts.post("/posts/create", validatePost, async (req, res) => {
	const newPost = new PostModel({
		category: req.body.category,
		title: req.body.title,
		cover: req.body.cover,
		readTime: {
			value: Number(req.body.readTime?.value),
			unit: req.body.readTime?.unit,
		},
		author: req.body.author,
		content: req.body.content,
	});
	try {
		const post = await newPost.save();
		res.status(201).send({
			statusCode: 201,
			message: "Post salvato correttamente",
			payload: post,
		});
	} catch (e) {
		res.status(500).send({
			statusCode: 500,
			message: "Errore interno",
			error: e,
		});
	}
});

//Rotta per modificare un post
posts.patch("/posts/update/:postId", async (req, res) => {
	const { postId } = req.params;
	const postExist = await PostModel.findById(postId);

	if (!postExist) {
		return res.status(404).send({
			statusCode: 404,
			message: "Il post non esiste",
		});
	}

	try {
		const dataToUpdate = req.body;
		const options = { new: true };
		const result = await PostModel.findByIdAndUpdate(
			postId,
			dataToUpdate,
			options
		);

		res.status(200).send({
			statusCode: 200,
			message: "Post modificato correttamente",
			result,
		});
	} catch (e) {
		res.status(500).send({
			statusCode: 500,
			message: "Errore interno",
			error: e,
		});
	}
});

//Rotta per cancellare un post
posts.delete("/posts/delete/:postId", async (req, res) => {
	const { postId } = req.params;
	try {
		const post = await PostModel.findByIdAndDelete(postId);
		if (!post) {
			return res.status(404).send({
				statusCode: 404,
				message: "Post non esistente",
			});
		}
		res.status(200).send({
			statusCode: 200,
			message: "Post eliminato correttamente",
		});
	} catch (e) {
		res.status(500).send({
			statusCode: 500,
			message: "Errore interno",
			error: e,
		});
	}
});

module.exports = posts;
