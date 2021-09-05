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
		</a-page-header>
		<div class="panel-filter">
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
					slot="createTime"
					slot-scope="text"
				>
					{{ DateFormat("yyyy-MM-dd HH:mm", text) }}
				</template>

				<template
					slot="action"
					slot-scope="text, record"
				>
					<a
						@click="openDrawer(record)"
					>
						回复
					</a>

					<a
						@click="handleRemoveComment(record)"
					>
						删除
					</a>
				</template>
			</a-table>
		</div>

		<drawer
			:visible="visible"
			:title="drawerTitle"
			:width="500"
			@close="closeDrawer"
			@ok="handleSubmitDrawer"
		>
			<a-form
				:form="form"
				@submit="handleSubmit"
			>
				<a-form-item
					label=""
				>
					<a-textarea
						v-decorator="['content', {
							initialValue: '',
							rules: [
								{ required: true, message: '请输入内容' }
							]
						}]"
						:rows="8"
						placeholder="请输入内容..."
					/>
				</a-form-item>
				<div class="drawer-bottom-elem">
					<a-button
						@click="closeDrawer"
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
		</drawer>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"
import DateFormat from "@/util/generic/date"
import Drawer from "@pages/admin/components/Drawer"

function getColumns() {
	return [
		{
			title: "评论人",
			dataIndex: "username",
			width: "12%"
		},
		{
			title: "邮箱",
			dataIndex: "email",
			width: "12%"
		},
		{
			title: "回复对象",
			dataIndex: "target_name",
			width: "12%",
		},
		{
			title: "内容",
			dataIndex: "content",
			width: "14%",
		},
		{
			title: "文章",
			dataIndex: "article_title",
			width: "10%",
		},
		{
			title: "IP",
			dataIndex: "ip",
			width: "10%"
		},
		{
			title: "浏览器",
			dataIndex: "brower",
			width: "8%"
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			width: "10%",
			scopedSlots: { customRender: "createTime" },
		},
		{
			title: "操作",
			scopedSlots: { customRender: "action" }
		},
	]
}

export default {
	name: "ArticleComment",

	components: {
		Drawer,
	},

	data() {
		this.form = this.$form.createForm(this)
		this.columns = getColumns()
		return {
			uuid: null,
			visible: false,
			drawerTitle: "",
			currentComment: null,
		}
	},

	computed: {
		...mapState({
			page: (state) => state.article.comment.page,
			limit: (state) => state.article.comment.limit,
			total: (state) => state.article.comment.total,
			loading: (state) => state.article.comment.loading,
			dataSource: (state) => state.article.comment.dataSource,
		}),
		...mapGetters({
			totalPage: "article/comment/totalPage",
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
					self.fetchCommentList({
						page,
						limit: pageSize,
						uuid: this.uuid,
					})
				},
				onShowSizeChange: (current, size) => {
					self.fetchCommentList({
						page: current,
						limit: size,
						uuid: this.uuid,
					})
				},
			}
		},
	},

	mounted() {
		const { articleId } = this.$route.params
		this.uuid = articleId
		this.fetchCommentList({ uuid: articleId })
	},

	methods: {
		...mapActions({
			fetchCommentList: "article/comment/fetchCommentsList",
			createComment: "article/comment/createComment",
			removeComment: "article/comment/removeComment",
		}),
		DateFormat,
		handleReplyComment(record) {
			console.log(record)
		},
		handleRemoveComment(record) {
			console.log(record)
			const { id } = record
			const self = this
			this.$confirm({
				title: "确定删除此条评论吗？",
				okType: "danger",
				onOk() {
					const loading = self.$message.loading("请稍后...", -1)
					self.removeComment({ id })
						.then(() => {
							loading()
							self.$message.success("删除成功")
							self.fetchCommentList({ uuid: self.uuid })
						})
						.catch(loading)
				}
			})
		},
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
					const payload = {
						uuid: this.currentComment.article_id,
						formData: {
							...values,
							username: "作者",
							email: "wsm_1105@163.com",
							target_id: this.currentComment.id,
							target_name: this.currentComment.username,
						},
					}
					const loading = this.$message.loading("请稍后...", -1)
					this.createComment(payload)
						.then(() => {
							loading()
							this.$message.success("操作成功")
							this.fetchCommentList({ uuid: this.uuid })
							this.closeDrawer()
						})
						.catch(loading)
				}
			})
		},
		handleSubmitDrawer() {

		},
		openDrawer(record) {
			this.currentComment = record
			const { username, article_title } = record
			this.drawerTitle = `回复：@${username} 在《${article_title}》`
			this.visible = true
		},
		closeDrawer() {
			this.visible = false
		},
	},
}
</script>

<style scoped>

</style>
