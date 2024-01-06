<template>
  <div class="refresh-btn btn flex"><RefreshIcon /></div>
</template>

<script setup lang="ts">
import RefreshIcon from '../assets/icons/refresh.svg';
</script>

<style scoped lang="less">
.refresh-btn {
  width: 32px;
  height: 32px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow:
    0 1.25px 5px 0 rgba(0, 0, 0, 0.2),
    0 0.3333px 1.5px 0 rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
</style>
