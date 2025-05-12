const { db } = require('./../config/firebase');

// adminController.js

// Update Admin Profile
exports.updateAdminProfile = async (req, res) => {
  const { adminId, firstName, lastName, email, password } = req.body;

  // Check for missing fields
  if (!adminId || !firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Fetch admin data from the database
    const adminRef = db.collection('Admin').doc(adminId);

    // Fetch existing admin data
    const adminDoc = await adminRef.get();
    if (!adminDoc.exists) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Hash the password before updating
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the admin profile with new data
    const updatedAdmin = {
      firstName,
      lastName,
      email,
      password: hashedPassword,  // Store the hashed password
    };

    // Update the database with new data
    await adminRef.update(updatedAdmin);

    res.status(200).json({ message: 'Admin profile updated successfully', admin: updatedAdmin });

  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Admin Create Traveler
exports.createTraveler = async (req, res) => {
  const travelerData = req.body;  // Data from request body
  try {
    const travelerRef = db.collection('Travler').doc(); // Create a new document in the "Travler" collection
    await travelerRef.set(travelerData); // Save data to Firestore
    res.status(201).json({ message: 'Traveler created successfully', id: travelerRef.id });
  } catch (error) {
    console.error('Error creating traveler:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin Create Business
exports.createBusiness = async (req, res) => {
  const businessData = req.body;
  try {
    const businessRef = db.collection('business').doc();
    await businessRef.set(businessData);
    res.status(201).json({ message: 'Business created successfully', id: businessRef.id });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Admin Get Traveler by UID
exports.getTravelerByUid = async (req, res) => {
  const { uid } = req.params;
  try {
    const travelerDoc = await db.collection('Travler').doc(uid).get();
    if (travelerDoc.exists) {
      res.status(200).json(travelerDoc.data());
    } else {
      res.status(404).json({ message: 'Traveler not found' });
    }
  } catch (error) {
    console.error('Error fetching traveler:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
// Admin Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch Travelers
    const travelersSnapshot = await db.collection('Travler').get();
    const travelers = travelersSnapshot.docs.map(doc => ({
      id: doc.id,
            ...doc.data()
    }));

    // Fetch Businesses
    const businessesSnapshot = await db.collection('business').get();
    const businesses = businessesSnapshot.docs.map(doc => ({
      id: doc.id,
      role: 'Business',
      ...doc.data()
    }));
// Admin Get All Travelers
exports.getAllTravelers = async (req, res) => {
  try {
    const travelersSnapshot = await db.collection('Travler').get();
    if (travelersSnapshot.empty) {
      return res.status(404).json({ message: 'No travelers found' });
    }

    const travelers = travelersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(travelers);
  } catch (error) {
    console.error('Error fetching travelers:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
// Admin Get All Businesses
exports.getAllBusinesses = async (req, res) => {
  try {
    const businessesSnapshot = await db.collection('business').get();
    if (businessesSnapshot.empty) {
      return res.status(404).json({ message: 'No businesses found' });
    }

    const businesses = businessesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

    // Combine and return all users
    const allUsers = [...travelers, ...businesses];

    if (allUsers.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};



// Admin Get Business by UID
exports.getBusinessByUid = async (req, res) => {
  const { uid } = req.params;
  try {
    // Correction : Accéder à la collection 'business' et non 'Travler'
    const businessDoc = await db.collection('business').doc(uid).get();
    if (businessDoc.exists) {
      res.status(200).json(businessDoc.data());
    } else {
      res.status(404).json({ message: 'Business not found' });
    }
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Admin Update Traveler
exports.updateTraveler = async (req, res) => {
  const { uid } = req.params;
  const updatedData = req.body;
  try {
    const travelerRef = db.collection('Travler').doc(uid);
    await travelerRef.update(updatedData);
    res.status(200).json({ message: 'Traveler updated successfully' });
  } catch (error) {
    console.error('Error updating traveler:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Admin Update Business
exports.updateBusiness = async (req, res) => {
  const { uid } = req.params;
  const updatedData = req.body;
  try {
    const businessRef = db.collection('business').doc(uid);
    await businessRef.update(updatedData);
    res.status(200).json({ message: 'Business updated successfully' });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Admin Delete Traveler
exports.deleteTraveler = async (req, res) => {
  const { uid } = req.params;
  try {
    const travelerRef = db.collection('Travler').doc(uid);
    await travelerRef.delete();
    res.status(200).json({ message: 'Traveler deleted successfully' });
  } catch (error) {
    console.error('Error deleting traveler:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Admin Delete Business
exports.deleteBusiness = async (req, res) => {
  const { uid } = req.params;
  try {
    const businessRef = db.collection('business').doc(uid);
    await businessRef.delete();
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
// Admin Get All Travelers
exports.getAllTravelers = async (req, res) => {
  try {
    const travelersSnapshot = await db.collection('Travler').get();
    if (travelersSnapshot.empty) {
      return res.status(404).json({ message: 'No travelers found' });
    }

    const travelers = travelersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(travelers);
  } catch (error) {
    console.error('Error fetching travelers:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Admin Get All Businesses
exports.getAllBusinesses = async (req, res) => {
  try {
    const businessesSnapshot = await db.collection('business').get();
    if (businessesSnapshot.empty) {
      return res.status(404).json({ message: 'No businesses found' });
    }

    const businesses = businessesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
