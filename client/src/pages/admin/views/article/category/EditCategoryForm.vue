<template>
	<a-form
		:form="form"
		@submit="handleSubmit"
	>
		<a-form-item
			label="名称"
		>
			<a-input
				v-decorator="[FORM_FIELD.TITLE, {
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
	name: "EditCategoryForm",

	inject: ["emitClose", "emitSubmit"],

	props: {
		loading: {
			type: Boolean,
			default: false,
		},
		formData: {
			type: Object,
			default: () => {},
		}
	},

	data() {
		this.FORM_FIELD = {
			TITLE: "title",
		}
		return {
			form: this.$form.createForm(this),
		}
	},

	mounted() {
		this.initForm()
	},

	methods: {
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
					console.log(values)
					this.emitSubmit(values)
				}
			})
		},
		initForm() {
			const fields = {}
			Object.values(this.FORM_FIELD).forEach((key) => {
				fields[key] = this.formData[key]
			})
			this.form.setFieldsValue(fields)
		},
	}
}
</script>

<style scoped>

</style>
