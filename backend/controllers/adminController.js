const Lab = require('../models/labModel');
const User = require('../models/userModel');

// Add a new lab
exports.addLab = async (req, res) => {
  const { labCode, labName, labDescription, labClientsCount, labLock } = req.body;

  try {
    const newLab = new Lab({
      labCode,
      labName,
      labDescription,
      labClientsCount,
      labLock,
    });

    await newLab.save();
    res.status(201).json({ message: 'Lab added successfully', lab: newLab });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all labs
exports.getLabs = async (req, res) => {
  try {
    const labs = await Lab.find();
    res.status(200).json({ labs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove a lab
exports.removeLab = async (req, res) => {
  const { labCode } = req.params;

  try {
    const deletedLab = await Lab.findOneAndDelete({ labCode });

    if (!deletedLab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    res.status(200).json({ message: 'Lab removed successfully', lab: deletedLab });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users (for management)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLab = async (req, res) => {
  const labId = req.params.labId;

  try {
    // console.log("Fetching lab with ID:", labId);
    const lab = await Lab.findById(labId);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });
    res.status(200).json({ lab });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.editLab = async (req, res) => {
  const { labName, labDescription, labClientsCount, labLock } = req.body;
  const labId = req.params.labId;

  try {
    const lab = await Lab.findById(labId);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });

    // if (labCode !== undefined) lab.labCode = labCode;
    if (labName !== undefined) lab.labName = labName;
    if (labDescription !== undefined) lab.labDescription = labDescription;
    if (labClientsCount !== undefined) lab.labClientsCount = labClientsCount;
    if (labLock !== undefined) lab.labLock = labLock;

    await lab.save();
    res.status(200).json({ message: 'Lab updated successfully', lab });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.forceLabReset = async (req, res) => {
  const labCode = req.body.labCode;

  try {
    const lab = await Lab.updateOne({ labCode }, { $set: { labLock: false, labClientsCount: 0 } });
    if (!lab) return res.status(404).json({ message: 'Lab not found' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  res.status(200).json({ message: 'Lab reset successfully' });
}