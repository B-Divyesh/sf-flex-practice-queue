const slug = 'flex-practice-queue';
const key = `sb_license:${slug}`;
const cacheKey = `${key}:verdict`;
export const checkoutUrl = `https://api.sociobot.in/api/v1/products/${slug}/checkout`;

export function captureLicense(): boolean {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return false;
  localStorage.setItem(key, token);
  url.searchParams.delete('license');
  history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}

export const hasSavedLicense = (): boolean => Boolean(localStorage.getItem(key));

export function hasLicense(): boolean {
  try {
    const verdict = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    return Boolean(localStorage.getItem(key) && verdict?.valid);
  } catch { return false; }
}

export async function verifyLicense(force = false): Promise<{ valid: boolean; message: string }> {
  const token = localStorage.getItem(key);
  if (!token) return { valid: false, message: 'No license is saved.' };
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if (!force && cached && Date.now() - cached.checkedAt < 86_400_000) {
      return { valid: Boolean(cached.valid), message: cached.valid ? 'License active.' : 'License no longer active.' };
    }
  } catch { /* fetch a fresh verdict */ }
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${slug}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verification unavailable');
    const body = await response.json() as { valid: boolean };
    localStorage.setItem(cacheKey, JSON.stringify({ valid: body.valid, checkedAt: Date.now() }));
    return { valid: body.valid, message: body.valid ? 'License active.' : 'License no longer active. Buy again or paste another license.' };
  } catch {
    return { valid: hasLicense(), message: hasLicense() ? 'Using your last verified license while offline.' : 'The license could not be checked. Connect to the internet and try again.' };
  }
}

export function saveLicense(token: string): void {
  localStorage.setItem(key, token.trim());
  localStorage.removeItem(cacheKey);
}
