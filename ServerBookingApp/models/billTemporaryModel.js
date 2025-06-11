const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var billTemporarySchema = new mongoose.Schema(
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
    travelMode: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    socketIdDriversReceived: {
      type: [String],
      default: [],
      required: true,
    },
    infReceiver: {
      name: {
        type: String,
      },
      mobile: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("billTemporarys", billTemporarySchema);
