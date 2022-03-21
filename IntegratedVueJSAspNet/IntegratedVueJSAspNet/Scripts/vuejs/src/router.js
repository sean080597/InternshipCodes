import Vue from 'vue'
import VueRouter from 'vue-router';

//vue router
Vue.use(VueRouter)

const routes = [
    { path: '/', component: require('./pages/Home.vue').default },
    { path: '/about', component: require('./pages/About.vue').default },
];

const router = new VueRouter({
    mode: 'history', //removes # (hashtag) from url
    base: '/',
    fallback: true, //router should fallback to hash (#) mode when the browser does not support history.pushState
    routes // short for `routes: routes`
});

export default router;