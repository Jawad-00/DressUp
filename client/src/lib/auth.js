const KEY = "dressup_auth_v1";

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function setAuth(payload) {
  // payload: { token, user }
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function getToken() {
  const auth = getAuth();
  return auth?.token || "";
}

export function getUser() {
  const auth = getAuth();
  return auth?.user || null;
}
export function isAdmin() {
  const auth = getAuth();
  return auth?.user?.role === "admin";
}
