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
	methods: {
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
