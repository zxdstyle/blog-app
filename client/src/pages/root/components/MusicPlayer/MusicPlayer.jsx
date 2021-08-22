/* eslint-disable */
/**
 * Music播放器
 */

import "./index.scss"
import { debounce } from "@/util/generic/fn-core"
import {
	GetRandomMusicApi,
	GetCurrentMusicApi,
	GetSearchMusicApi,
} from "@api/music/music-api"

const loadFaildImg = "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9rguy3btj306p05tjr6.jpg"

let retry = 0

const MUSICPLAYER_SIZE_STATUS = {
	LG: "large",
	SM: "small",
}

const MusicPlayer = {
	data() {
		return {
			searchKey: "",
			searchMusicList: [],
			showSearch: false,
			spinning: false,
			searchSpinning: false,
			currentMusic: {},
			prev: {},
			next: {},
			playing: false,
			musicPlayerStatus: MUSICPLAYER_SIZE_STATUS.LG,
		}
	},

	computed: {
		activeMusic() {
			return this.currentMusic
		}
	},

	mounted() {
		this.spinning = true
		this.initMusic()
	},

	methods: {
		async initMusic() {
			try {
				const api = new GetRandomMusicApi()
				const { model } = await api.send()
				const { prevMusic, nextMusic } = model
				this.currentMusic = model
				this.prev = prevMusic
				this.next = nextMusic
			} catch (error) {
				console.log(error)
				retry ++
				if (retry < 3) {
					this.initMusic()
				}
			}
		},
		// 播放 / 暂停
		togglePlay() {
			if (this.playing) {
				this.$refs.musicPlayer.pause()
			} else {
				this.$refs.musicPlayer.play()
			}
			this.playing = !this.playing
		},
		// 下一首
		async nextMusic() {
			this.spinning = true
			try {
				if (this.searchMusicList.length) {
					const [playing] = this.searchMusicList.filter((m) =>  m.uuid === this.currentMusic.uuid)
					const [currentMusic] = this.searchMusicList.filter((m) =>  m.uuid === playing.nextMusic.uuid)
					const { prevMusic, nextMusic } = currentMusic
					if (currentMusic.uuid === this.currentMusic.uuid) {
						this.spinning = false
					}
					this.currentMusic = currentMusic
					this.prev = prevMusic
					this.next = nextMusic
					return
				}
				const { uuid } = this.next
				const api = new GetCurrentMusicApi({ uuid })
				const { model } = await api.send()
				const { prevMusic, nextMusic } = model
				this.currentMusic = model
				this.prev = prevMusic
				this.next = nextMusic
			} catch (error) {
				console.log(error)
			}
		},
		// 上一首
		async prevMusic() {
			this.spinning = true
			try {
				if (this.searchMusicList.length) {
					const [playing] = this.searchMusicList.filter((m) =>  m.uuid === this.currentMusic.uuid)
					const [currentMusic] = this.searchMusicList.filter((m) =>  m.uuid === playing.prevMusic.uuid)
					const { prevMusic, nextMusic } = currentMusic
					if (currentMusic.uuid === this.currentMusic.uuid) {
						this.spinning = false
					}
					this.currentMusic = currentMusic
					this.prev = prevMusic
					this.next = nextMusic
					return
				}
				const { uuid } = this.prev
				const api = new GetCurrentMusicApi({ uuid })
				const { model } = await api.send()
				const { prevMusic, nextMusic } = model
				this.currentMusic = model
				this.prev = prevMusic
				this.next = nextMusic
			} catch (error) {
				console.log(error)
			}
		},
		// 加载音乐
		loadMusic() {
			this.spinning = false
		},
		// 加载音乐
		fetchMusic() {
			this.spinning = false
			this.$nextTick(() => {
				if (this.playing) {
					this.$refs.musicPlayer.play()
				}
			})
		},
		// 音乐加载错误
		errorMusic(e) {
			if (e) {
				this.currentMusic.post = loadFaildImg
				this.$message.error("歌曲错误，将为您播放下一首", 2)
					.then(() => {
						this.nextMusic()
					})
			}
		},
		// 改变播放器尺寸
		toggleMusicPlayer(type) {
			if (this.musicPlayerStatus === type) return
			this.musicPlayerStatus = type
			this.showSearch = false
		},
		async handleSearch(searchKey) {
			try {
				this.searchSpinning = true
				const api = new GetSearchMusicApi()
				api.params = {
					keyword: searchKey,
				}
				const { data } = await api.send()
				this.searchMusicList = data
				this.searchSpinning = false
			} catch (error) {
				console.log(error)
			}
		},
		jumpPlay(music) {
			if (music.uuid !== this.currentMusic.uuid) {
				this.spinning = true
			}
			const { prevMusic, nextMusic } = music
			this.currentMusic = music
			this.prev = prevMusic
			this.next = nextMusic
		},
		toggleShowSearch() {
			this.showSearch = !this.showSearch
			if (this.showSearch) {
				this.$refs.searchInput.focus()
			} else {
				this.$refs.searchInput.blur()
			}
		},
	},

	render() {
		return (
			<div class={`
				blog-musicplayer
				${this.musicPlayerStatus === MUSICPLAYER_SIZE_STATUS.SM ? 'musicplayer-sm' : ''}
				${this.playing ? 'playing' : ''}
			`}>
				<a-spin
					class={`${this.spinning ? 'music-loading' : ''}`}
					spinning={this.spinning}
				/>
				<audio
					ref={"musicPlayer"}
					src={this.currentMusic.url}
					onEnded={this.nextMusic}
					onLoadedData={this.loadMusic}
					onLoadedMetadata={this.loadMusic}
					onProgress={this.fetchMusic}
					onCanPlay={this.loadMusic}
					onError={this.errorMusic}
				/>
				<div
					class="music-cover"
					onClick={() => this.toggleMusicPlayer(MUSICPLAYER_SIZE_STATUS.LG)}
				>
					<img
						src={this.currentMusic.poster}
					/>
				</div>
				<div class="music-content">
					<div class="music-title">
						{this.currentMusic.title}
					</div>

					<svg
						aria-hidden="true"
						class="music-icon close"
						onClick={() => this.toggleMusicPlayer(MUSICPLAYER_SIZE_STATUS.SM)}
					>
						<use xlinkHref="#icon-close">
							<svg id="icon-close" viewBox="0 0 1024 1024">
								<path
									d="M514.496 738.944C389.392 738.944 288 637.536 288 512.448c0-125.104 101.392-226.512 226.496-226.512 125.088 0 226.496 101.408 226.496 226.512C740.992 637.536 639.6 738.944 514.496 738.944zM620.72 434.624c6.16-6.16 4.336-18-4.064-26.4l-0.96-0.944c-8.4-8.4-20.224-10.24-26.384-4.064l-75.344 75.36-80.816-80.832c-6.256-6.256-18.24-4.4-26.752 4.128l-0.96 0.96c-8.528 8.512-10.352 20.496-4.112 26.72l80.816 80.832-78.864 78.848c-6.176 6.192-4.352 17.984 4.064 26.4l0.944 0.944c8.4 8.4 20.224 10.256 26.384 4.064l78.88-78.88 76.32 76.336c6.256 6.24 18.224 4.416 26.736-4.112l0.976-0.976c8.528-8.496 10.368-20.48 4.112-26.736l-76.32-76.336L620.72 434.624z"
								/>
							</svg>
						</use>
					</svg>

					<div class="controls">
						<svg
							aria-hidden="true"
							class="music-icon icon"
							onClick={this.prevMusic}
						>
							<use xlinkHref="#icon-dingbuzuoqiehuan">
								<svg id="icon-dingbuzuoqiehuan" viewBox="0 0 1024 1024">
									<path d="M0 512L558.545455 0v1024z m465.454545 0L1024 0v1024z"/>
								</svg>
							</use>
						</svg>
						{
							!this.playing
								? <svg
									aria-hidden="true"
									class="music-icon icon"
									onClick={() => this.togglePlay()}
								>
									<use xlinkHref="#icon-bofang">
										<svg id="icon-bofang" viewBox="0 0 1024 1024">
											<path
												d="M221.696 1014.784c-36.864 0-68.608-13.824-91.648-39.936-23.04-26.112-35.84-63.488-35.84-104.96V154.624c0-41.472 12.8-78.848 35.84-104.96s54.784-39.936 91.648-39.936c27.648 0 56.32 8.192 84.48 24.064l570.368 358.912c50.176 28.672 78.848 72.192 78.848 119.808 0 48.128-28.672 91.136-80.384 120.832L308.736 989.184c-30.72 17.408-58.88 25.6-87.04 25.6z"
											/>
										</svg>
									</use>
								</svg>
								: <svg
									aria-hidden="true"
									class="music-icon icon"
									onClick={() => this.togglePlay()}
								>
									<use xlinkHref="#icon-zanting">
										<svg id="icon-zanting" viewBox="0 0 1024 1024">
											<path
												d="M740.597 162.574c33.928 0 61.698 34.106 61.698 75.793v547.97c0 41.687-27.77 75.783-61.698 75.783h-30.84c-33.93 0-61.693-34.096-61.693-75.782V238.367c0-41.687 27.764-75.793 61.693-75.793h30.84zM314.292 162.574c33.932 0 61.696 34.106 61.696 75.793v547.97c0 41.687-27.766 75.783-61.696 75.783h-30.835c-33.935 0-61.698-34.096-61.698-75.782V238.367c0-41.687 27.763-75.793 61.698-75.793h30.835z"
											/>
										</svg>
									</use>
								</svg>
						}
						<svg
							aria-hidden="true"
							class="music-icon icon"
							onClick={this.nextMusic}
						>
							<use xlinkHref="#icon-dingbuyouqiehuan">
								<svg id="icon-dingbuyouqiehuan" viewBox="0 0 1024 1024">
									<path d="M1024 512L465.454545 1024V0z m-465.454545 0L0 1024V0z"/>
								</svg>
							</use>
						</svg>
						<svg
							aria-hidden="true"
							class="music-icon icon"
							onClick={this.toggleShowSearch}
						>
							<use xlinkHref="#icon-chakangengduo">
								<svg id="icon-chakangengduo" viewBox="0 0 1024 1024">
									<path
										d="M111.267153 403.855978c-59.672054 0-108.057041 48.415686-108.057041 108.135836 0 59.734476 48.383964 108.152209 108.057041 108.152209 59.677171 0 108.063181-48.417733 108.063181-108.152209C219.328287 452.270641 170.944324 403.855978 111.267153 403.855978L111.267153 403.855978zM912.729777 403.855978c-59.675124 0-108.059088 48.415686-108.059088 108.135836 0 59.734476 48.383964 108.152209 108.059088 108.152209 59.675124 0 108.059088-48.417733 108.059088-108.152209C1020.789888 452.270641 972.404901 403.855978 912.729777 403.855978L912.729777 403.855978zM511.998977 403.855978c-59.674101 0-108.059088 48.415686-108.059088 108.135836 0 59.734476 48.38601 108.152209 108.059088 108.152209 59.677171 0 108.061135-48.417733 108.061135-108.152209C620.060111 452.270641 571.676148 403.855978 511.998977 403.855978L511.998977 403.855978z"
									/>
								</svg>
							</use>
						</svg>
					</div>
				</div>

				{/*歌曲列表*/}
				<div
					class={`music-list ${this.showSearch ? 'show' : 'hidden'}`}
				>
					<div class="search-wrap">
						<svg
							aria-hidden="true"
							class="search-icon"
						>
							<use xlinkHref="#icon-search">
								<svg id="icon-search" viewBox="0 0 1024 1024">
									<path d="M937.024 825.472l-176.512-176.576c-2.624-2.624-5.568-4.608-8.32-6.784 38.208-58.688 60.544-128.512 60.544-203.776 0-206.784-167.552-374.4-374.4-374.4C231.616 63.936 64 231.552 64 438.336c0 206.784 167.68 374.4 374.4 374.4 75.264 0 145.216-22.4 203.904-60.608 2.176 2.816 4.096 5.696 6.72 8.256l176.512 176.576C840.96 952.32 861.056 960 881.216 960c20.16 0 40.32-7.68 55.744-23.04C967.68 906.176 967.68 856.256 937.024 825.472M438.336 694.464c-141.184 0-256.128-114.944-256.128-256.128 0-141.184 114.944-256.128 256.128-256.128 141.184 0 256.128 114.944 256.128 256.128C694.464 579.52 579.52 694.464 438.336 694.464"/>
								</svg>
							</use>
						</svg>
						<a-spin
							class={"search-loading"}
							spinning={this.searchSpinning}
						>
							<a-icon slot="indicator" type="loading" style="font-size: 20px;color:#c4b597" spin />
							<input
								v-model={this.searchKey}
								ref={"searchInput"}
								type="text"
								class="search-input"
								placeholder="搜索歌曲..."
								onInput={(e) => debounce(this.handleSearch, 800)(this.searchKey)}
							/>
						</a-spin>
					</div>
					<ul class="list-content">
						{
							this.searchMusicList.map((music, index) => {
								return <li
									class={`${this.activeMusic.title === music.title ? 'active' : ''}`}
									onClick={() => this.jumpPlay(music)}
								>
									<span>{index + 1}.</span>
									<span class={"music-title"}>{music.title}</span>
									<span class={"music-author"}> —— {music.singer}</span>
								</li>
							})
						}
					</ul>
				</div>
			</div>
		)
	}
}

export default MusicPlayer
