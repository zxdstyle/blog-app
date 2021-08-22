<template>
	<a-form
		:form="form"
		@submit="handleSubmit"
	>
		<a-form-item
			label="名称"
		>
			<a-input
				v-decorator="['title', {
					initialValue: '',
					rules: [
						{ required: true, message: '请输入歌曲名' }
					]
				}]"
				placeholder="请输入歌曲名..."
			/>
		</a-form-item>

		<a-form-item
			label="歌手"
		>
			<a-input
				v-decorator="['singer', {
					initialValue: '',
					rules: [
						{ required: true, message: '请输入歌手' }
					]
				}]"
				placeholder="请输入歌手..."
			/>
		</a-form-item>

		<a-form-item
			label="歌曲"
			required
		>
			<a-upload
				name="avatar"
				list-type="picture-card"
				class="avatar-uploader"
				accept="audio/*"
				:disabled="uploadMusic.url && uploadMusic.url.length > 0"
				:show-upload-list="false"
				:beforeUpload="handleBeforeUploadMusic"
			>
				<div
					v-if="uploadMusic.url"
					class="play-music-wrap"
					@click.stop="toggolePlayMusic"
				>
					<a-icon
						v-if="playing"
						type="pause-circle"
						style="font-size: 20px"
					/>
					<a-icon
						v-else
						type="play-circle"
						style="font-size: 20px"
					/>
					<span class="music-title">
						{{ uploadMusic.title }}
					</span>
				</div>
				<div v-else>
					<a-icon
						:type="uploadingMusic ? 'loading' : 'plus'"
						style="font-size: 20px"
					/>
					<div class="ant-upload-text">
						上传
					</div>
				</div>

				<div
					v-if="uploadMusic.url"
					class="delete-music-btn"
					@click="removeMusic"
				>
					<a-icon
						theme="filled"
						type="delete"
					/>
				</div>
			</a-upload>
		</a-form-item>

		<a-form-item
			label="封面"
			required
		>
			<a-upload
				name="avatar"
				list-type="picture-card"
				class="avatar-uploader"
				accept="image/*"
				:disabled="uploadPoster.url && uploadPoster.url.length > 0"
				:show-upload-list="false"
				:beforeUpload="handleBeforeUploadPoster"
			>
				<div
					v-if="uploadPoster.url"
					class="show-uploaded-poster"
				>
					<img :src="uploadPoster.url" alt="avatar" />
					<a-icon
						class="delete-poster-btn"
						theme="filled"
						type="delete"
						@click="removePoster"
					/>
				</div>
				<div v-else>
					<a-icon
						:type="uploadingPoster ? 'loading' : 'plus'"
						style="font-size: 20px"
					/>
					<div class="ant-upload-text">
						上传
					</div>
				</div>
			</a-upload>
		</a-form-item>

		<div class="drawer-bottom-elem">
			<a-button
				@click="() => emitClose()"
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
</template>

<script>
import { getFileExt, isCorrectType } from "@/util";
import { UploadFileApi, RemoveFileApi } from "@api/upload"
import { UPLOAD_FILE_TYPE } from "@pages/admin/constant/file-type"

const supportVoiceTypes = [".mp3", ".m4a", ".ogg"]
const supportVoiceSize = 1024 * 1024 * 10
const supportPosterTypes = [".png", ".jpg", ".jpeg", ".webp", ".gif"]
const supportPosterSize = 1024 * 1024 * 5

let musicPlayer

