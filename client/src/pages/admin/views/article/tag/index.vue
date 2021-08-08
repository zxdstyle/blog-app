<template>
	<div class="blog-panel">
		<div class="panel-filter">
			<a-form
				:form="form"
				@submit="handleSubmit"
				class="panel-filter-form"
			>
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
			<div class="filter-action">
				<a-button
					type="primary"
					@click="createTag"
				>
					新建标签
				</a-button>
			</div>
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
					slot="number"
					slot-scope="text, record, index"
				>
					{{ (page - 1) * limit + index + 1 }}
				</template>

				<template
					slot="createTime"
					slot-scope="text, record"
				>
					{{ DateFormat("yyyy-MM-dd HH:mm", record.createTime) }}
				</template>

				<template
					slot="action"
					slot-scope="text, record"
				>
					<a
						@click="() => handleEdit(record)"
					>
						编辑
					</a>
					<a
						@click="() => handleRemove(record)"
					>
						删除
					</a>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
import DateFormat from "@/util/generic/date"
import { mapState, mapGetters, mapActions } from "vuex"
function getColumns() {
	return [
		{
			title: "序号",
			width: "10%",
			scopedSlots: { customRender: "number" },
		},
		{
			title: "名称",
			dataIndex: "title",
		},
		{
			title: "创建时间",
			width: "25%",
			scopedSlots: { customRender: "createTime" },
		},
		{
			title: "操作",
			width: "20%",
			scopedSlots: { customRender: "action" }
		},
	]
}

export default {
	name: "ArticleTag",

	data() {
		this.columns = getColumns();
		this.form = this.$form.createForm(this);
		return {}
	},

	computed: {
		...mapState({
			dataSource: (state) => state.article.tag.tags,
			page: (state) => state.article.tag.page,
			limit: (state) => state.article.tag.limit,
			total: (state) => state.article.tag.total,
			loading: (state) => state.article.tag.loading,
		}),
		...mapGetters({
			totalPage: "article/tag/totalPage",
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
					self.fetchTagList({
						page,
						limit: pageSize,
					})
				},
				onShowSizeChange: (current, size) => {
					self.fetchTagList({
						page: current,
						limit: size,
					})
				},
			}
		},
	},

	mounted() {
		this.fetchTagList()
	},

	methods: {
		DateFormat,
		...mapActions({
			fetchTagList: "article/tag/fetchTagList",
		}),
		handleRemove(record) {
			console.log(record)
		},
		handleEdit(record) {
			console.log(record)
		},
		createTag() {
			this.$message.success("新建标签...")
		},
		handleSubmit(e) {
			e.preventDefault()
			this.form.validateFields((err, values) => {
				if (!err) {
					this.fetchTagList({
						page: 1,
						filter: {
							...values,
						}
					})
				}
			})
		},
	}
}
</script>

<style scoped>

</style>
