import { ref } from 'vue';

export const useTipText = (initText: string) => {
  const text = ref(initText);
  let timer: NodeJS.Timeout | undefined;

  const changeText = (tipText: string, timeout = 2000) => {
    if (timer) clearTimeout(timer);
    text.value = tipText;
    timer = setTimeout(() => {
      text.value = initText;
      timer = undefined;
    }, timeout);
  };

  return { text, changeText };
};
