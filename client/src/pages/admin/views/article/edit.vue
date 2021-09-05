<template>
	<div class="blog-panel">
		<a-page-header
			title=" "
			@back="() => $router.back()"
		>
			<template
				slot="backIcon"
			>
				<a-icon type="arrow-left" />
				返回
			</template>
			<template
				slot="extra"
			>
				<a-button
					:disabled="loadingDetail"
					class="success-btn"
					@click="handleSubmit"
				>
					保存
				</a-button>
			</template>
		</a-page-header>
		<div class="panel-filter">
		</div>
		<div class="panel-body">
			<a-spin
				:spinning="loadingDetail"
			>
				<div
					class="form-wrap"
					style="padding: 0 10px"
				>
					<a-form
						:form="form"
						:colon="false"
						@submit="handleSubmit"
					>
						<a-form-item
							label="1.标题"
						>
							<a-input
								v-decorator="['title', {
								inititalValue: '',
								rules: [
									{ required: true, message: '请输入文章标题' }
								]
							}]"
								style="width: 600px"
								placeholder="请输入标题"
							/>
						</a-form-item>

						<a-form-item
							label="2.简介"
						>
							<a-textarea
								v-decorator="['intro', {
								inititalValue: '',
							}]"
								style="width: 600px"
								placeholder="请输入简介"
							/>
						</a-form-item>

						<a-form-item
							label="3.关键字"
						>
							<a-input
								v-decorator="['keyword', {
								inititalValue: '',
							}]"
								style="width: 600px"
								placeholder="请输入关键字"
							/>
						</a-form-item>

						<a-form-item
							label="4.分类"
						>
							<a-select
								v-decorator="['category', {
								inititalValue: '',
								rules: [
									{ required: true, message: '请选择分类' }
								]
							}]"
								:options="categoryOptions"
								placeholder="请选择分类"
								style="width: 600px"
							/>
						</a-form-item>

						<a-form-item
							label="5.标签"
						>
							<a-select
								v-decorator="['tags', {
								inititalValue: '',
								rules: [
									{ required: true, message: '请选择标签' }
								]
							}]"
								:options="tagOptions"
								mode="multiple"
								placeholder="请选择标签"
								style="width: 600px"
							/>
						</a-form-item>

						<a-form-item
							label="6.外链"
							required
						>
							<a-radio-group
								v-model="isLink"
								:options="yesOrNoOptions"
								@change="changeIsLink"
							/>
						</a-form-item>

						<a-form-item
							v-if="isLink > 0"
							label="7.外链地址"
						>
							<a-input
								v-decorator="['link_url', {
								inititalValue: '',
								rules: [
									{required: true, message: '请输入外链地址'}
								]
							}]"
								style="width: 600px"
								placeholder="请输入外链地址"
							/>
						</a-form-item>

						<a-form-item
							label="8.原创"
							required
						>
							<a-radio-group
								v-model="isOriginal"
								:options="yesOrNoOptions"
								@change="changeIsOriginal"
							/>
						</a-form-item>

						<a-form-item
							label="9.置顶"
							required
						>
							<a-radio-group
								v-model="isTop"
								:options="yesOrNoOptions"
								@change="changeIsTop"
							/>
						</a-form-item>

						<a-form-item
							label="10.发布"
							required
						>
							<a-radio-group
								v-model="isPublish"
								:options="yesOrNoOptions"
								@change="changeIsPublish"
							/>
						</a-form-item>

						<a-form-item
							v-if="isLink < 1"
							label="11.内容"
							required
						>
							<byte-editor
								:value="articleContent"
								@change="handleChangeEditor"
							/>
						</a-form-item>
					</a-form>
				</div>
			</a-spin>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import { Editor as ByteEditor } from "@/components/ByteMd/ByteMd"

const yesOrNoOptions = [
	{ label: "是", value: "1", key: 1 },
	{ label: "否", value: "0", key: 0 },
]

export default {
	name: "EditArticle",

	components: {
		ByteEditor,
	},

	data() {
		this.form = this.$form.createForm(this)
		return {
			articleContent: "",
			isLink: yesOrNoOptions[1].value,
			isOriginal: yesOrNoOptions[0].value,
			isTop: yesOrNoOptions[1].value,
			isPublish: yesOrNoOptions[0].value,
			uuid: null,
		}
	},

	computed: {
		...mapState({
			categories: (state) => state.article.category.categories,
			tags: (state) => state.article.tag.tags,
			loadingDetail: (state) => state.article.loadingDetail,
		}),
		categoryOptions() {
			return this.categories.map((cate) => ({
				key: cate.id,
				value: cate.id,
				label: cate.title,
			}))
		},
		tagOptions() {
			return this.tags.map((tag) => ({
				key: tag.id,
				value: tag.id,
				label: tag.title,
			}))
		},
		yesOrNoOptions() {
			return yesOrNoOptions
		},
	},

	mounted() {
		this.fetchCategoryList({ page: 1, limit: 1000 })
		this.fetchTagList({ page: 1, limit: 1000 })
		this.initForm()
	},

	methods: {
		...mapActions({
			updateArticle: "article/updateArticle",
			fetchArticleDetail: "article/getArticleDetail",
			fetchCategoryList: "article/category/fetchCategoryList",
			fetchTagList: "article/tag/fetchTagList",
		}),
		initForm() {
			const { articleId } = this.$route.params
			this.fetchArticleDetail({ uuid: articleId })
				.then(({ model }) => {
					const {
						uuid,
						title,
						intro,
						keyword,
						content,
						category_id,
						tags,
						is_link,
						link_url,
						is_top,
						is_original,
						publish,
					} = model
					const transferFields = {
						category: category_id,
						tags: tags.map((t) => t.id),
					}
					this.form.setFieldsValue({
						title,
						intro,
						keyword,
						link_url,
						...transferFields,
					})
					this.$nextTick(() => {
						this.uuid = uuid
						this.articleContent = `${content}`
						this.isLink = `${is_link}`
						this.isTop = `${is_top}`
						this.isOriginal = `${is_original}`
						this.isPublish = `${publish}`
					})
				})
		},
		handleSubmit(e) {
			e ? e.preventDefault() : null
			this.form.validateFields((err, values) => {
				if (!err) {
					const formData = {
						...values,
						content: this.articleContent,
						is_link: this.isLink,
						is_original: this.isOriginal,
						is_top: this.isTop,
						publish: this.isPublish,
					}
					const loading = this.$message.loading("请稍后...", -1)
					const payload = {
						formData,
						uuid: this.uuid,
					}
					this.updateArticle(payload)
						.then(({ success }) => {
							if (success) {
								loading()
								this.$message.success("更新成功!")
								this.$router.go(-1)
							}
						})
				}
			})
		},
		handleChangeEditor(val) {
			this.articleContent = val
		},
		changeIsLink(e) {
			this.isLink = e.target.value
		},
		changeIsOriginal(e) {
			this.isOriginal = e.target.value
		},
		changeIsTop(e) {
			this.isTop = e.target.value
		},
		changeIsPublish(e) {
			this.isPublish = e.target.value
		},
	}
}
</script>

<style scoped>

</style>
