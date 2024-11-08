<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';

let map = null;
const statusMessage = ref('');
const resultMessage = ref('');

function onComplete(data) {
  statusMessage.value = '定位成功';
  const resultArr = [];
  resultArr.push(`定位结果：${data.position}`);
  resultArr.push(`定位类别：${data.location_type}`);
  if (data.accuracy) {
    resultArr.push(`精度：${data.accuracy} 米`);
  }
  resultArr.push(`是否经过偏移：${data.isConverted ? '是' : '否'}`);
  resultMessage.value = resultArr.join('<br>');
}

function onError(data) {
  statusMessage.value = '定位失败';
  resultMessage.value = `失败原因排查信息: ${data.message}<br>浏览器返回信息：${data.originMessage}`;
}

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: 'a138aac0c6ccb5693116663e3361b429',
  };
  AMapLoader.load({
    key: '9e0dfefc829e69af5324533400185185',
    version: '2.0',
    plugins: ['AMap.Geolocation'],
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        resizeEnable: true,
      });

      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        position: 'RB',
        offset: [10, 20],
        zoomToAccuracy: true,
      });

      map.addControl(geolocation);

      geolocation.getCurrentPosition((status, result) => {
        if (status === 'complete') {
          onComplete(result);
        } else {
          onError(result);
        }
      });
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
    <div id="container" class="map-container">
      <div class="info-container">
        <h4>{{ statusMessage }}</h4>
        <hr />
        <p v-html="resultMessage"></p>
        <hr />
      </div>
    </div>
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


.page-title {
  color: #4a4a4a;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}


.map-container {
  position: relative;
  height: 700px;
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}


.info-container {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 260px;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #333;
  z-index: 10;
}

.info-container h4 {
  color: #008a6c;
  font-weight: 600;
}

.info-container p {
  color: #666;
  line-height: 1.6;
}


@media (min-width: 1024px) {
  .map-container {
    height: 600px;
  }
}
</style>
