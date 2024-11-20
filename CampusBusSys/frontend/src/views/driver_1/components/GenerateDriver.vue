<template>
    <div class="generate-driver">
      <button @click="startUpdating" :disabled="updating">
        {{ updating ? "更新中..." : "开始更新驾驶员位置" }}
      </button>
      <div v-if="driver" class="driver-info">
        <p>驾驶员 ID: {{ driver.id }}</p>
        <p>纬度: {{ driver.latitude }}</p>
        <p>经度: {{ driver.longitude }}</p>
      </div>
      <div v-if="error" class="error">
        <p>错误：{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, onUnmounted } from "vue";
  import route1 from "@/assets/route1.json";
  
  export default {
    name: "GenerateDriver",
    setup() {
      const driver = reactive({
        id: "driver_1", // 默认驾驶员 ID
        latitude: null,
        longitude: null,
      });
      const updating = ref(false); // 控制是否在更新
      const error = ref(null); // 存储错误信息
      const route = ref([]); // GPS 路径点
      let currentPointIndex = ref(0); // 当前路径点索引
      let intervalId = null;
  
      // 加载路径点
      const loadRoute = async () => {
        try {
          route.value = route1[0]?.path || [];
          if (!route.value.length) {
            throw new Error("路径数据无效");
          }
          currentPointIndex.value = 0;
        } catch (err) {
          console.error("加载路径失败：", err);
          error.value = err.message || "加载路径时发生未知错误";
        }
      };
  
      // 更新驾驶员位置
      const updateDriverPosition = () => {
        if (route.value.length === 0) return; // 没有路径点时直接返回
  
        const [longitude, latitude] = route.value[currentPointIndex.value];
        driver.latitude = latitude;
        driver.longitude = longitude;
  
        // 更新索引，循环处理
        currentPointIndex.value =
          (currentPointIndex.value + 1) % route.value.length;
  
        // 发送位置信息到后端
        sendLocationToBackend(driver.id, longitude, latitude);
      };
  
      // 开始更新驾驶员位置
      const startUpdating = async () => {
        if (updating.value) return;
        updating.value = true;
  
        if (route.value.length === 0) {
          await loadRoute();
        }
  
        intervalId = setInterval(updateDriverPosition, 1000);
      };
  
      // 停止更新驾驶员位置
      const stopUpdating = () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        updating.value = false;
      };
  
      // 发送位置信息到后端
      const sendLocationToBackend = (driverId, longitude, latitude) => {
        fetch("http://localhost:8080/updateLocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: driverId,
            role: "driver",
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
          }),
        })
          .then((response) => response.text())
          .then((data) => console.log("服务器响应:", data))
          .catch((error) => console.error("请求错误:", error));
      };
  
      // 清理定时器
      onUnmounted(() => {
        stopUpdating();
      });
  
      return {
        driver,
        updating,
        error,
        startUpdating,
      };
    },
  };
  </script>
  
  <style scoped>
  .generate-driver {
    font-family: Arial, sans-serif;
    margin: 20px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .driver-info {
    margin-top: 20px;
    font-size: 14px;
  }
  
  .error {
    margin-top: 20px;
    color: red;
    font-size: 14px;
  }
  </style>
  