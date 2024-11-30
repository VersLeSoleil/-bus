import { createRouter, createWebHistory } from 'vue-router'; // Vue Router 4 的导入方式
import LoginPage from '../views/login.vue'; // 确保路径正确
import HomePage from '../views/HomePage.vue';
import Driver_Page_0 from '@/views/driver_0/driver_Page_0.vue';
import Driver_Page_1 from '@/views/driver_1/driver_Page_1.vue';
import Driver_Info from '@/views/driver_0/driver_Info.vue';


const routes = [
    {
        path: '/',
        redirect: '/login', // 访问根路径时重定向到 /login
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/driver-0',
        name: 'Driver-0',
        component: Driver_Page_0,
    },
    {
        path: '/driverInfo',
        name: 'DriberInfo',
        component: Driver_Info,
    },
    {
        path: '/driver-1',
        name: 'Driver-1',
        component: Driver_Page_1,
    }

];


const router = createRouter({
    history: createWebHistory(), // 使用 history 模式
    routes,
});

export default router;
