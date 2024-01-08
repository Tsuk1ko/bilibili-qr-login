import { PARAM_MODE, TRUST_ALL_ORIGIN, trustOrigins } from './const';

interface QrMessage {
  type: 'success';
  mode: string;
  data: string;
}

export const postQrMessage = (data: Omit<QrMessage, 'mode'>) => {
  if (!PARAM_MODE) return;
  const targetWindow: Window | null =
    PARAM_MODE === 'window' ? window.opener : PARAM_MODE === 'iframe' ? window.top : null;
  if (!targetWindow) {
    console.error('No target window');
    return;
  }
  const message: QrMessage = { ...data, mode: PARAM_MODE };
  if (TRUST_ALL_ORIGIN) targetWindow.postMessage(message, '*');
  else trustOrigins.forEach(origin => targetWindow.postMessage(message, origin));
};
