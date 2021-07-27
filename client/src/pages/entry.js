import Vue from "vue"
import store from "@/pages/root/store/index"
import router from "@/pages/root/router/index"
import App from "@/pages/root/App"
import Antd from "@/pages/root/lib/ant-design"
import "@/style/init.scss"

Vue.config.productionTip = false

Vue.use(Antd)

new Vue({
	store,
	router,
	render: h => h(App),
}).$mount("#app")
