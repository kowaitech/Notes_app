  require("dotenv").config();
  const express = require("express");
  const cors = require("cors");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const { MongoClient, ObjectId } = require("mongodb");

  const app = express();
  app.use(cors());
  app.use(express.json());

  const client = new MongoClient(process.env.MONGO_URI);
  let users, notes, refreshTokens;

  client.connect().then(() => {
    const db = client.db("notesApp");
    users = db.collection("users");
    notes = db.collection("notes");
    refreshTokens = db.collection("refreshTokens");
    console.log("MongoDB connected");
  });

  /* ================= TOKEN HELPERS ================= */

  const generateAccessToken = (user) =>
    jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

  const generateRefreshToken = (user) =>
    jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "3d" });

  /* ================= MIDDLEWARE ================= */

  function verifyToken(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) return res.sendStatus(401);

    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }

  /* ================= AUTH ================= */

  // REGISTER
  app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await users.insertOne({ email, password: hashed });
    res.send({ message: "Registered successfully" });
  });

  // LOGIN
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) return res.status(400).send({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send({ message: "Invalid password" });

    const payload = { id: user._id, email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await refreshTokens.insertOne({ refreshToken });

    res.send({ accessToken, refreshToken });
  });

  // REFRESH TOKEN
  app.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;
    const exists = await refreshTokens.findOne({ refreshToken });
    if (!exists) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
      });
      res.send({ accessToken });
    });
  });

  // LOGOUT
  app.post("/logout", async (req, res) => {
    const { refreshToken } = req.body;
    await refreshTokens.deleteOne({ refreshToken });
    res.send({ message: "Logged out" });
  });

  /* ================= NOTES CRUD ================= */

  // CREATE NOTE
  app.post("/notes", verifyToken, async (req, res) => {
    const note = {
      userId: req.user.id,
      title: req.body.title,
      content: req.body.content,
      createdAt: new Date(),
    };
    await notes.insertOne(note);
    res.send(note);
  });

  // READ NOTES
  app.get("/notes", verifyToken, async (req, res) => {
    const data = await notes
      .find({ userId: req.user.id })
      .toArray();
    res.send(data);
  });

  // UPDATE NOTE
  app.put("/notes/:id", verifyToken, async (req, res) => {
    await notes.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.send({ message: "Updated" });
  });

  // DELETE NOTE
  app.delete("/notes/:id", verifyToken, async (req, res) => {
    await notes.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send({ message: "Deleted" });
  });

  app.listen(process.env.PORT, () =>
    console.log("Server running on port", process.env.PORT)
  );
