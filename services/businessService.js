const admin = require("./config/firebase");
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

exports.createService = async (req, res) => {
  try {
    const data = req.body;
    data.ownerId = req.user.uid;
    data.createdAt = new Date().toISOString();

    // Validate required fields
    if (!data.name || !data.description || !data.price) {
      return res.status(400).send("Missing required fields: name, description, or price");
    }

    await db.collection("services").add(data);
    res.status(201).send("Service created");
  } catch (error) {
    console.error("Error creating service:", error.message);
    res.status(500).send("Error creating service");
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const snapshot = await db
      .collection("services")
      .where("ownerId", "==", req.user.uid)
      .get();
    const services = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(services);
  } catch (error) {
    console.error("Error getting services:", error.message);
    res.status(500).send("Error getting services");
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("services").doc(id).update(req.body);
    res.status(200).send("Service updated");
  } catch (error) {
    console.error("Error updating service:", error.message);
    res.status(500).send("Error updating service");
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("services").doc(id).delete();
    res.status(200).send("Service deleted");
  } catch (error) {
    console.error("Error deleting service:", error.message);
    res.status(500).send("Error deleting service");
  }
};

exports.respondToReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { response } = req.body;
    await db.collection("reviews").doc(reviewId).update({ response });
    res.status(200).send("Response added to review");
  } catch (error) {
    console.error("Error responding to review:", error.message);
    res.status(500).send("Error responding to review");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    await db.collection("users").doc(uid).update(req.body);
    res.status(200).send("Profile updated");
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).send("Error updating profile");
  }
};
