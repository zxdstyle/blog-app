<template>
	<a-drawer
		:title="title"
		:visible="visible"
		:closable="false"
		:width="600"
		:destroy-on-close="true"
		:mask-closable="false"
		@close="() => handleClose()"
	>
		<slot />
	</a-drawer>
</template>

<script>
export default {
	name: "Drawer",

	provide() {
		return {
			emitClose: this.handleClose,
			emitSubmit: this.handleSubmit,
		}
	},

	props: {
		title: {
			type: String,
			default: "标题",
		},
		visible: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		handleClose(...args) {
			this.$emit("close", ...args)
		},
		handleSubmit(...args) {
			this.$emit("submit", ...args)
		}
	},
}
</script>

<style lang="scss" scoped>
.ant-drawer-wrapper-body{
	padding-bottom: 60px;
	.ant-drawer-body{
		padding: 20px;
	}
}
::v-deep .drawer-bottom-elem {
	position: absolute;
	right: 0;
	bottom: 0;
	width: 100%;
	border-top: 1px solid #e9e9e9;
	padding: 10px 16px;
	background: #fff;
	text-align: right;
	z-index: 1;

	button {
		margin-right: 8px;

		&:last-of-type {
			margin-right: 0
		}
	}
}
</style>