export default {
	name: "createForm",

	inject: ["emitClose", "emitSubmit"],

	props: {
		loading: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		this.form = this.$form.createForm(this)
		return {
			playing: false,
			loadedMusic: false,
			uploadingMusic: false,
			uploadMusic: {
				url: null,
				title: "",
				id: null,
				name: null,
				uuid: null,
			},
			uploadingPoster: false,
			uploadPoster: {
				url: null,
				title: null,
				id: null,
				name: null,
				uuid: null,
			},
		}
	},

	methods: {
		handleBeforeUploadPoster(file) {
			const { name, size } = file
			const isCorrectVoice = isCorrectType(supportPosterTypes, getFileExt(name))
			if (!isCorrectVoice) {
				this.$message.error("不支持该格式文件")
				return
			}
			if (size > supportPosterSize) {
				this.$message.error("文件过大")
				return
			}
			const formData = new FormData()
			formData.append("FILE_TYPE", UPLOAD_FILE_TYPE.IMAGE)
			formData.append("filedata", file)
			this.handleUploadPoster(formData)
			return false
		},
		async handleUploadPoster(formData) {
			const loading = this.$message.loading("请稍后...", -1)
			try {
				const api = new UploadFileApi()
				api.data = formData
				const { model } = await api.send()
				const {
					id,
					filename,
					origin_name,
					url,
					uuid,
				} = model
				this.uploadPoster.id = id
				this.uploadPoster.title = origin_name
				this.uploadPoster.url = url
				this.uploadPoster.name = filename
				this.uploadPoster.uuid = uuid
				this.$message.success("上传成功")
			} finally {
				loading()
			}
		},
		handleBeforeUploadMusic(file) {
			const { name, size } = file
			const isCorrectVoice = isCorrectType(supportVoiceTypes, getFileExt(name))
			if (!isCorrectVoice) {
				this.$message.error("不支持该格式文件")
				return
			}
			if (size > supportVoiceSize) {
				this.$message.error("文件过大")
				return
			}
			const formData = new FormData()
			formData.append("FILE_TYPE", UPLOAD_FILE_TYPE.VOICE)
			formData.append("filedata", file)
			this.handleUploadMusic(formData)
			return false
		},
		async handleUploadMusic(formData) {
			const loading = this.$message.loading("请稍后...", -1)
			try {
				this.uploadingMusic = true
				const api = new UploadFileApi()
				api.data = formData
				const { model } = await api.send()
				const {
					id,
					filename,
					origin_name,
					url,
					uuid,
				} = model
				this.uploadMusic.id = id
				this.uploadMusic.title = origin_name
				this.uploadMusic.url = url
				this.uploadMusic.name = filename
				this.uploadMusic.uuid = uuid
				this.$message.success("上传成功")
			} finally {
				loading()
				this.uploadingMusic = false
			}
		},
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!this.uploadMusic.url) {
					this.$message.error("封曲不能为空")
					return
				}
				if (!this.uploadPoster.url) {
					this.$message.error("封面不能为空")
					return
				}
				if (!err) {
					const formData = {
						...values,
						url: this.uploadMusic.id,
						poster: this.uploadPoster.id,
					}
					musicPlayer ? document.body.removeChild(musicPlayer) : null
					this.playing = false
					this.loadedMusic = false
					this.emitSubmit(formData)
				}
			})
		},
		toggolePlayMusic() {
			let audio
			if (!this.loadedMusic) {
				const loading = this.$message.loading("加载中...", -1)
				audio = new Audio(this.uploadMusic.url)
				audio.setAttribute("id", "audioPlayer")
				document.body.append(audio)

				audio.addEventListener("loadeddata", () => {
					loading()
					musicPlayer = document.querySelector("#audioPlayer")
					this.playing = true
					this.loadedMusic = true
					audio.play()
				})
				audio.onerror = () => {
					loading()
					this.$message.error("加载错误")
				}
			} else {
				if (this.playing) {
					musicPlayer.pause()
				} else {
					musicPlayer.play()
				}
				this.playing = !this.playing
			}

		},
		async removeMusic() {
			try {
				const api = new RemoveFileApi({ uuid: this.uploadMusic.uuid })
				await api.send()
			} finally {
				this.handleInitUploadMusic()
				this.loadedMusic = false
				this.playing = false
				if (musicPlayer) {
					document.body.removeChild(musicPlayer)
					musicPlayer = null
				}
			}
		},
		async removePoster() {
			try {
				const api = new RemoveFileApi({ uuid: this.uploadPoster.uuid })
				await api.send()
			} finally {
				this.handleInitUploadPoster()
			}
		},
		handleInitUploadMusic() {
			Object.keys(this.uploadMusic).forEach((k) => {
				this.uploadMusic[k] = null
			})
		},
		handleInitUploadPoster() {
			Object.keys(this.uploadPoster).forEach((k) => {
				this.uploadPoster[k] = null
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.play-music-wrap {
	padding: 0 10px;
	box-sizing: border-box;
	text-align: center;
	width: 90px;
	cursor: default;

	.music-title {
		font-size: 12px;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}
.delete-music-btn {
	position: absolute;
	top: -95px;
	left: 90px;
	display: inline-block;
	cursor: pointer;
}
.show-uploaded-poster {
	width: 90px;
	height: 90px;
	img {
		max-width: 100%;
		cursor: default;
	}

	.delete-poster-btn {
		position: absolute;
		left: 90px;
		cursor: pointer;
	}
}
</style>
