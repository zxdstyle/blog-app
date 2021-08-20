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
					<a-select
						v-decorator="['category',{
							initialValue: undefined,
						}]"
						:options="categoryOptions"
						placeholder="请选择分类..."
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

			<div class="filter-action">
				<a-button
					type="primary"
					@click="() => $router.push({ name: 'createArticle', query: { _t: +new Date } })"
				>
					新建文章
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
					slot="publish"
					slot-scope="text"
				>
					<span
						v-if="text"
						class="theme-success"
					>
						已发布
					</span>
					<span
						v-else
						class="theme-danger"
					>
						未发布
					</span>
				</template>

				<template
					slot="tags"
					slot-scope="text"
				>
					{{ text.map((t) => t.title).join(",") }}
				</template>

				<template
					slot="createTime"
					slot-scope="text"
				>
					{{ DateFormat("yyyy-MM-dd HH:mm", text) }}
				</template>

				<template
					slot="updateTime"
					slot-scope="text"
				>
					{{ DateFormat("yyyy-MM-dd HH:mm", text) }}
				</template>

				<template
					slot="action"
					slot-scope="text, record"
				>
					<a
						@click="() => openDrawer(DRAWER_TYPE_MAP.VIEW_ARTICLE, record)"
					>
						预览
					</a>
					<a
						@click="() => $router.push({ name: 'articleEdit', params: { articleId: record.uuid } })"
					>
						编辑
					</a>
					<a
						@click="() => handleRemoveArticle(record)"
					>
						删除
					</a>
				</template>
			</a-table>
		</div>

		<modal
			:visible="drawerVisible"
			:type="drawerType"
			:title="DRAWER_TYPE_TITLE[drawerType]"
			:width="900"
			@close="closeDrawer"
			@ok="handleSubmitDrawer"
		>
			<byte-view
				v-if="drawerVisible && drawerType === DRAWER_TYPE_MAP.VIEW_ARTICLE"
				:value="articleContent"
			/>
		</modal>

	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import { getAfterActionPage } from "@/util"
import { GetArticleDetail } from "@api/article/article-api"
import DateFormat from "@/util/generic/date"
import { Viewer as ByteView} from "@/components/ByteMd/ByteMd"
import Drawer from "@pages/admin/components/Drawer"
import Modal from "@pages/admin/components/Modal"

const DRAWER_TYPE_MAP = {
	VIEW_ARTICLE: 'view_article',
}

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
			width: "12%"
		},
		{
			title: "关键字",
			dataIndex: "keyword",
			width: "10%"
		},
		{
			title: "分类",
			dataIndex: "category",
			width: "8%"
		},
		{
			title: "标签",
			dataIndex: "tags",
			width: "12%",
			scopedSlots: { customRender: "tags" },
		},
		{
			title: "已发布",
			dataIndex: "publish",
			width: "8%",
			scopedSlots: { customRender: "publish" },
		},
		{
			title: "作者",
			dataIndex: "username",
			width: "8%"
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			width: "10%",
			scopedSlots: { customRender: "createTime" },
		},
		{
			title: "更新时间",
			dataIndex: "updateTime",
			width: "10%",
			scopedSlots: { customRender: "updateTime" },
		},
		{
			title: "操作",
			scopedSlots: { customRender: "action" }
		},
	]
}

export default {
	name: "ArticleList",

	components: {
		Modal,
		ByteView,
		Drawer,
	},

	data() {
		this.DRAWER_TYPE_MAP = DRAWER_TYPE_MAP
		this.DRAWER_TYPE_TITLE = {
			[DRAWER_TYPE_MAP.VIEW_ARTICLE]: "预览",
		}
		this.DRAWER_TYPE_API = {
			[DRAWER_TYPE_MAP.VIEW_ARTICLE]: this.previewArticle,
		}
		this.publishOptions = publishOptions
		this.columns = getColumns()
		this.form = this.$form.createForm(this)
		return {
			articleContent: '',
			drawerVisible: false,
			drawerType: null,
		}
	},

	computed: {
		...mapState({
			dataSource: (state) => state.article.articleList,
			page: (state) => state.article.page,
			limit: (state) => state.article.limit,
			total: (state) => state.article.total,
			loading: (state) => state.article.loading,
			categories: (state) => state.article.category.categories,
		}),
		...mapGetters({
			totalPage: "article/totalPage",
		}),
		categoryOptions() {
			return [
				{
					key: "all",
					value: "",
					label: "全部",
				},
				...this.categories.map((cate) => ({
					key: cate.id,
					value: cate.id,
					label: cate.title,
				})),
			]
		},
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
		this.fetchCategoryList({ page: 1, limit: 1000, dontSyncPages: true })
	},

	methods: {
		...mapActions({
			fetchArticleList: "article/fetchArticleList",
			removeArticle: "article/removeArticle",
			fetchCategoryList: "article/category/fetchCategoryList",
		}),
		DateFormat,
		handleRemoveArticle({ uuid, title }) {
			const self = this
			this.$confirm({
				title: `您确定要删除 《${title}》 此文章吗？`,
				okType: "danger",
				onOk() {
					const loading = self.$message.loading("请稍后...", -1)
					self.removeArticle({ uuid })
						.then((res) => {
							loading()
							self.$message.success("删除成功!")
							const page = getAfterActionPage(self.total, self.limit, self.page)
							self.fetchArticleList({ page })
						})
				}
			})
		},
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
		},
		async previewArticle({ uuid }) {
			const loading = this.$message.loading("加载中...", -1)
			const api = new GetArticleDetail({ uuid })
			try {
				const { model } = await api.send()
				if (model) {
					const {
						title,
						content,
					} = model
					this.articleContent = content
					this.visible = true
				}
			} finally {
				loading()
			}
		},
		handleSubmitDrawer(drawerType) {
			console.log(drawerType)
			this.closeDrawer()
		},
		async openDrawer(drawerType, record) {
			const openDrawerApi = this.DRAWER_TYPE_API[drawerType]
			if (openDrawerApi) {
				await openDrawerApi(record)
			}
			this.drawerType = drawerType
			this.drawerVisible = true
		},
		closeDrawer() {
			this.drawerVisible = false
			this.drawerType = null
		},
	},
}
</script>

<style lang="scss" scoped>

</style>
