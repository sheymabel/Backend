const { Timestamp } = require("firebase-admin/firestore");
const { Category } = require("./Category");

/**
 * @typedef {Object} Business
 * @property {string} uid
 * @property {string} fullName
 * @property {string} email
 * @property {string} phone
 * @property {string} address
 * @property {string} description
 * @property {Category} category
 * @property {'business'} role
 * @property {Timestamp} createdAt
 */
class Business {
  constructor({
    uid,
    fullName,
    email,
    phone,
    address,
    description,
    category,
    createdAt = new Date(),
  }) {
    this.uid = uid || null;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.description = description;
    this.category = category;
    this.createdAt = createdAt; // Default to current date
  }

  // Example of validation
  validate() {
    if (!this.fullName || !this.email || !this.phone || !this.address) {
      throw new Error("Missing required fields: fullName, email, phone, or address");
    }
    return true;
  }
}

module.exports = { Business };
module.exports.Business = Business;
module.exports.BusinessSchema = {
  uid: "string",
  fullName: "string",
  email: "string",
  phone: "string",
  address: "string",
  description: "string",
  category: Category,
  createdAt: Timestamp,
};