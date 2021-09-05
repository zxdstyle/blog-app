import Vue from "vue"
import store from "@/pages/root/store/index"
import router from "@/pages/root/router/index"
import App from "@/pages/root/App"
import Antd from "@/lib/ant-design"
import "@/style/init.scss"
import "@/pages/root/style/global.scss"

Vue.config.productionTip = false

Vue.use(Antd)

new Vue({
	store,
	router,
	render: h => h(App),
}).$mount("#app")
