export const IS_DEV = process.env.NODE_ENV === 'development';

export const PARAM_MODE = (new URL(window.location.href).searchParams.get('mode') || '') as 'window' | 'iframe' | '';

const trustOriginStr = __TRUST_ORIGIN__;

export const TRUST_ALL_ORIGIN = trustOriginStr.trim() === '*';

export const trustOrigins = new Set(
  trustOriginStr
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),
);
