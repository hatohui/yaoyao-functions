export const ADMIN_HEADER = 'x-admin-secret';

export function getAdminPassphrase(): string | undefined {
  return process.env.ADMIN_PASSPHRASE;
}
