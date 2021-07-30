import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

export const menuRoutes = [
	{
		path: "/home",
		title: "统计",
		name: "home",
		key: "home",
		showMenu: true,
		component: () => import("@/pages/admin/views/Home"),
		meta: {
			matchRoute: "home",
		},
	},
	{
		path: "/article",
		title: "文章管理",
		key: "article",
		showMenu: true,
		children: [
			{
				path: "",
				title: "文章列表",
				name: "articleList",
				key: "articleList",
				showMenu: true,
				meta: {
					matchRoute: "articleList",
				},
			},
			{
				path: "detail/:articleId",
				title: "文章详情",
				name: "articleDetail",
				key: "articleDetail",
				showMenu: false,
				meta: {
					matchRoute: "articleDetail",
				}
			},
			{
				path: "category",
				title: "文章分类",
				name: "articleCategory",
				key: "articleCategory",
				showMenu: true,
				meta: {
					matchRoute: "articleCategory",
				}
			},
			{
				path: "tags",
				title: "文章标签",
				name: "articleTag",
				key: "articleTag",
				showMenu: true,
				meta: {
					matchRoute: "articleTag",
				}
			},
		]
	}
]

export default new VueRouter({
	mode: "hash",
	routes: [
		{
			path: "",
			redirect: "/home"
		},
		...menuRoutes,
	],
})
