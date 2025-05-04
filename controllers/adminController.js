const { db } = require('./config/firebase');

// Admin Create Traveler
exports.createTraveler = async (req, res) => {
  const travelerData = req.body;
  try {
    const travelerRef = db.collection('travelers').doc();
    await travelerRef.set(travelerData);
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
    const businessRef = db.collection('business_owners').doc();
    await businessRef.set(businessData);
    res.status(201).json({ message: 'Business created successfully', id: businessRef.id });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin Get Traveler by UID
exports.getTravelerByUid = async (req, res) => {
  const { uid } = req.params;
  try {
    const travelerDoc = await db.collection('travelers').doc(uid).get();
    if (travelerDoc.exists) {
      res.status(200).json(travelerDoc.data());
    } else {
      res.status(404).json({ message: 'Traveler not found' });
    }
  } catch (error) {
    console.error('Error fetching traveler:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin Get Business by UID
exports.getBusinessByUid = async (req, res) => {
  const { uid } = req.params;
  try {
    const businessDoc = await db.collection('business_owners').doc(uid).get();
    if (businessDoc.exists) {
      res.status(200).json(businessDoc.data());
    } else {
      res.status(404).json({ message: 'Business not found' });
    }
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin Update Traveler
exports.updateTraveler = async (req, res) => {
  const { uid } = req.params;
  const updatedData = req.body;
  try {
    const travelerRef = db.collection('travelers').doc(uid);
    await travelerRef.update(updatedData);
    res.status(200).json({ message: 'Traveler updated successfully' });
  } catch (error) {
    console.error('Error updating traveler:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin Update Business
exports.updateBusiness = async (req, res) => {
  const { uid } = req.params;
  const updatedData = req.body;
  try {
    const businessRef = db.collection('business_owners').doc(uid);
    await businessRef.update(updatedData);
    res.status(200).json({ message: 'Business updated successfully' });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin Delete Traveler
exports.deleteTraveler = async (req, res) => {
  const { uid } = req.params;
  try {
    const travelerRef = db.collection('travelers').doc(uid);
    await travelerRef.delete();
    res.status(200).json({ message: 'Traveler deleted successfully' });
  } catch (error) {
    console.error('Error deleting traveler:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin Delete Business
exports.deleteBusiness = async (req, res) => {
  const { uid } = req.params;
  try {
    const businessRef = db.collection('business_owners').doc(uid);
    await businessRef.delete();
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
