/* eslint-disable */
/**
 * admin Header
 */

import "./index.scss"

const Header = {
	render() {
		return (
			<div class={"blog-admin-header"}>
				<div class="blog-admin-header-actions">

					<a-dropdown>
						<a-avatar
							style="backgroundColor:#87d068"
							icon="user"
						/>
						<a-icon type="down" />
						<a-menu slot="overlay">
							<a-menu-item>
								<a href="javascript:;">登出</a>
							</a-menu-item>
						</a-menu>
					</a-dropdown>
				</div>
			</div>
		)
	}
}

export default Header
