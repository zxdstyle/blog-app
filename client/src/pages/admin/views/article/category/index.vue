<template>
	<div class="blog-panel">
		<div class="panel-filter">
			<a-form
				:form="form"
				@submit="handleSearch"
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
					@click="() => openDrawer(DRAWER_TYPE.ADD_CATEGORY)"
				>
					新建分类
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
					slot="articles"
					slot-scope="text"
				>
					{{ text }}篇
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
						@click="() => openDrawer(DRAWER_TYPE.EDIT_CATEGORY, record)"
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

		<drawer
			:visible="visible"
			:title="drawerTitle"
			@submit="handleSubmit"
			@close="closeDrawer"
		>
			<add-form
				v-if="drawerType === DRAWER_TYPE.ADD_CATEGORY"
				:form-data="formData"
				:loading="loadingSubmit"
			/>
			<edit-form
				v-if="drawerType === DRAWER_TYPE.EDIT_CATEGORY"
				:form-data="formData"
				:loading="loadingSubmit"
			/>
		</drawer>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import { getAfterActionPage } from "@/util"
import DateFormat from "@/util/generic/date"

const Drawer = () => import(/* webpackChunkName: "Drawer" */"@/pages/admin/components/Drawer")
const AddForm = () => import(/*webpackChunkName: "AddCategoryForm"*/"@/pages/admin/views/article/category/AddCategoryForm")
const EditForm = () => import(/*webpackChunkName: "EditCategoryForm"*/"@/pages/admin/views/article/category/EditCategoryForm")

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
			title: "所属文章",
			dataIndex: "articles",
			scopedSlots: { customRender: "articles" },
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

const DRAWER_TYPE = {
	EDIT_CATEGORY: 'add_category',
	ADD_CATEGORY: 'edit_category',
}

export default {
	name: "ArticleCategory",

	components: {
		Drawer,
		AddForm,
		EditForm,
	},

	data() {
		this.DRAWER_TYPE = DRAWER_TYPE
		this.DRAWER_TITLE = {
			[DRAWER_TYPE.ADD_CATEGORY]: "新建分类",
			[DRAWER_TYPE.EDIT_CATEGORY]: '编辑分类',
		}
		this.DRAWER_API = {
			[DRAWER_TYPE.ADD_CATEGORY]: this.handleCreateCategory,
			[DRAWER_TYPE.EDIT_CATEGORY]: this.handleEditCategory,
		}
		this.columns = getColumns();
		this.form = this.$form.createForm(this);
		return {
			visible: false,
			drawerType: '',
			drawerTitle: '',
			loadingSubmit: false,
			formData: {},
		}
	},

	computed: {
		...mapState({
			dataSource: (state) => state.article.category.categories,
			page: (state) => state.article.category.page,
			limit: (state) => state.article.category.limit,
			total: (state) => state.article.category.total,
			loading: (state) => state.article.category.loading,
		}),
		...mapGetters({
			totalPage: "article/category/totalPage",
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
					self.fetchCategoryList({
						page,
						limit: pageSize,
					})
				},
				onShowSizeChange: (current, size) => {
					self.fetchCategoryList({
						page: current,
						limit: size,
					})
				},
			}
		},
	},

	mounted() {
		this.fetchCategoryList()
	},

	methods: {
		DateFormat,
		...mapActions({
			fetchCategoryList: "article/category/fetchCategoryList",
			createCategory: "article/category/createCategory",
			removeCategory: "article/category/removeCategory",
			updateCategory: "article/category/updateCategory",
		}),
		handleRemove(record) {
			const self = this
			const page = getAfterActionPage(this.total, this.limit, this.page)
			this.$confirm({
				title: `您确定要删除 ${record.title} 分类吗？`,
				okType: "danger",
				onOk() {
					const loading = self.$message.loading("操作中...", -1)
					self.removeCategory({ id: record.id })
						.then(() => {
							loading()
							self.$message.success("删除成功!")
							self.fetchCategoryList({ page })
						})
						.catch(loading)
				}
			})
		},
		handleEditCategory(formData) {
			this.loadingSubmit = true
			const loading = this.$message.loading("请稍后...", -1)
			const { title }  = formData
			const payload = {
				id: this.formData.id,
				title,
			}
			this.updateCategory(payload)
				.then(() => {
					this.loadingSubmit = false
					loading()
					this.$message.success("编辑成功!")
					this.closeDrawer();
					this.fetchCategoryList();
				})
				.catch(() => {
					this.loadingSubmit = false
				})
		},
		handleCreateCategory(formData) {
			this.loadingSubmit = true
			const loading = this.$message.loading("请稍后...", -1)
			this.createCategory(formData)
				.then(() => {
					this.loadingSubmit = false
					loading()
					this.$message.success("添加成功!")
					this.closeDrawer();
					this.fetchCategoryList();
				})
				.catch(() => {
					this.loadingSubmit = false
				})
		},
		handleSubmit(formData) {
			this.DRAWER_API[this.drawerType](formData)
		},
		handleSearch(e) {
			e.preventDefault()
			this.form.validateFields((err, values) => {
				if (!err) {
					this.fetchCategoryList({
						page: 1,
						filter: {
							...values,
						}
					})
				}
			})
		},
		openDrawer(drawerType, data) {
			if (data) {
				this.formData = data
			}
			this.visible = true
			this.drawerType = drawerType
			this.drawerTitle = this.DRAWER_TITLE[drawerType]
		},
		closeDrawer() {
			this.visible = false
			this.drawerTitle = ""
			this.formData = {}
		},
	}
}
</script>

<style scoped>

</style>
