// Simple frontend-only auth utilities using localStorage
export type User = {
  name: string;
  password: string; // NOTE: plaintext in localStorage, not secure — frontend-only as requested
  role: string;
};

const USERS_KEY = "iot_users";
const CURRENT_KEY = "iot_current_user";

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch (e) {
    console.error("getUsers parse error", e);
    return [];
  }
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(u: User): { ok: true; user: User } | { ok: false; error: string } {
  if (!u.name || !u.password) return { ok: false, error: "name and password required" };
  const users = getUsers();
  const exists = users.find((x) => x.name === u.name);
  if (exists) return { ok: false, error: "user already exists" };
  users.push(u);
  saveUsers(users);
  setCurrentUser(u);
  return { ok: true, user: u };
}

export function loginUser(name: string, password: string): { ok: true; user: User } | { ok: false; error: string } {
  const users = getUsers();
  const found = users.find((u) => u.name === name && u.password === password);
  if (!found) return { ok: false, error: "invalid credentials" };
  setCurrentUser(found);
  return { ok: true, user: found };
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) localStorage.removeItem(CURRENT_KEY);
  else localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch (e) {
    console.error("getCurrentUser parse error", e);
    return null;
  }
}

export function logout() {
  setCurrentUser(null);
}
