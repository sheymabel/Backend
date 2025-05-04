// models/travelerModel.js

export class Travler {
    constructor({ id, name, email, phoneNumber, createdAt, updatedAt }) {
      this.id = id || null;
      this.name = name;
      this.email = email;
      this.phoneNumber = phoneNumber;
this.role =  "traveler"; // Default role is 'traveler'
      this.createdAt = createdAt || new Date();
      this.updatedAt = updatedAt || new Date();
    }
  }
  