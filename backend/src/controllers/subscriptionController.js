import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

// Subscribe to email updates
export const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    // First check if email belongs to a registered user
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "You must be a registered user to subscribe to updates. Please sign up first.",
      });
    }
    
    // Check if email already has an active subscription
    const existingSubscription = await Subscription.findOne({ 
      email,
      isActive: true 
    });
    
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "This email is already subscribed to updates.",
      });
    }
    
    // Check if there's an inactive subscription for this email
    const inactiveSubscription = await Subscription.findOne({ 
      email,
      isActive: false 
    });
    
    if (inactiveSubscription) {
      // Reactivate the existing subscription
      inactiveSubscription.isActive = true;
      inactiveSubscription.user = userExists._id;
      await inactiveSubscription.save();
      
      return res.status(200).json({
        success: true,
        message: "Successfully re-subscribed to email updates.",
        data: inactiveSubscription,
      });
    }
    
    // Create new subscription
    const subscription = await Subscription.create({
      email,
      user: userExists._id,
      isActive: true,
    });
    
    res.status(201).json({
      success: true,
      message: "Successfully subscribed to email updates.",
      data: subscription,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Get all subscriptions (for admin)
export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('user', 'name email role') // Populate user details
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Unsubscribe from email updates
export const unsubscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find and deactivate the subscription
    const subscription = await Subscription.findOne({ email });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No subscription found for this email.",
      });
    }
    
    if (!subscription.isActive) {
      return res.status(400).json({
        success: false,
        message: "This email is already unsubscribed.",
      });
    }
    
    subscription.isActive = false;
    await subscription.save();
    
    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from email updates.",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
