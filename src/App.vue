<template>
  <div class="text-center no-select">
    <h2 v-if="!PARAM_MODE">哔哩哔哩 cookie 获取工具</h2>
    <p>
      {{ PARAM_MODE ? '请使用哔哩哔哩手机 APP 扫码登录' : '使用手机 APP 扫码登录后即可获取 cookie' }} (<a
        class="link"
        href="https://github.com/Tsuk1ko/bilibili-qr-login"
        target="_blank"
        >GitHub</a
      >)
    </p>
  </div>
  <div class="qrcode flex no-select">
    <QrCode v-if="state.url" :value="state.url" :options="qrCodeOption" />
    <div v-if="state.status !== QrStatus.WAIT" class="qrcode__mask flex">
      <LoadingIcon v-if="state.status === QrStatus.LOADING" />
      <template v-else>
        <CheckIcon v-if="showCheckIcon" class="icon--no-size" />
        <RefreshBtn class="icon--no-size" :class="{ 'icon--hide': showCheckIcon }" @click="restart" />
      </template>
    </div>
  </div>
  <div class="text-center no-select">
    <p>{{ getters.statusText }}</p>
  </div>
  <div v-if="!PARAM_MODE" class="cookie-box">
    <CookieDisplay v-if="state.cookie" :value="state.cookie" />
  </div>
</template>

<script setup lang="ts">
import QrCode from '@chenfengyuan/vue-qrcode';
import { computed, onBeforeUnmount } from 'vue';
import RefreshBtn from './components/RefreshBtn.vue';
import CookieDisplay from './components/CookieDisplay.vue';
import LoadingIcon from './components/LoadingIcon.vue';
import CheckIcon from './assets/icons/check_circle.svg';
import { useQrSSE, QrStatus } from './utils/qrSSE';
import { PARAM_MODE } from './utils/const';
import type { QRCodeRenderersOptions } from 'qrcode';

window.document.title = PARAM_MODE ? '登录哔哩哔哩' : '哔哩哔哩 cookie 获取工具';

const qrCodeOption: QRCodeRenderersOptions = {
  margin: 0,
};

const { state, getters, restart, stop } = useQrSSE();

const showCheckIcon = computed(() => state.status === QrStatus.SCANNED || state.status === QrStatus.SUCCESS);

onBeforeUnmount(stop);
</script>

<style scoped lang="less">
.qrcode {
  position: relative;
  min-width: 196px;
  min-height: 196px;

  &__mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.85);
  }
}

.cookie-box {
  min-height: 180px;
}

.icon {
  &--no-size {
    margin: -16px;
  }
  &--hide {
    opacity: 0;
    transition: opacity 0.2s;
  }
}

.qrcode:hover {
  .icon--hide {
    opacity: 1;
  }
}
</style>
