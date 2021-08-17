<template>
	<a-modal
		:visible="visible"
		:title="title"
		:width="`${width}px`"
		@cancel="$emit('close')"
		@ok="$emit('ok', type)"
	>
		<slot />
	</a-modal>
</template>

<script>
export default {
	name: "Modal",

	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: "标题",
		},
		width: {
			type: Number,
			default: 800,
		},
	},
}
</script>

<style lang="scss" scoped>
::v-deep .ant-modal {
	top: 5vh;
}
::v-deep .ant-modal-content {
	height: 90vh;
}
::v-deep .ant-modal-body {
	height: calc(90vh - 110px);
	overflow-y: auto;
}
</style>
