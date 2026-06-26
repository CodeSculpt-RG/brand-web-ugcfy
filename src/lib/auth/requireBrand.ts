import { verifyBrand } from './verifyBrand';
import { redirect } from 'next/navigation';

export async function requireBrand() {
  const result = await verifyBrand();

  if (!result.ok) {
    if (result.code === 'UNAUTHENTICATED') {
      redirect('/login?next=/dashboard');
    } else if (result.code === 'BRAND_PROFILE_NOT_FOUND') {
      redirect('/brand/onboarding');
    } else if (result.code === 'BRAND_PROFILE_INACTIVE') {
      redirect('/login?error=brand_inactive');
    } else if (result.code === 'BRAND_PROFILE_DUPLICATE') {
      redirect('/login?error=brand_profile_duplicate');
    } else {
      throw new Error(result.message);
    }
  }

  return result;
}
