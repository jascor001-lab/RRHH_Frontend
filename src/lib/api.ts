export function getAuthApi() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth-api`;
  }

  return process.env.NEXT_PUBLIC_AUTH_API || "http://127.0.0.1:3007";
}

export function getFilesApi() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/files-api`;
  }

  return process.env.NEXT_PUBLIC_FILES_API || "http://127.0.0.1:3010";
}
