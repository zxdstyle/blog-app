<template>
	<a-config-provider
		:locale="locale"
	>
		<div class="blog-app-admin-view">
			<Header />
			<div

				class="blog-app-admin-content"
			>
				<div class="blog-app-admin-sider">
					<Sider />
				</div>
				<div
					v-if="hasLogin"
					class="blog-admin-content-view"
				>
					<router-view />
				</div>
			</div>
			<a-result
				v-if="failAuth"
				status="403"
				title="401"
				sub-title="对不起，你没有权限访问此应用！"
			>
				<template #extra>
					<a
						href="/"
					>
						返回
					</a>
				</template>
			</a-result>
		</div>
	</a-config-provider>

</template>

<script>
import { mapActions, mapState } from "vuex"
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN"
import Header from "@pages/admin/components/Header/Header"
import Sider from "@pages/admin/components/Sider/Sider"

export default {
	name: "App",

	components: {
		Header,
		Sider,
	},

	data() {
		return {
			locale: zh_CN
		}
	},

	computed: {
		...mapState({
			hasLogin: (state) => state.user.hasLogin,
			failAuth: (state) => state.user.failAuth,
		}),
	},

	beforeMount() {
		if (this.$eventBus) {
			this.$eventBus.$on("api-error", this.handleApiError);
		}
	},

	mounted() {
		this.fetchUserInfo()
	},

	methods: {
		...mapActions({
			fetchUserInfo: "user/fetchUserInfo",
		}),

		handleApiError(err) {
			this.$message.error(err.message);
		},
	}
}
</script>

<style lang="scss" scoped>
</style>
