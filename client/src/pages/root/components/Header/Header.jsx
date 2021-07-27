/* eslint-disable */
/**
 * 通用Header
 */

import "./index.scss"
import { headerMenuRoutes } from "@/pages/root/router"

const headerMenus = [
	...headerMenuRoutes.map((route) => ({
		title: route.title,
		pathname: route.name,
		link: true,
	})),
	{
		title: "其他",
		slot: "hover",
		link: false,
		children: [
			{
				title: "Github",
				path: "https://github.com/Peachick",
			},
			{
				title: "掘金",
				path: "https://juejin.cn/user/2999123453679656",
			}
		],
	}
]

const Header = {
	data() {
		return {
			searchKey: "",
		}
	},

	computed: {
		activeMenu() {
			return this.$route.meta.mathRouteName
		}
	},

	methods: {
		handleSearch() {
			if (!this.searchKey) {
				this.$message.warn("请输入内容...")
				return
			}
			this.$router.push({ name: "search", query: { query: this.searchKey }})
		},
		routerPush(pathname) {
			const { name } = this.$route
			if (pathname !== name) {
				this.$router.push({ name: pathname })
			}
		},
	},

	render() {
		return (
			// eslint-disable-next-line react/react-in-jsx-scope
			<div class={"blog-header"}>
				{/*菜单往左*/}
				<ul
					class="header-menus"
				>
					{headerMenus.map((menu) => {
						{
							return menu.slot === "hover"
								? (
									<a-dropdown
										class={"menu-item"}
									>
										<a class="ant-dropdown-link">
											{menu.title} <a-icon type="down" />
										</a>
										<a-menu slot="overlay">
											{
												menu.children.map((child) => {
													return <a-menu-item
														key={child.title}
													>
														<a
															href={child.path}
															target="_blank"
														>
															{child.title}
														</a>
													</a-menu-item>
												})
											}
										</a-menu>
									</a-dropdown>
								)
								: (
									<li
										class={`menu-item ${this.activeMenu === menu.pathname ? 'active' : ''}`}
									>
										<a
											href="javascript:;"
											onClick={() => this.routerPush(menu.pathname)}
										>
											{menu.title}
										</a>
									</li>
								)
						}
					})}
				</ul>

				<div class="header-action">
					<a-input-search
						v-model={this.searchKey}
						placeholder="请输入..."
						style="width: 150px"
						onSearch={this.handleSearch}
					/>
					<a
						class={"logo-link"}
						href="/login"
					>
						登录
					</a>
				</div>
			</div>
		)
	}
}

export default Header
