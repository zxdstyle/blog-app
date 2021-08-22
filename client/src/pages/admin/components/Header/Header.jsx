/* eslint-disable */
/**
 * admin Header
 */

import "./index.scss"

import { mapState } from "vuex"

const Header = {
	computed: {
		...mapState({
			loading: (state) => state.user.loading,
			hasLogin: (state) => state.user.hasLogin,
			userInfo: (state) => state.user.userInfo,
		}),
	},

	render() {
		return (
			<div class={"blog-admin-header"}>
				<div class="blog-admin-header-actions">
					<a-spin
						spinning={this.loading}
						style={"position: absolute; z-index: 2; right: 40px; top: 18px"}
					>
						<a-icon slot="indicator" type="loading" style="font-size: 26px"  spin />
					</a-spin>
					{
						this.hasLogin ? (
							<a-dropdown>
								<span style={"cursor: default"}>
									{
										this.userInfo.avatar ? (
											<a-avatar
												src={this.userInfo.avatar}
												icon="user"
											/>
										) : (
											<a-avatar
												style="backgroundColor:#87d068"
												icon="user"
											/>
										)
									}
									<span style={"margin: 0 5px"}>
										{this.userInfo.username || `用户${this.userInfo.uuid}`}
									</span>
									<a-icon type="down" />
								</span>
								<a-menu slot="overlay">
									<a-menu-item>
										<a href="javascript:;">登出</a>
									</a-menu-item>
									<a-menu-item>
										<a href="/">去网站</a>
									</a-menu-item>
								</a-menu>
							</a-dropdown>
						) : null
					}
				</div>
			</div>
		)
	}
}

export default Header
