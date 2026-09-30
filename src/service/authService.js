const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const {
  generateSecretKey,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/token");

// Register:
const registerService = async ({ name, email, password }) => {
  const existingUser = await User.findOne({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "user",
    isActive: true,
  });

  return user;
};

// Login:
const loginService = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const secretKey = generateSecretKey();

  await user.update({
    secretKey,
  });

  const accessToken = generateAccessToken(user, secretKey);

  const refreshToken = generateRefreshToken(user, secretKey);

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  await user.update({
    refreshTokenHash,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

// Refresh token:
const refreshAccessTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new error("Refresh token is required");
  }

  const decoded = jwt.decode(refreshToken);

  if (!decoded || !decoded.id) {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.secretKey) {
    throw new Error("Session secret not found");
  }

  let verifiedToken;

  try {
    verifiedToken = jwt.verify(refreshToken, user.secretKey);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }

  if (verifiedToken.type !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  if (!user.refreshTokenHash) {
    throw new Error("Refresh token is invalid");
  }

  const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

  if (!isValid) {
    throw new Error("Refresh token is invalid");
  }

  const newSecretKey = generateSecretKey();

  await user.update({
    secretKey: newSecretKey,
  });

  const newAccessToken = generateAccessToken(user, newSecretKey);

  const newRefreshToken = generateRefreshToken(user, newSecretKey);

  const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 12);

  await user.update({
    refreshTokenHash: newRefreshTokenHash,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// Logout:
const logoutService = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const newSecretKey = generateSecretKey();

  await user.update({
    secretKey: newSecretKey,
    refreshTokenHash: null,
  });

  return true;
};

// Get profile:
const getProfileService = async (userId) => {
  const user = User.findByPk(userId, {
    attributes: {
      exclude: ["password", "secretKey", "refreshTokenHash"],
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = {
  registerService,
  loginService,
  refreshAccessTokenService,
  logoutService,
  getProfileService,
};
