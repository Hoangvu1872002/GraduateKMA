const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var billSchema = new mongoose.Schema(
  {
    pickupAddress: {
      main_name_place: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        // required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    destinationAddress: {
      main_name_place: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        // required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    distanceInKilometers: {
      type: Number,
      required: true,
    },
    durationInMinutes: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      // required: true,
    },

    cost: {
      type: Number,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
    travelMode: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "drivers",
      default: null,
    },
    status: {
      type: String,
      required: true,
      default: "RECEIVED",
      enum: ["RECEIVED", "PENDING", "COMPLETED", "CANCELED"],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("bills", billSchema);
