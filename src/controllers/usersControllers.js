const User = require("../models/user");

exports.searchUsers = async (req, res) => {
  try {
    const searchString = req.query.searchString
      ? req.query.searchString.toLowerCase()
      : "";
    const minAge = req.query.minAge ? parseInt(req.query.minAge) : undefined;
    const maxAge = req.query.maxAge ? parseInt(req.query.maxAge) : undefined;
    const city = req.query.city ? req.query.city : undefined;
    const users = await User.searchUsers(searchString, minAge, maxAge, city);

    const modifiedUsers = users.map((user) => ({
      ...user,
      birthdate: user.birthdate.toISOString().split("T")[0],
    }));

    res.json(modifiedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while searching users" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = req.body;

    // Validations
    if (!userData.first_name || !userData.last_name) {
      return res
        .status(400)
        .json({ error: "First name and last name are mandatory" });
    }

    if (!userData.email || !userData.mobile_number) {
      return res
        .status(400)
        .json({ error: "Email and mobile number are mandatory" });
    }

    const existingUser = await User.getUserByEmailOrMobile(
      userData.email,
      userData.mobile_number
    );
    if (existingUser && existingUser.user_id !== userId) {
      return res
        .status(400)
        .json({ error: "Email or mobile number already exists" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(userData.mobile_number)) {
      return res.status(400).json({ error: "Invalid mobile number format" });
    }

    if (!userData.address || userData.address.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one address is mandatory" });
    }

    if (
      userData.address.pincode.length < 4 ||
      userData.address.pincode.length > 6
    ) {
      return res
        .status(400)
        .json({ error: "Pincode should be between 4 and 6 digits" });
    }

    // Update user information
    const updatedUser = await User.updateUser(userId, userData);

    updatedUser.birthdate = updatedUser.birthdate.toISOString().split("T")[0];
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating user information" });
  }
};
