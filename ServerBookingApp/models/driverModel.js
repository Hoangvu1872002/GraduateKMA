const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const driverSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    photoUrl: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },
  },
  {
    timestamps: true,
  }
);

driverSchema.index({ location: "2dsphere" });

driverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

driverSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExprires = Date.now() + 15 * 60 * 1000;
    return resetToken;
  },
};

module.exports = mongoose.model("drivers", driverSchema);
