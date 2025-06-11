const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { type } = require("os");

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
    mobile: {
      type: String,
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
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    cart: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
        price: Number,
        thumbnail: String,
        title: String,
        discount: String,
      },
    ],
    address: {
      main_name_place: { type: String }, // Địa chỉ cụ thể
      description: { type: String }, // Địa chỉ mô tả
      latitude: { type: Number }, // Vĩ độ
      longitude: { type: Number }, // Kinh độ
    },
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    isBocked: {
      type: String,
      default: "Active",
    },
    balence: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExprires: {
      type: String,
    },
    registerToken: {
      type: String,
    },
    socketId: {
      type: String,
    },
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
