<template>
	<div>
		<a-button>ss</a-button>
		<Editor
			:value="value"
			:plugins="plugins"
			:locale="locale"
			@change="handleChange"
		/>
		<Viewer
			:value="value"
			:plugins="plugins"
		/>
		<ByteMd />
	</div>
</template>

<script>
import 'bytemd/dist/index.min.css'
import "highlight.js/styles/github.css"
import "juejin-markdown-themes/dist/juejin.min.css"
import zhHans from "bytemd/lib/locales/zh_Hans.json"
import gfm from '@bytemd/plugin-gfm'
import gemoji from "@bytemd/plugin-gemoji"
import highlight from "@bytemd/plugin-highlight"
import breaks from "@bytemd/plugin-breaks"
import footnotes from "@bytemd/plugin-footnotes"
import frontmatter from "@bytemd/plugin-frontmatter"
import highlightSsr from "@bytemd/plugin-highlight-ssr"
import math from "@bytemd/plugin-math"
import { Editor, Viewer } from "@bytemd/vue"
import ByteMd from "@pages/root/components/ByteMd.jsx";

const plugins = [
	gfm(),
	gemoji(),
	highlight(),
	breaks(),
	footnotes(),
	frontmatter(),
	highlightSsr(),
	math(),
]

export default {
	name: "App",
	components: {
		Editor,
		Viewer,
		ByteMd,
	},
	data() {
		return {
			value: "hello",
			locale: zhHans,
			plugins,
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
