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
					<a-icon :type="uploadingMusic ? 'loading' : 'plus'" />
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
		>
			<a-input
				v-decorator="['poster', {
					initialValue: '',
					rules: [
						{ required: true, message: '请输入歌手' }
					]
				}]"
				placeholder="请输入歌手..."
			/>
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

const supportVoiceTypes = [".mp3"]
const supportVoiceSize = 1024 * 1024 * 10

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
		}
	},

	methods: {
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
				console.log(model)
			} finally {
				loading()
				this.uploadingMusic = false
			}
		},
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
					document.body.removeChild(musicPlayer)
					this.emitSubmit(values)
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
					this.playing = true
					this.loadedMusic = true
					audio.play()
				})
				audio.onerror = () => {
					loading()
					this.$message.error("加载错误")
				}
			} else {
				musicPlayer = document.querySelector("#audioPlayer")
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
				}
			}
		},
		handleInitUploadMusic() {
			Object.keys(this.uploadMusic).forEach((k) => {
				this.uploadMusic[k] = null
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
</style>
