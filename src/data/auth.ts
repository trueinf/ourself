/**
 * Demo sign-in. This is a presentation gate for the demo build, NOT security:
 * the credentials ship in the client bundle and nothing behind the gate is
 * protected. Everything in this app is demo data (see README).
 */
export const DEMO_USERNAME = 'exec@elfbeauty.com';
export const DEMO_PASSWORD = 'elf2027';

/** Username is matched case-insensitively and trimmed; password is exact. */
export function checkCredentials(username: string, password: string): boolean {
  return username.trim().toLowerCase() === DEMO_USERNAME && password === DEMO_PASSWORD;
}
