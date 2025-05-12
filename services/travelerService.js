// services/travelerService.js
const db = require("./config/firebase.js");

const travelerCollection = db.collection("travler");

const TravelerService = {
  async getTravelerById(id) {
    const doc = await travelerCollection.doc(id).get();
    if (!doc.exists) throw new Error("Traveler not found");
    return { id: doc.id, ...doc.data() };
  },

  async updateTraveler(id, data) {
    const updatedData = {
      ...data,
      updatedAt: new Date(),
    };
    await travelerCollection.doc(id).set(updatedData, { merge: true });
    return this.getTravelerById(id);
  },

  async deleteTraveler(id) {
    await travelerCollection.doc(id).delete();
    return { message: `Traveler with id ${id} deleted.` };
  },
};

module.exports = TravelerService;  // Export the service using CommonJS
