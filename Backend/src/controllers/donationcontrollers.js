import { ApiResponse } from "../utils/api-response.js";
import { donationForm } from "../models/formDonation.model.js";

const createDonationForm = async (req, res) => {
  try {
    console.log("📦 Creating donation with body:", req.body);
    console.log("👤 Logged in profile:", req.profile?._id);

    // Profile is guaranteed to exist and be completed by middleware
    if (!req.profile?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Profile not found",
      });
    }

    const {
      name,
      quantity,
      foodType,
      preparedAt,
      additionalNote,
      landmark,
      pickupTime,
      pickupDate,
      picture,
    } = req.body;

    // Use profile data for email, phone, address - NEVER from frontend
    const email = req.profile.email;
    const phone = req.profile.phone;
    const address = req.profile.address;

    // Required fields validation
    const requiredFields = {
      name,
      quantity,
      foodType,
      preparedAt,
      pickupDate,
      pickupTime,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          success: false,
          message: `Field '${key}' is required`,
        });
      }
    }

    const donation = await donationForm.create({
      name,
      quantity,
      foodType,
      email, // From profile
      phone, // From profile
      address, // From profile
      preparedAt: new Date(preparedAt),
      pickupDate: new Date(pickupDate),
      pickupTime: new Date(pickupTime),
      additionalNote,
      landmark: landmark || req.profile.landmark, // Use profile landmark if not provided
      picture,
      donor: req.profile._id, // Use profile ID as donor
    });

    return res.status(201).json(
      new ApiResponse(201, donation, "Donation created successfully")
    );

  } catch (error) {
    console.error("❌ Donation creation failed:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getAllDonations = async (req, res) => {
  try {
    const donations = await donationForm
      .find()
      .populate('donor', 'uid name email phone address landmark latitude longitude avatar role') // Populate donor profile
      .populate('acceptedBy', 'uid name email phone address landmark latitude longitude avatar role') // Populate receiver profile
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, donations, "Donations fetched successfully"));
  } catch (err) {
    console.error("❌ Failed to fetch donations:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donations",
    });
  }
};

/**
 * Accept a donation (Receiver only)
 * Changes status from Pending to In Process
 */
const acceptDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const receiverProfile = req.profile;

    // Validate receiver role
    if (receiverProfile.role !== "recipient") {
      return res.status(403).json({
        success: false,
        message: "Only recipients can accept donations",
      });
    }

    // Find donation
    const donation = await donationForm.findById(id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    // Check if donation is pending
    if (donation.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot accept donation with status: ${donation.status}`,
      });
    }

    // Update donation
    donation.status = "In Process";
    donation.acceptedBy = receiverProfile._id;
    donation.acceptedAt = new Date();
    await donation.save();

    // Populate donor and receiver info
    await donation.populate('donor', 'uid name email phone address landmark latitude longitude avatar role');
    await donation.populate('acceptedBy', 'uid name email phone address landmark latitude longitude avatar role');

    return res.status(200).json(
      new ApiResponse(200, donation, "Donation accepted successfully")
    );
  } catch (error) {
    console.error("❌ Accept donation failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to accept donation",
    });
  }
};

/**
 * Complete a donation (Receiver who accepted only)
 * Changes status from In Process to Completed
 */
const completeDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const receiverProfile = req.profile;

    // Find donation
    const donation = await donationForm.findById(id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    // Check if donation is in process
    if (donation.status !== "In Process") {
      return res.status(400).json({
        success: false,
        message: `Cannot complete donation with status: ${donation.status}`,
      });
    }

    // Check if current user is the one who accepted
    if (!donation.acceptedBy || donation.acceptedBy.toString() !== receiverProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the receiver who accepted this donation can mark it as completed",
      });
    }

    // Update donation
    donation.status = "Completed";
    donation.completedAt = new Date();
    await donation.save();

    // Populate donor and receiver info
    await donation.populate('donor', 'uid name email phone address landmark latitude longitude avatar role');
    await donation.populate('acceptedBy', 'uid name email phone address landmark latitude longitude avatar role');

    return res.status(200).json(
      new ApiResponse(200, donation, "Donation marked as completed")
    );
  } catch (error) {
    console.error("❌ Complete donation failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to complete donation",
    });
  }
};

export { createDonationForm, getAllDonations, acceptDonation, completeDonation };
