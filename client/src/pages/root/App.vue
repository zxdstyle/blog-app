<template>
	<div class="root-dom">
		<router-view />
	</div>
</template>

<script>
export default {
	name: "App",
	components: {
	},
	data() {
		return {
		}
	},
	beforeMount() {
		if (this.$eventBus) {
			this.$eventBus.$on("api-error", this.handleApiError);
		}
	},
	methods: {
		handleApiError(err) {
			this.$message.error(err.message);
		},
	},
}
</script>

<style lang="scss" scoped>
@import "@/style/lib/_variable";
@import "@/style/lib/_function";
.root-dom {
	padding-top: rem($headerH);
}
</style>
