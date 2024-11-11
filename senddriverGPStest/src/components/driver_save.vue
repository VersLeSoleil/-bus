<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';

let map = null;
let marker = null; // 用于表示甲端的位置信息
const statusMessage = ref('');
const resultMessage = ref('');

function initMap(AMap) {
  map = new AMap.Map('container', {
    resizeEnable: true,
    zoom: 15,
  });

  // 初始化一个标记（marker）用于表示甲端的位置
  marker = new AMap.Marker({
    map: map,
    position: [0, 0], // 初始位置可以先设为[0, 0]，之后更新
    offset: new AMap.Pixel(-13, -30), // 调整标记的偏移
  });
}

// WebSocket收到位置数据时更新标记位置
function updateMarkerPosition(data) {
  const latitude = data.latitude;
  const longitude = data.longitude;
  
  if (latitude && longitude) {
    const position = new AMap.LngLat(longitude, latitude);
    marker.setPosition(position); // 更新标记位置
    map.setCenter(position); // 设置地图中心为标记位置
  }
}

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: 'a138aac0c6ccb5693116663e3361b429',
  };
  AMapLoader.load({
    key: '9e0dfefc829e69af5324533400185185',
    version: '2.0',
    plugins: [],
  })
    .then((AMap) => {
      initMap(AMap);

      // 建立WebSocket连接
      const ws = new WebSocket('ws://localhost:8081');
      ws.onmessage = (event) => {
        const blob = event.data;

        // 将Blob转换为文本
        const reader = new FileReader();
        reader.onload = function () {
          const jsonData = JSON.parse(reader.result);
          console.log("接收到的GPS数据:", jsonData);

          // 更新地图上的标记位置
          updateMarkerPosition(jsonData);
        };
        reader.readAsText(blob);
      };
      
      ws.onopen = () => {
        console.log("WebSocket连接已建立");
      };
      
      ws.onclose = () => {
        console.log("WebSocket连接已关闭");
      };
    })
    .catch((e) => {
      console.error('加载高德地图失败', e);
    });
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <div class="page-container">
    <h1 class="page-title">欢迎来到司机页！</h1>
    <div id="container" class="map-container"></div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f3f4f6;
  min-height: 100vh;
}

.map-container {
  position: relative;
  height: 700px;
  width: 700px;
  max-width: 800px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}
</style>
