const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var eventSchema = new mongoose.Schema(
  {
    main_name_place: {
      type: String,
      required: true,
    },
    locationAddress: {
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
    endAt: {
      type: Number,
      required: true,
    },
    dateEnd: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    status: {
      type: String,
      required: true,
      default: "unfinished",
      enum: ["unfinished", "finished"],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("events", eventSchema);
