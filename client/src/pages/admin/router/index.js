import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

export const menuRoutes = [
	{
		path: "/home",
		title: "统计",
		icon: "bar-chart",
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
		icon: "form",
		key: "article",
		showMenu: true,
		children: [
			{
				path: "list",
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
					matchRoute: "articleList",
				}
			},
			{
				path: "detail/:articleId/comment",
				title: "文章评论",
				name: "articleComment",
				key: "articleComment",
				showMenu: false,
				meta: {
					matchRoute: "articleList",
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
	},
	{
		path: "/music",
		title: "音乐管理",
		icon: "customer-service",
		name: "music",
		key: "music",
		showMenu: true,
		meta: {},
		children: [
			{
				path: "list",
				title: "歌曲列表",
				name: "musicList",
				key: "musicList",
				showMenu: true,
				meta: {},
			},
		],
	},
	{
		path: "/message",
		title: "留言列表",
		icon: "message",
		name: "message",
		key: "message",
		showMenu: true,
		meta: {},
	},
	{
		path: "/resource",
		title: "资源管理",
		icon: "cloud-server",
		name: "resource",
		key: "resource",
		showMenu: true,
		meta: {},
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
