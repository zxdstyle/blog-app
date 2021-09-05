<template>
	<div class="content-view">
		<Header />

		<router-view />

		<MusicPlayer />

		<a-back-top />
	</div>
</template>

<script>
import Header from "@pages/root/components/Header/Header";
import MusicPlayer from "@pages/root/components/MusicPlayer/MusicPlayer";

export default {
	name: "ContentView",

	components: {
		Header,
		MusicPlayer,
	},
}
</script>

<style lang="scss" scoped>
@import "@/style/lib/_variable";
@import "@/style/lib/_function";
.content-view {
	width: 100%;
	max-width: 960px;
	margin: 0 auto;
}
</style>
