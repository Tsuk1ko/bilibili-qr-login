<template>
  <div class="cookie">
    <pre ref="pre" class="cookie__pre">{{ value }}</pre>
    <div class="cookie__copy flex flex-row btn" @click="copy"><CopyIcon style="margin-right: 4px" />{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CopyIcon from '../assets/icons/content_copy.svg';
import { useTipText } from '../utils/tipText';

defineProps<{ value: string }>();

const pre = ref<HTMLElement>();
const { text, changeText } = useTipText('复制');

const copy = () => {
  const selection = window.getSelection()!;
  const range = window.document.createRange();
  selection.removeAllRanges();
  range.selectNode(pre.value!);
  selection.addRange(range);
  window.document.execCommand('copy');
  selection.removeAllRanges();
  changeText('已复制');
};
</script>

<style lang="less" scoped>
.cookie {
  max-width: 596px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &__pre {
    text-wrap: wrap;
    word-break: break-all;
    margin: 0;
    padding: 8px;
  }

  &__copy {
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    padding: 8px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
