// Client-side WebAuthn (passkey) helpers for non-custodial voting.
//
// The voter's secp256r1 private key lives in the device authenticator and never
// leaves it. We register the PUBLIC key (qx, qy) with the backend, and at vote
// time the authenticator signs the ballot challenge; we forward only the
// assertion. The contract verifies it on-chain (OpenZeppelin WebAuthn/P256).

const P256_N = BigInt(
  "0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"
);

const toHex = (bytes) =>
  Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const b64urlToBytes = (s) => {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

const bytesToB64url = (bytes) => {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const sha256 = async (bytes) =>
  new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));

const u256be = (n) => {
  const out = new Uint8Array(32);
  let v = BigInt(n);
  for (let i = 31; i >= 0; i--) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return out;
};

/**
 * The 32-byte WebAuthn challenge for a ballot. Must equal the contract's
 * sha256(abi.encodePacked(electionId, candidateIds)).
 */
export async function ballotChallenge(electionId, candidateIds) {
  const parts = [u256be(electionId), ...candidateIds.map((id) => u256be(id))];
  const preimage = new Uint8Array(parts.length * 32);
  parts.forEach((p, i) => preimage.set(p, i * 32));
  return sha256(preimage);
}

export const isSupported = () =>
  typeof window !== "undefined" &&
  window.PublicKeyCredential &&
  navigator.credentials;

/**
 * Creates a passkey and returns its public key coordinates + credentialId.
 * The coordinates are extracted from the DER SPKI public key, whose final 65
 * bytes are the uncompressed point 0x04 ‖ X(32) ‖ Y(32).
 */
export async function registerPasskey({ voterId, voterName }) {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = new TextEncoder().encode(String(voterId));

  const cred = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: "BlockVote", id: window.location.hostname },
      user: { id: userId, name: voterName, displayName: voterName },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256 (P-256)
      authenticatorSelection: { userVerification: "preferred", residentKey: "preferred" },
      timeout: 60000,
      attestation: "none",
    },
  });

  const spki = new Uint8Array(cred.response.getPublicKey());
  const point = spki.slice(spki.length - 65); // 0x04 ‖ X ‖ Y
  return {
    credentialId: bytesToB64url(new Uint8Array(cred.rawId)),
    pubKeyX: "0x" + toHex(point.slice(1, 33)),
    pubKeyY: "0x" + toHex(point.slice(33, 65)),
  };
}

// Parse a DER-encoded ECDSA signature into 32-byte r and s, normalizing s to
// the low half of the curve order (OpenZeppelin's P256.verify requires low-s).
function parseDerSignature(der) {
  let i = 2; // skip 0x30, total-length
  if (der[i] !== 0x02) throw new Error("bad DER signature");
  i++;
  let rLen = der[i++];
  let r = der.slice(i, i + rLen);
  i += rLen;
  if (der[i] !== 0x02) throw new Error("bad DER signature");
  i++;
  let sLen = der[i++];
  let s = der.slice(i, i + sLen);

  const toBig = (b) => BigInt("0x" + (toHex(b) || "0"));
  const pad32 = (v) => v.toString(16).padStart(64, "0");

  let rBig = toBig(r);
  let sBig = toBig(s);
  if (sBig > P256_N / 2n) sBig = P256_N - sBig; // low-s
  return { r: "0x" + pad32(rBig), s: "0x" + pad32(sBig) };
}

/**
 * Signs a ballot challenge with the voter's passkey and returns a WebAuthnAuth
 * struct shaped for the contract's castBallot.
 */
export async function signBallot({ credentialId, challengeBytes }) {
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: challengeBytes,
      allowCredentials: [
        { type: "public-key", id: b64urlToBytes(credentialId) },
      ],
      userVerification: "preferred",
      timeout: 60000,
    },
  });

  const resp = assertion.response;
  const clientDataJSON = new TextDecoder().decode(resp.clientDataJSON);
  const authenticatorData = new Uint8Array(resp.authenticatorData);
  const { r, s } = parseDerSignature(new Uint8Array(resp.signature));

  return {
    r,
    s,
    challengeIndex: clientDataJSON.indexOf('"challenge":"'),
    typeIndex: clientDataJSON.indexOf('"type":"webauthn.get"'),
    authenticatorData: "0x" + toHex(authenticatorData),
    clientDataJSON,
  };
}
