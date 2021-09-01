import { createApp } from 'vue'
import { DatePicker, TimePicker, Radio, Button, Tag } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import Toast from 'vue-toastification'
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'

import store from './store/index'
import './assets/main.css'

import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'
import { createMetaManager } from 'vue-meta'

const options = {
  // You can set your default options here
}

const app = createApp(App)
app.use(DatePicker);
app.use(TimePicker);
app.use(Radio)
app.use(Button)
app.use(Tag)
app.use(Toast, options)
app.use(router)
app.use(store)
app.use(createMetaManager())

app.component('default-layout', DashboardLayout)
app.component('empty-layout', EmptyLayout)

app.mount('#app')
