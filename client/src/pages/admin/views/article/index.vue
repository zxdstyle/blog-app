<template>
	<div class="blog-panel">
		<div class="panel-filter">
			<a-form
				:form="form"
				@submit="handleSubmit"
				class="panel-filter-form"
			>
				<a-form-item>
					<a-select
						v-decorator="['publish',{
							initialValue: '',
						}]"
						:options="publishOptions"
						style="width: 120px"
					/>
				</a-form-item>
				<a-form-item>
					<a-input
						v-decorator="['keyword',{
							initialValue: '',
						}]"
						allowClear
						placeholder="关键字..."
					/>
				</a-form-item>
				<a-button
					type="primary"
					html-type="submit"
					:loading="loading"
				>
					搜索
				</a-button>
			</a-form>
		</div>
		<div class="panel-body">
			<a-table
				:row-key="row => row.id"
				:columns="columns"
				:data-source="dataSource"
				:loading="loading"
				:pagination="pagination"
			>
				<template
					slot="action"
				>
					<a>
						详情
					</a>
					<a>
						删除
					</a>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"

const publishOptions = [
	{
		label: "全部",
		value: "",
		key: -1,
	},
	{
		label: "未发布",
		value: 0,
		key: 0,
	},
	{
		label: "已发布",
		value: 1,
		key: 1
	},
]

function getColumns() {
	return [
		{
			title: "标题",
			dataIndex: "title",
			width: "12%"
		},
		{
			title: "简介",
			dataIndex: "intro",
			width: "15%"
		},
		{
			title: "关键字",
			dataIndex: "keyword",
			width: "10%"
		},
		{
			title: "已发布",
			dataIndex: "publish",
			width: "8%"
		},
		{
			title: "作者",
			dataIndex: "username",
			width: "8%"
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			width: "12%"
		},
		{
			title: "操作",
			width: "15%",
			scopedSlots: { customRender: "action" }
		},
	]
}

export default {
	name: "ArticleList",

	data() {
		this.publishOptions = publishOptions
		this.columns = getColumns()
		this.form = this.$form.createForm(this)
		return {}
	},

	computed: {
		...mapState({
			dataSource: (state) => state.article.articleList,
			page: (state) => state.article.page,
			limit: (state) => state.article.limit,
			total: (state) => state.article.total,
			loading: (state) => state.article.loading,
		}),
		...mapGetters({
			totalPage: "article/totalPage",
		}),
		pagination() {
			const self = this
			return {
				showQuickJumper: self.totalPage > 1,
				showSizeChanger: true,
				// hideOnSinglePage: true,
				current: self.page,
				pageSize: self.limit,
				total: self.total || 0,
				pageSizeOptions: ["10", "20", "30", "50"],
				showTotal: (total, range) => {
					return `共 ${self.totalPage} 页, ${total} 条数据`
				},
				onChange: (page, pageSize) => {
					self.fetchArticleList({
						page,
						limit: pageSize,
					})
				},
				onShowSizeChange: (current, size) => {
					self.fetchArticleList({
						page: current,
						limit: size,
					})
				},
			}
		},
	},

	mounted() {
		this.fetchArticleList()
	},

	methods: {
		...mapActions({
			fetchArticleList: "article/fetchArticleList",
		}),
		handleSubmit(e) {
			e.preventDefault()
			this.form.validateFields((err, values) => {
				if (!err) {
					this.fetchArticleList({
						page: 1,
						filter: {
							...values,
						}
					})
				}
			})
		}
	},
}
</script>

<style lang="scss" scoped>

</style>
