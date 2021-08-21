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
					@click="openDrawer(DRAWER_TYPE.CREATE_MUSIC)"
				>
					新建歌曲
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
					slot-scope="text"
				>
					{{ DateFormat("yyyy-MM-dd HH:mm", text) }}
				</template>

				<template
					slot="poster"
					slot-scope="text"
				>
					<img :src="text" width="80" height="80">
				</template>

				<template
					slot="action"
					slot-scope="text, record"
				>
					<a
						@click="() => openDrawer(DRAWER_TYPE.EDIT_MUSIC, record)"
					>
						编辑
					</a>
					<a
						@click="() => handleRemoveMusic(record)"
					>
						删除
					</a>
				</template>
			</a-table>
		</div>

		<drawer
			:visible="visible"
			:title="drawerTitle"
			@submit="handleSubmitDrawer"
			@close="closeDrawer"
		>
			<create-music-form
				v-if="drawerType === DRAWER_TYPE.CREATE_MUSIC"
				:form-data="formData"
				:loading="loadingSubmit"
			/>
			<edit-music-form
				v-if="drawerType === DRAWER_TYPE.EDIT_MUSIC"
				:form-data="formData"
				:loading="loadingSubmit"
			/>
		</drawer>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex"
import DateFormat from "@/util/generic/date"
import Drawer from "@pages/admin/components/Drawer"
import { getAfterActionPage } from "@/util"

const CreateMusicForm = () => import(/*webpackChunkName:"CreateMusicForm"*/ "./createForm")
const EditMusicForm = () => import(/*webpackChunkName:"EditMusicForm"*/ "./editForm")

const DRAWER_TYPE = {
	EDIT_MUSIC: 'edit_music',
	CREATE_MUSIC: 'create_music',
}

function getColumns() {
	return [
		{
			title: "序号",
			scopedSlots: { customRender: "number" },
		},
		{
			title: "曲名",
			dataIndex: "title",
		},
		{
			title: "歌手",
			dataIndex: "singer",
		},
		{
			title: "封面",
			dataIndex: "poster",
			scopedSlots: { customRender: "poster" },
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			scopedSlots: { customRender: "createTime" },
		},
		{
			title: "操作",
			scopedSlots: { customRender: "action" },
		},
	]
}

export default {
	name: "MusicList",

	components: {
		Drawer,
		CreateMusicForm,
		EditMusicForm,
	},

	data() {
		this.DRAWER_TYPE = DRAWER_TYPE
		this.DRAWER_TITLE = {
			[DRAWER_TYPE.EDIT_MUSIC]: "编辑歌曲",
			[DRAWER_TYPE.CREATE_MUSIC]: "新建歌曲",
		}
		this.DRAWER_API = {
			[DRAWER_TYPE.EDIT_MUSIC]: this.handleUpdateMusic,
			[DRAWER_TYPE.CREATE_MUSIC]: this.handleCreateMusic,
		}
		this.columns = getColumns()
		this.form = this.$form.createForm(this)
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
			dataSource: (state) => state.music.musicList,
			page: (state) => state.music.page,
			limit: (state) => state.music.limit,
			total: (state) => state.music.total,
			loading: (state) => state.music.loading,
		}),
		...mapGetters({
			totalPage: "music/totalPage",
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
					self.fetchMusicList({
						page,
						limit: pageSize,
					})
				},
				onShowSizeChange: (current, size) => {
					self.fetchMusicList({
						page: current,
						limit: size,
					})
				},
			}
		},
	},

	mounted() {
		this.fetchMusicList()
	},

	methods: {
		...mapActions({
			fetchMusicList: "music/fetchMusicList",
			createMusic: "music/createMusic",
			removeMusic: "music/removeMusic",
			updateMusic: "music/updateMusic",
		}),

		DateFormat,
		handleSearch(e) {
			e.preventDefault()
			this.form.validateFields((err, values) => {
				if (!err) {
					this.fetchMusicList({
						page: 1,
						filter: {
							...values,
						}
					})
				}
			})
		},
		handleCreateMusic(formData) {
			this.loadingSubmit = true
			const loading = this.$message.loading("请稍后...", -1)
			this.createMusic(formData)
				.then(({ success }) => {
					if (success) {
						this.$message.success("添加成功!")
						this.fetchMusicList();
						this.closeDrawer();
					}
					this.loadingSubmit = false
					loading()
				})
				.catch(() => {
					this.loadingSubmit = false
				})
		},
		handleUpdateMusic(formData, uuid) {
			this.loadingSubmit = true
			const loading = this.$message.loading("请稍后...", -1)
			const payload = {
				formData,
				uuid,
			}
			this.updateMusic(payload)
				.then(({ success }) => {
					if (success) {
						this.$message.success("更新成功!")
						this.fetchMusicList();
						this.closeDrawer();
					}
					this.loadingSubmit = false
					loading()
				})
				.catch(() => {
					this.loadingSubmit = false
				})
		},
		handleSubmitDrawer(formData, ...args) {
			this.DRAWER_API[this.drawerType](formData, ...args)
		},
		handleRemoveMusic({ uuid }) {
			const self = this
			this.$confirm({
				title: "此操作不可撤销，是否继续?",
				okType: "danger",
				onOk() {
					const loading = self.$message.loading("请稍后...", -1)
					const page = getAfterActionPage(self.total, self.limit, self.page)
					self.removeMusic({ uuid })
						.then(({ success }) => {
							if (success) {
								self.$message.success("删除成功")
								self.fetchMusicList({ page })
							}
						})
						.finally(() => {
							loading()
						})
				}
			})
		},
		openDrawer(drawerType, record) {
			if (record) {
				this.formData = record
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
	},
}
</script>

<style lang="scss"  scoped>

</style>
