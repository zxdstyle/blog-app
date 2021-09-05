/**
 * 登录 Page
 */

import $ from "jquery"
import MD5 from "crypto-js/md5"
import "./index.scss"
import "@/components/notice"

import { GetAuthCodeApi, UserLoginApi } from "@api/auth-api"
import { validateEmail } from "@util/index"

const $codeImg = $(".code-img"),
	$submit = $(".login-btn"),
	$email = $("#email"),
	$pwd = $("#pwd"),
	$code = $("#code")

window.onload = () => $email.focus()

// 验证码
refreshCode()
$codeImg.on("click", refreshCode)
async function refreshCode() {
	try {
		const api = new GetAuthCodeApi()
		const data = await api.send()
		$codeImg.html(data)
	} catch (error) {
		$.Notice({
			type: "error",
			message: error,
		})
	}
}

$submit.on("click", validateForm)
$email.on("keydown", e => {
	if (e.code === "Enter") {
		validateForm()
	}
})
$pwd.on("keydown", e => {
	if (e.code === "Enter") {
		validateForm()
	}
})
$code.on("keydown", e => {
	if (e.code === "Enter") {
		validateForm()
	}
})

async function validateForm() {
	if (!$email.val()) {
		$.Notice({
			type: "warn",
			message: "邮箱不能为空!",
		})
		return
	}
	if (!validateEmail.test($email.val())) {
		$.Notice({
			type: "warn",
			message: "请输入正确的邮箱格式!",
		})
		return
	}
	if (!$pwd.val()) {
		$.Notice({
			type: "warn",
			message: "密码不能为空!",
		})
		return
	}
	if ($pwd.val().length < 6) {
		$.Notice({
			type: "warn",
			message: "密码至少6位数!",
		})
		return
	}
	if (!$code.val()) {
		$.Notice({
			type: "warn",
			message: "验证码不能为空!",
		})
		return
	}
	try {
		const formData = {
			email: $email.val(),
			pwd: MD5($pwd.val()).toString(),
			code: $code.val(),
		}
		$(this).attr("disabled", true).text("登录中...")
		const api = new UserLoginApi()
		api.data = formData
		const data = await api.send()
		$.Notice({
			type: "success",
			message: data.message || "登录成功",
			Ok() {
				location.href = "/admin"
			}
		})
		$(this).attr("disabled", false).text("登录")
	} catch (error) {
		$(this).attr("disabled", false).text("登录")
		refreshCode()
		$.Notice({
			type: "error",
			message: error,
		})
	}
}
