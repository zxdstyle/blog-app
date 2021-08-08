<template>
	<div>详情</div>
</template>

<script>
export default {
	name: "articleDetail",

	mounted() {
		const { articleId } = this.$route.params
		console.log(articleId)
	}
}
</script>

<style scoped>

</style>
