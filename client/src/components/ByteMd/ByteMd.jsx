/* eslint-disable */
/**
 * 字节markdown
 */
import {
	Editor as ByteEditor,
	Viewer as ByteViewer,
} from "@bytemd/vue"
import "bytemd/dist/index.min.css"
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

import "./index.scss"

const plugins = [
	gfm(),
	highlight(),
	gemoji(),
	breaks(),
	footnotes(),
	frontmatter(),
	highlightSsr(),
	math(),
]

const commonProps = {
		props: {
			value: {
				type: String,
				default: "",
			},
			plugins: {
				type: Array,
				default: () => plugins,
			},
			locale: {
				type: Object,
				default: () => zhHans,
			},
		},
}

/**
 * 查看
 * @type {{}}
 */
export const Viewer = {
	...commonProps,

	render() {
		return (
			<ByteViewer
				value={this.value}
				locale={this.locale}
				plugins={this.plugins}
			/>
		)
	}
}

/**
 * 编辑
 * @type {{}}
 */
export const Editor = {
	...commonProps,

	methods: {
		handleUpload(files) {
			console.log(files)
		},
	},

	render() {
		return (
			<ByteEditor
				value={this.value}
				locale={this.locale}
				plugins={this.plugins}
				placeholder={'请输入...'}
				{...{
					on: {
						change: (...args) => this.$emit("change", ...args),
						uploadImages: this.handleUpload
					}
				}}
			/>
		)
	}
}
