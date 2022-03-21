window._ = require('lodash');
window.Vue = require('vue')

import Vue from 'vue'
import router from './router';
import Vuetify from 'vuetify';

//vuetify
Vue.use(Vuetify)

//vue components
Vue.component('AppHome', require('./layouts/AppHome.vue').default);

new Vue({
    el: '#app',
    router
})