// =============================================================================
// QuickCart Enterprise Admin Security & Session Management Engine
// =============================================================================

export interface AdminUser {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'DEPOT_MANAGER';
  name: string;
  badgeId: string;
}

export const MASTER_ADMIN: AdminUser = {
  id: 'usr_adm_01',
  email: 'admin@quickcart.io',
  role: 'SUPER_ADMIN',
  name: 'Chief Logistics Officer',
  badgeId: 'QC-SEC-9901',
};

// Hardcoded Master Passphrases for the Demo / Evaluation
export const VALID_CREDENTIALS = [
  {
    email: 'admin@quickcart.io',
    password: 'admin', // Quick convenient demo password
  },
  {
    email: 'admin@quickcart.io',
    password: 'QC-MASTER-KEY-2026!',
  },
  {
    email: 'admin',
    password: 'admin',
  },
];

export const ADMIN_COOKIE_NAME = 'qc_admin_session_token';
export const ADMIN_SESSION_SECRET = 'QC_SESSION_AUTH_VERIFIED_772910';

export function validateCredentials(identifier: string, pass: string): boolean {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = pass.trim();

  return VALID_CREDENTIALS.some(
    (cred) =>
      (cred.email === cleanId || cleanId === 'admin') && cred.password === cleanPass
  );
}
