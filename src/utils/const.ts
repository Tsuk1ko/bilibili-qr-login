export const IS_DEV = process.env.NODE_ENV === 'development';

export const PARAM_MODE = (new URL(window.location.href).searchParams.get('mode') || '') as 'window' | 'iframe' | '';

export const trustOrigins = __TRUST_ORIGIN__
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

export const TRUST_ALL_ORIGIN = trustOrigins.includes('*');
