// controllers/digitalIdAuthController.js
import { verifyMessage } from "ethers";
import { User } from "../models/index.js";
import { generateToken } from "../utils/jwt.js";

export const digitalIdAuth = async (req, res) => {
  const { credential } = req.body;           // { payload, signature }
  if (!credential) return res.status(400).json({ error: "Missing credential" });

  try {
    const { payload, signature } = credential;
    const msg   = JSON.stringify(payload);
    const signer = verifyMessage(msg, signature);

    // Basic ownership check
    if (signer.toLowerCase() !== payload.userAddress.toLowerCase()) {
      return res.status(401).json({ error: "Signature does not match identity" });
    }

    const didEmail = `${payload.credentialId.toLowerCase()}@did.eth`.replace(/^0x/, "");

    // Upsert user
    let user = await User.findOne({ where: { email: didEmail } });
    if (!user) {
      user = await User.create({
        full_name: `${payload.firstName} ${payload.lastName}`,
        email: didEmail,
        password_hash: "",
        nationality: payload.nationality,
        role: "user",
      });
    }

    const token = generateToken(user.id);
    res.json({ token });
  } catch (err) {
    console.error("DID auth error:", err);
    res.status(401).json({ error: "Digital Identity authentication failed" });
  }
};
