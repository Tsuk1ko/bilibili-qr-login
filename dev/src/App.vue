<template>
  <button class="test-btn" @click="openWindow">打开新窗口</button>
  <button class="test-btn" @click="toggleIframe">{{ showIframe ? '关闭' : '打开' }} iframe</button>
  <iframe v-if="showIframe" src="/?mode=iframe" width="380" height="340" style="border: none" />
  <div class="cookie-box">
    <CookieDisplay v-if="cookieResult" :value="cookieResult" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import CookieDisplay from '../../src/components/CookieDisplay.vue';
import { openQrWindow } from './utils/openWindow';

const cookieResult = ref('');
const showIframe = ref(false);

const openWindow = () => {
  cookieResult.value = '';
  openQrWindow('/?mode=window');
};

const toggleIframe = () => {
  cookieResult.value = '';
  showIframe.value = !showIframe.value;
};

interface QrMessage {
  type: 'success';
  mode: 'window' | 'iframe';
  data: string;
}

const handleMessage = (e: MessageEvent<QrMessage>) => {
  // 【重要】校验 message 来自扫码窗口/iframe
  if (e.origin !== window.location.origin) return;

  const { type, data, mode } = e.data;
  if (type === 'success') {
    cookieResult.value = data;
    if (mode === 'window') {
      (e.source as Window | null)?.close();
    } else if (mode === 'iframe') {
      showIframe.value = false;
    }
  }
};

window.addEventListener('message', handleMessage);

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<style scoped lang="less">
.test-btn {
  margin-bottom: 16px;
}

.cookie-box {
  min-height: 180px;
}
</style>
