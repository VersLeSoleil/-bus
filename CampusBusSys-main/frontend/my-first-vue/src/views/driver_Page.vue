<script setup>
  import { ref, onMounted,onUnmounted } from 'vue';
  import AMapLoader from '@amap/amap-jsapi-loader';

  let map=null;
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
      securityJsCode: "a138aac0c6ccb5693116663e3361b429",
    };
    AMapLoader.load({
      key: "9e0dfefc829e69af5324533400185185", 
      version: "2.0",
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

  onUnmounted(()=>{
    map?.destroy();
  });


</script>

<template>
  <div>
    <h1>欢迎来到司机页！</h1>

    <div id="container"></div>
    <div class="info">
      <h4>{{ statusMessage }}</h4>
      <hr />
      <p v-html="resultMessage"></p>
      <hr />
    </div>
  </div>
</template>

<style scoped>
  #container {
    padding: 0px;
    margin: 0px;
    height: 800px;
    width: 100%;
  }
  .info {
    width: 26rem;
    padding: 10px;
  }
</style>
