import Vue from "vue"
import App from "./root/App"
import { Button } from "ant-design-vue"

Vue.use(Button)

new Vue({
	render: h => h(App),
}).$mount("#app")