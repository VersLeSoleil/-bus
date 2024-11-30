<script setup>
import { ref } from 'vue';
import driver_Info from './driver_Info.vue';


var dInfoVisible=ref(false);

const dInfoContent=ref('测试弹窗');
const statusMessage = ref('');
const resultMessage = ref('');




function closeDInfo(){
  dInfoVisible.value=false;
}

function showDriverInfo(){
  dInfoVisible.value=true;
}


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
        <button @click="showDriverInfo" class="showDriverInfoButton">我的</button>
        <driver_Info :visible="dInfoVisible" :content="dInfoContent" @close="closeDInfo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.showDriverInfoButton {
    position: absolute;
    top: 20%;
    left: 85%;
    width: 52px; 
    height: 52px;
    border-radius: 50%; 
    
    text-align: center;
    background: rgba(113, 65, 168, 0.5);
    color: floralwhite;
    line-height: 52px;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
    transform: translate(-50%, -50%); 
}
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
