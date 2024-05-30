export async function isValidPassword(
  password: string,
  hashedPassword: string
) {
  const encryptedPassword = await hashPassword(password);
  console.log(encryptedPassword);
  return encryptedPassword === hashedPassword;
}

async function hashPassword(password: string): Promise<string> {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );

  return Buffer.from(arrayBuffer).toString("base64");
}
