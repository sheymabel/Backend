// service.js
class Service {
    constructor({
      name,
      description,
      price,
      businessRef,
      category,
      imageUrl,
      duration,
      location,
      isActive = true,
      tags = [],
      rating = 0,
      reviewCount = 0,
      createdAt,
      updatedAt
    }) {
      this.name = name;
      this.description = description;
      this.price = price;
      this.businessRef = businessRef;
      this.category = category;
      this.imageUrl = imageUrl;
      this.duration = duration;
      this.location = location;
      this.isActive = isActive;
      this.tags = tags;
      this.rating = rating;
      this.reviewCount = reviewCount;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
  
  module.exports = Service;
  