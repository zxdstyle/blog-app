import Vue from "vue"
import App from "./App"
import store from "@/pages/admin/store"
import router from "@/pages/admin/router"
import Antd from "@/lib/ant-design"
import "@/style/init.scss"
import "@/pages/admin/style/global.scss"

import eventBus from "@/util/event-bus"

Vue.config.productionTip = false

Vue.prototype.$eventBus = eventBus

Vue.use(Antd)

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount("#app")
