/* eslint-disable */
/**
 * Sider
 */

import { menuRoutes } from "@/pages/admin/router"
import "./index.scss"

function getMenuOpenKeys(menu, selectedKey) {
	let keys = [];
	for (let i = 0; i < menu.length; i++) {
		keys = [];
		keys.push(menu[i].key)
		if (menu[i].key === selectedKey) {
			break
		} else if (Array.isArray(menu[i].children)) {
			const child = menu[i].children.filter((childMenu) => childMenu.key === selectedKey)
			if (child.length) {
				keys.push(child[0].key)
				break
			}
		}
	}
	return keys
}

const Sider = {
	data() {
		return {}
	},

	computed: {
		selectedMenu() {
			return this.$route.name || menuRoutes[0].name
		},
		openMenus() {
			return getMenuOpenKeys(menuRoutes, this.selectedMenu)
		},
	},

	mounted() {
	},

	methods: {
		handleClickMenu({ key }) {
			this.$router.push({ name: key })
		},
	},

	render() {
		return (
			<div class={"blog-admin-sider"}>
				<a-menu
					selected-keys={[this.selectedMenu]}
					default-open-keys={this.openMenus}
					mode="inline"
					class={"blog-admin-sider-menu"}
					onClick={this.handleClickMenu}
				>
					{
						menuRoutes.map((menu) => {
							return menu.children
								? (
									<a-sub-menu key={menu.key}>
										<span slot="title">
											<a-icon type="mail" />
											<span>{menu.title}</span>
										</span>
										{
											menu.children.map((subMenu) => {
												return subMenu.showMenu ? (
													<a-menu-item key={subMenu.key}>
														{subMenu.title}
													</a-menu-item>
												) : null
											})
										}
									</a-sub-menu>
								)
								: (
									<a-menu-item key={menu.key}>
										<a-icon type="pie-chart" />
										<span>{menu.title}</span>
									</a-menu-item>
								)
						})
					}
				</a-menu>
			</div>
		)
	}
}

export default Sider
