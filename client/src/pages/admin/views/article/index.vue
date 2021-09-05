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
							initialValue: undefined,
						}]"
						:options="publishOptions"
						placeholder="状态..."
						style="width: 100px"
					/>
				</a-form-item>

				<a-form-item>
					<a-select
						v-decorator="['category',{
							initialValue: undefined,
						}]"
						:options="categoryOptions"
						placeholder="分类..."
						style="width: 120px"
					/>
				</a-form-item>

				<a-form-item>
					<a-select
						v-decorator="['is_link',{
							initialValue: undefined,
						}]"
						:options="yesOrNoOptions"
						placeholder="外链..."
						style="width: 100px"
					/>
				</a-form-item>

				<a-form-item>
					<a-select
						v-decorator="['is_original',{
							initialValue: undefined,
						}]"
						:options="yesOrNoOptions"
						placeholder="原创..."
						style="width: 100px"
					/>
				</a-form-item>

				<a-form-item>
					<a-input
						v-decorator="['keyword',{
							initialValue: '',
						}]"
						allowClear
						placeholder="关键字..."
						style="width: 140px"
					/>
				</a-form-item>

				<a-button
					type="primary"
					html-type="submit"
					:loading="loading"
				>
					搜索
				</a-button>
				<a-button
					v-if="hasSearched"
					type="link"
					@click="resetHandleSearch"
				>
					重置
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
					slot="is_top"
					slot-scope="text"
				>
					<span
						v-if="text"
						class="theme-success"
					>已置顶</span>
					<span
						v-else
					>无</span>
				</template>
				<template
					slot="islink"
					slot-scope="text"
				>
					{{ text ? '是' : '否' }}
				</template>

				<template
					slot="isoriginal"
					slot-scope="text"
				>
					{{ text ? '是' : '否' }}
				</template>

				<template
					slot="view_times"
					slot-scope="text"
				>
					{{ text }}
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
					<a-popover
						placement="right"
					>
						<template slot="content">
							<a
								v-if="!record.is_link"
								class="more-action-pop-link"
								@click="() => openDrawer(DRAWER_TYPE_MAP.VIEW_ARTICLE, record)"
							>
								预览
							</a>
							<a
								v-if="record.is_link"
								:href="record.link_url"
								target="_blank"
							>
								查看
							</a>
							<a
								v-if="!record.is_link"
								class="more-action-pop-link"
								@click="() => $router.push({ name: 'articleEdit', params: { articleId: record.uuid } })"
							>
								编辑
							</a>
							<a
								class="more-action-pop-link"
								@click="() => handleToggleTopArticle(record)"
							>
								{{ record.is_top ? '取消置顶' : '置顶' }}
							</a>
							<a
								v-if="!record.is_link"
								class="more-action-pop-link"
								@click="() => goViewArticleComment(record)"
							>
								评论
							</a>
							<a
								class="more-action-pop-link"
								@click="() => handleRemoveArticle(record)"
							>
								删除
							</a>
						</template>
						<a-icon type="more" />
					</a-popover>
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

const yesOrNoOptions = [
	{ label: '否', value: "0", key: 0 },
	{ label: '是', value: "1", key: 1 },
]

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
			width: "14%"
		},
		{
			title: "分类",
			dataIndex: "category",
			width: "8%"
		},
		{
			title: "标签",
			dataIndex: "tags",
			width: "16%",
			scopedSlots: { customRender: "tags" },
		},
		{
			title: "已发布",
			dataIndex: "publish",
			width: "7%",
			scopedSlots: { customRender: "publish" },
		},
		{
			title: "置顶",
			dataIndex: "is_top",
			width: "7%",
			scopedSlots: { customRender: "is_top" },
		},
		{
			title: "外链",
			dataIndex: "is_link",
			scopedSlots: { customRender: "islink" },
			width: "7%"
		},
		{
			title: "原创",
			dataIndex: "is_original",
			scopedSlots: { customRender: "isoriginal" },
			width: "7%"
		},
		{
			title: "阅读量",
			dataIndex: "view_times",
			scopedSlots: { customRender: "view_times" },
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
			hasSearched: false,
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
		yesOrNoOptions() {
			return [
				{
					label: '全部',
					value: '',
					key: 'all',
				},
				...yesOrNoOptions,
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
			toggleTopArticle: "article/toggleTopArticle",
			fetchCategoryList: "article/category/fetchCategoryList",
		}),
		DateFormat,
		async resetHandleSearch() {
			this.form.resetFields()
			await this.handleSubmit()
			this.hasSearched = false
		},
		handleSubmit(e) {
			e ? e.preventDefault() : null
			this.form.validateFields((err, values) => {
				if (!err) {
					this.hasSearched = true
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
		handleToggleTopArticle({ uuid, is_top, title }) {
			const self = this
			this.$confirm({
				title: `您确定要${is_top ? '取消置顶' : '置顶'} 《${title}》吗？`,
				okType: "danger",
				onOk() {
					const loading = self.$message.loading("请稍后...", -1)
					const formData = {
						uuid,
						params: {
							top: is_top ? 0 : 1,
						},
					}
					self.toggleTopArticle(formData)
						.then(() => {
							loading()
							self.$message.success("操作成功!")
							self.fetchArticleList()
						})
						.finally(loading)
				}
			})
		},
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
		goViewArticleComment({ uuid }) {
			this.$router.push({
				name: "articleComment",
				params: {
					articleId: uuid,
				},
			})
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
