<template>
  <div class="text-center">
    <h2>哔哩哔哩 cookie 获取工具</h2>
    <p>
      使用手机 APP 扫码登录后即可获取 cookie (<a
        class="link"
        href="https://github.com/Tsuk1ko/bilibili-qr-login"
        target="_blank"
        >GitHub</a
      >)
    </p>
  </div>
  <div class="qrcode flex">
    <QrCode :value="qrValue" :options="qrCodeOption" />
    <div v-if="qrStatus !== QrStatus.WAIT" class="qrcode__mask flex">
      <CheckIcon v-if="qrStatus === QrStatus.SCANNED || qrStatus === QrStatus.SUCCESS" />
      <RefreshBtn v-else />
    </div>
  </div>
  <div class="text-center">
    <p>{{ qrStatusText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import QrCode from '@chenfengyuan/vue-qrcode';
import RefreshBtn from './components/RefreshBtn.vue';
import CheckIcon from './assets/icons/check_circle.svg';
import type { QRCodeRenderersOptions } from 'qrcode';

enum QrStatus {
  WAIT,
  SCANNED,
  EXPIRED,
  SUCCESS,
  ERROR,
}

const qrCodeOption: QRCodeRenderersOptions = {
  margin: 0,
};

const qrValue = ref(
  'https://passport.bilibili.com/h5-app/passport/login/scan?navhide=1&qrcode_key=ed99a307afd9a309098071fb9d9258a7&from=main-fe-header',
);
const qrErrorMsg = ref('');
const qrStatus = ref(QrStatus.EXPIRED);
const qrStatusText = computed(() => {
  if (qrErrorMsg.value) return qrErrorMsg.value;

  switch (qrStatus.value) {
    case QrStatus.WAIT:
      return '等待扫码';
    case QrStatus.SCANNED:
      return '已扫码，等待登录';
    case QrStatus.EXPIRED:
      return '二维码已过期，请刷新';
  }

  return '';
});
</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
}

body,
#app,
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-center {
  text-align: center;
}

.link {
  color: rgb(0, 0, 238);
  text-decoration: none;
}

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
</style>
