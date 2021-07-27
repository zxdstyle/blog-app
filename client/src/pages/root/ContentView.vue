<template>
	<div class="content-view">
		<Header />

		<router-view />
	</div>
</template>

<script>
import Header from "@pages/root/components/Header/Header";

export default {
	name: "ContentView",

	components: {
		Header,
	},
}
</script>

<style lang="scss" scoped>
@import "@/style/lib/_variable";
@import "@/style/lib/_function";
.content-view {
	padding-top: rem($headerH);
}
</style>
