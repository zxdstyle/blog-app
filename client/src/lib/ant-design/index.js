import {
	Button,
	Input,
	Icon,
	Dropdown,
	Menu,
	message,
	notification,
	Modal,
	BackTop,
	Spin,
	Avatar,
	Result,
	Table,
	Form,
	Select,
	Drawer,
	Upload,
	PageHeader,
	Skeleton,
	Popover,
	Radio,
	ConfigProvider,
} from "ant-design-vue"

const components = [
	Button,
	Input,
	Icon,
	Dropdown,
	Menu,
	message,
	notification,
	Modal,
	BackTop,
	Spin,
	Avatar,
	Result,
	Table,
	Form,
	Select,
	Drawer,
	Upload,
	PageHeader,
	Skeleton,
	Popover,
	Radio,
	ConfigProvider,
]

const install = function (Vue) {
	components.map((component) => {
		Vue.use(component)
	})
	Vue.component(ConfigProvider.name, ConfigProvider)

	Vue.prototype.$message = message
	Vue.prototype.$notification = notification
	Vue.prototype.$info = Modal.info
	Vue.prototype.$success = Modal.success
	Vue.prototype.$error = Modal.error
	Vue.prototype.$warning = Modal.warning
	Vue.prototype.$confirm = Modal.confirm
	Vue.prototype.$destroyAll = Modal.destroyAll
	message.config({
		top: "65px",
		duration: 1.5,
		maxCount: 3,
	})
}

export default {
	install,
}
