interface ScreenExt extends Screen {
  availLeft: number;
  availTop: number;
}

const getCenterPosition = (width: number, height: number) => {
  const screenLeft = window.screenLeft !== undefined ? window.screenLeft : (window.screen as ScreenExt).availLeft;
  const screenTop = window.screenTop !== undefined ? window.screenTop : (window.screen as ScreenExt).availTop;

  const screenWidth = window.screen.width || window.outerWidth || document.documentElement.clientWidth;
  const screenHeight = window.screen.height || window.outerWidth || document.documentElement.clientHeight;

  return {
    left: Math.round((screenWidth - width) / 2 + screenLeft),
    top: Math.round((screenHeight - height) / 2 + screenTop),
  };
};

const getFeaturesStr = (features: Record<string, any>) =>
  Object.entries(features)
    .map(([k, v]) => `${k}=${v}`)
    .join(',');

export const openQrWindow = (url: string) => {
  const width = 380;
  const height = 340;
  const features = getFeaturesStr({
    width,
    height,
    location: false,
    menubar: false,
    resizeable: false,
    scrollbars: false,
    status: false,
    toolbar: false,
    ...getCenterPosition(width, height),
  });
  return window.open(url, '_blank', features);
};
