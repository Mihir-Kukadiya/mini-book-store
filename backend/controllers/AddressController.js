import Address from "../models/AddressModel.js";
import Auth from "../models/AuthModel.js";

// ================= ADD ADDRESS =================
export const addAddress = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot add address" });
    }

    const count = await Address.countDocuments({ user: req.user.id });
    if (count >= 2) {
      return res
        .status(400)
        
        .json({ message: "Maximum 2 addresses allowed" });
    }

    // ✅ THIS IS THE KEY FIX
    const user = await Auth.findById(req.user.id).select("email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = await Address.create({
      user: req.user.id,
      email: user.email, // ✅ REQUIRED FIELD
      ...req.body,
    });

    res.status(201).json(address);
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);
    res.status(500).json({ message: "Failed to add address" });
  }
};

// ================= UPDATE ADDRESS =================
export const updateAddress = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot edit address" });
    }

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id, // ✅ ensure user owns this address
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // ✅ UPDATE FIELDS
    address.name = req.body.name ?? address.name;
    address.phone = req.body.phone ?? address.phone;
    address.street = req.body.street ?? address.street;
    address.city = req.body.city ?? address.city;
    address.state = req.body.state ?? address.state;
    address.pincode = req.body.pincode ?? address.pincode;

    await address.save();

    res.json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
};


// ================= GET MY ADDRESSES =================
export const getMyAddresses = async (req, res) => {
  const addresses = await Address.find({ user: req.user.id });
  res.json(addresses);
};

// ================= DELETE ADDRESS =================
export const deleteAddress = async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  await address.deleteOne();
  res.json({ message: "Address deleted" });
};
