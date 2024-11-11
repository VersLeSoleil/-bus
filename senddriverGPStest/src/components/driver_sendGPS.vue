<!--甲端 Vue Component-->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const ws = new WebSocket('ws://localhost:8081');
const statusMessage = ref('连接中...');
const locationData = ref(null);

function onPositionUpdate(position) {
  const { latitude, longitude } = position.coords;
  const data = { latitude, longitude };
  ws.send(JSON.stringify(data));
  statusMessage.value = '位置已发送';
}

function onError(error) {
  console.error('GPS获取失败', error);
  statusMessage.value = '定位失败';
}

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(onPositionUpdate, onError, {
      enableHighAccuracy: true,
    });
  }

  ws.onopen = () => (statusMessage.value = '已连接');
  ws.onclose = () => (statusMessage.value = '连接已断开');
  ws.onerror = (error) => console.error('WebSocket错误:', error);
});

onUnmounted(() => {
  ws.close();
});
</script>

<template>
  <div>
    <h1>甲端 - 位置发送</h1>
    <p>状态: {{ statusMessage }}</p>
  </div>
</template>
