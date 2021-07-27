import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

// 顶部菜单路由
export const headerMenuRoutes = [
	{
		title: "主页",
		path: "",
		name: "home",
		link: true,
		component: () => import("@/pages/root/views/Home"),
		meta: {
			mathRouteName: "home",
		},
	},
	{
		title: "分类",
		path: "/category",
		name: "category",
		link: true,
		component: () => import("@/pages/root/views/Category/index"),
		meta: {
			mathRouteName: "category",
		},
	},
	{
		title: "标签",
		path: "/tag",
		name: "tag",
		link: true,
		component: () => import("@/pages/root/views/Tag/index"),
		meta: {
			mathRouteName: "tag",
		},
	},
	{
		title: "归档",
		path: "/timeline",
		name: "timeline",
		link: true,
		component: () => import("@/pages/root/views/Timeline/index"),
		meta: {
			mathRouteName: "timeline",
		},
	},
]

export default new VueRouter({
	mode: "hash",
	routes: [
		{
			path: "",
			component: () => import("@/pages/root/ContentView"),
			children: [
				...headerMenuRoutes,
				{
					path: "search",
					name: "search",
					component: () => import("@/pages/root/views/Search/index"),
					meta: {}
				}
			]
		}
	],
})
