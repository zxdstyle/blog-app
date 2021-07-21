<template>
	<div>
		<a-button>ss</a-button>
		<Viewer
			:value="value"
		/>
		<Editor
			:value="value"
			@change="handleChange"
		/>
	</div>
</template>

<script>
import { Viewer, Editor } from "@pages/root/components/ByteMd.jsx";

export default {
	name: "App",
	components: {
		Editor,
		Viewer,
	},
	data() {
		return {
			value: "## 我是标题",
		}
	},
	methods: {
		handleChange(v) {
			this.value = v;
		},
	},
}
</script>

<style scoped>

</style>
