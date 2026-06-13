// Small client-side auth helpers shared by the axios client and route guards.
// Note: these are convenience/UX checks only — the server is the real
// authority and verifies every token. We never trust localStorage for access.

const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

// True if the token exists and its exp claim (if any) is still in the future.
export const isTokenValid = (token) => {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload) return false;
  if (payload.exp && payload.exp * 1000 <= Date.now()) return false;
  return true;
};

export const getOrgToken = () => {
  const raw = localStorage.getItem("token");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return raw;
  }
};

export const getVoterToken = () => localStorage.getItem("voterToken");

export const hasValidOrgSession = () => isTokenValid(getOrgToken());
export const hasValidVoterSession = () => isTokenValid(getVoterToken());

export const clearOrgSession = () => {
  ["token", "refreshToken", "userInfo", "isAuthenticated", "rememberMe"].forEach(
    (k) => localStorage.removeItem(k),
  );
};

export const clearVoterSession = () => {
  localStorage.removeItem("voterToken");
  localStorage.removeItem("voterInfo");
};
