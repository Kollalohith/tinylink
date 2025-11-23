// Validate short code format: [A-Za-z0-9]{6,8}
export function validateCode(code: string) {
  const regex = /^[A-Za-z0-9]{6,8}$/;
  return regex.test(code);
}

// Validate URL format (must start with http or https)
export function validateUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Generate a random alphanumeric code
export function generateRandomCode(length: number = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}
