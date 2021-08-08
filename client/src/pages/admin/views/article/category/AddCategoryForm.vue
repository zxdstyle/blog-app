<template>
	<a-form
		:form="form"
		@submit="handleSubmit"
	>
		<a-form-item
			label="名称"
		>
			<a-input
				v-decorator="['title', {
					initialValue: '',
					rules: [
						{ required: true, message: '请输入分类名' }
					]
				}]"
				placeholder="请输入分类名..."
			/>
		</a-form-item>
		<div class="drawer-bottom-elem">
			<a-button
				@click="() => emitClose()"
			>
				取消
			</a-button>
			<a-button
				type="primary"
				html-type="submit"
				:loading="loading"
			>
				确定
			</a-button>
		</div>
	</a-form>
</template>

<script>
export default {
	name: "AddCategoryForm",

	inject: ["emitClose", "emitSubmit"],

	props: {
		loading: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		this.form = this.$form.createForm(this)
		return {
		}
	},

	methods: {
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
					this.emitSubmit(values)
				}
			})
		}
	}
}
</script>

<style scoped>

</style>
