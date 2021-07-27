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
.root-dom {
	height: 100vh;
	overflow-y: auto;
}
</style>
