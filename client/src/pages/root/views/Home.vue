<template>
	<div class="sider--content">
		<div class="article-list">
			<li
				v-for="item in articleList"
			>
				{{ item.title }}
				{{ item.description }}
				<span
					v-for="t in item.tags"
				>
					{{ t.title }}
				</span>
			</li>
			<skeleton
				:visible="loadArticles"
			/>
		</div>
		<div class="home-sider">
			侧边栏
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex"

const Skeleton = () => import(/*webpackChunkName:"Skeleton"*/"@pages/root/components/Skeleton/Skeleton")

export default {
	name: "Home",

	components: {
		Skeleton,
	},

	computed: {
		...mapState({
			loadArticles: (state) => state.home.loadArticles,
			articleList: (state) => state.home.articleList,
		}),
	},

	mounted() {
		this.fetchArticleList()
	},

	methods: {
		...mapActions({
			fetchArticleList: "home/fetchArticleList",
		}),
	},
}
</script>

<style lang="scss" scoped>
@import "@/style/lib/_mixin";
@import "@/style/lib/_variable";
@import "@/style/lib/_function";
.sider--content {
	padding: rem(10);
	position: relative;
}
.article-list {
	display: inline-block;
	width: rem(700);
}
.home-sider {
	width: 220px;
	padding: 20px;
	vertical-align: top;
	background: salmon;
	display: inline-block;
	margin: 0 20px;
	position: absolute;
	right: 0;
	@media screen and (max-width: 900px) {
		display: none;
	}
}
</style>
