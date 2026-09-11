import { getAuthApi } from "./api";

export type AuthUser = {
  id: string;
  dni?: string;
  nombre?: string;
  email?: string;
  cargo_contrato?: string;
  id_reg?: string;
  sexo?: string;
  fecha_nac?: string;
  rol?: string;
};

const USER_KEY = "rrhh_user";
const ACCESS_KEY = "rrhh_access_token";
const REFRESH_KEY = "rrhh_refresh_token";

export function saveSession(data: {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}) {
  localStorage.setItem(ACCESS_KEY, data.accessToken);
  localStorage.setItem(REFRESH_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_KEY);
}

export function getAccessTokenExpiryMs() {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  const segment = token.split(".")[1];

  if (!segment) {
    return null;
  }

  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(atob(padded)) as { exp?: number };

    if (typeof payload.exp !== "number") {
      return null;
    }

    return payload.exp * 1000;
  } catch {
    return null;
  }
}

export function getRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(REFRESH_KEY);
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${getAuthApi()}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!data?.accessToken) {
    return null;
  }

  localStorage.setItem(ACCESS_KEY, data.accessToken);
  return data.accessToken as string;
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function logout() {
  const token = getAccessToken();

  if (token) {
    try {
      await fetch(`${getAuthApi()}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Keep local logout even if the API is unreachable.
    }
  }

  clearSession();
}

export function isAdmin(user?: AuthUser | null) {
  const current = user ?? getUser();
  return current?.rol === "admin";
}
