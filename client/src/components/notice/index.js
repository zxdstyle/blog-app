import $ from "jquery"
import "./index.scss"


function factory(type, message, action) {
	type = type || "info"
	message = message || "提示信息..."
	action = action || false
	let footerTemplate = `
				<div class=notice-footer>
					<button class=cancle-btn id=notice-cancle-btn>取消</button>
					<button class=ok-btn id=notice-ok-btn>确定</button>
				</div>
			`
	let template = `
				<div class=pea-notice>
					<div class=notice-content>
						<div class="type-icon type-${type}"></div>
						<div class=notice>${message}</div>
					</div>
					${action ? footerTemplate : ""}
				</div>
			`
	return template
}

let timer
$.extend({
	Notice(param) {
		param = param || {}
		param.close = param.close ?? true
		const renderHTML = factory(param.type, param.message, param.close ? false : true)

		if (timer) {
			clearTimeout(timer)
			$(".pea-notice").remove()
		}
		$("body").append($(renderHTML))
		$(".pea-notice").fadeIn()

		if (param.close) {
			timer = setTimeout(function () {
				new Promise(resolve => {
					$(".pea-notice").fadeOut()
					if (param.Ok && typeof param.Ok == "function") {
						param.Ok()
					}
					resolve()
				}).then(() => {
					$(".pea-notice").remove()
					clearTimeout(timer)
				})
			}, param.duration || 1500)
		} else {
			timer = true
			$("#notice-ok-btn").on("click", () => {
				new Promise(resolve => {
					$(".pea-notice").fadeOut()
					if (param.Ok && typeof param.Ok == "function") {
						param.Ok()
					}
					resolve()
				}).then(() => {
					$(".pea-notice").remove()
					clearTimeout(timer)
				})
			})

			$("#notice-cancle-btn").on("click", () => {
				new Promise(resolve => {
					$(".pea-notice").fadeOut()
					resolve()
				}).then(() => {
					$(".pea-notice").remove()
					clearTimeout(timer)
				})
			})
		}
	}
})
