import jwt, { JwtPayload, Secret } from "jsonwebtoken";

/**
 * Creates a JWT token.
 *
 * @param {object} payload - The payload to be signed in the token.
 * @param {Secret} secret - The secret key to sign the token.
 * @param {string} expireTime - The expiration time for the token.
 * @returns {string} The signed JWT token.
 */
const createToken = (
  payload: object,
  secret: Secret,
  expireTime: any
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
};

/**
 * Verifies a JWT token.
 *
 * @param {string} token - The JWT token to verify.
 * @param {Secret} secret - The secret key to verify the token.
 * @returns {JwtPayload} The decoded JWT payload.
 * @throws {Error} If the token is invalid or expired.
 */
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const JwtHelper = { createToken, verifyToken };
