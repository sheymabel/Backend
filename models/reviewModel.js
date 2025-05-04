const { db } = require('../config/firebase');  // Import Firebase config

// Define the structure of the review
class Review {
  constructor(businessId, travelerId, rating, comment) {
    this.businessId = businessId;
    this.travelerId = travelerId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = null;  // Timestamp will be set when saved to Firestore
  }

  // Save the review to Firestore
  async save() {
    try {
      const reviewRef = db.collection('reviews').doc();  // Generate new document reference
      this.createdAt = new Date();  // Set the createdAt field with the current date
      const reviewData = {
        businessId: this.businessId,
        travelerId: this.travelerId,
        rating: this.rating,
        comment: this.comment,
        createdAt: this.createdAt,
      };

      // Add the review to the "reviews" collection
      await reviewRef.set(reviewData);

      // Optionally, link the review to the business profile by adding its ID to the business document
      await db.collection('businesses').doc(this.businessId).update({
        reviews: db.FieldValue.arrayUnion(reviewRef.id),  // Add review ID to the business profile's reviews array
      });

      return { success: true, message: 'Review added successfully', reviewData };
    } catch (error) {
      return { success: false, message: 'Error adding review', error: error.message };
    }
  }

  // Retrieve all reviews for a given business
  static async getReviewsByBusiness(businessId) {
    try {
      const reviewsSnapshot = await db.collection('reviews').where('businessId', '==', businessId).get();
      if (reviewsSnapshot.empty) {
        return { success: false, message: 'No reviews found for this business' };
      }

      const reviews = reviewsSnapshot.docs.map(doc => doc.data());
      return { success: true, data: reviews };
    } catch (error) {
      return { success: false, message: 'Error fetching reviews', error: error.message };
    }
  }

  // Update an existing review by its ID
  static async updateReview(reviewId, updatedData) {
    try {
      const reviewRef = db.collection('reviews').doc(reviewId);
      await reviewRef.update(updatedData);

      return { success: true, message: 'Review updated successfully' };
    } catch (error) {
      return { success: false, message: 'Error updating review', error: error.message };
    }
  }

  // Delete a review by its ID
  static async deleteReview(reviewId) {
    try {
      await db.collection('reviews').doc(reviewId).delete();
      return { success: true, message: 'Review deleted successfully' };
    } catch (error) {
      return { success: false, message: 'Error deleting review', error: error.message };
    }
  }
}

module.exports = Review;
