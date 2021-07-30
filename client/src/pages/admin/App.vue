<template>
	<div class="blog-app-admin-view">
		<Header />
		<div class="blog-app-admin-content">
			<div class="blog-app-admin-sider">
				<Sider />
			</div>
			<div class="blog-admin-content-view">
				<router-view />
			</div>
		</div>
	</div>
</template>

<script>
import Header from "@pages/admin/components/Header/Header"
import Sider from "@pages/admin/components/Sider/Sider"

export default {
	name: "App",

	components: {
		Header,
		Sider,
	},
}
</script>

<style lang="scss" scoped>
</style>
