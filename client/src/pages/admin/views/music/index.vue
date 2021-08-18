<template>
	<div class="blog-panel">
		<div class="panel-filter">
		</div>
		<div class="panel-body">
			<a-table
				:columns="columns"
			>
			</a-table>
		</div>
	</div>
</template>

<script>
import { mapActions } from "vuex"

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
		},
	]
}

export default {
	name: "MusicList",

	data() {
		this.columns = getColumns()
		return {}
	},

	mounted() {
		this.fetchMusicList()
	},

	methods: {
		...mapActions({
			fetchMusicList: "music/fetchMusicList",
		}),
	}
}
</script>

<style lang="scss"  scoped>

</style>
