const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    // givenName: {
    // 	type: String,
    // },
    // familyName: {
    // 	type: String,
    // },
    // bio: {
    // 	type: String,
    // },
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
    // fcmTokens: {
    // 	type: [String],
    // },
    // following: {
    // 	type: [String],
    // },
    // followers: {
    // 	type: [String],
    // },
    // interests: {
    // 	type: [String],
    // },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
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

module.exports = mongoose.model("users", userSchema);
