/* eslint-disable */
/**
 * Music播放器
 */

import "./index.scss"

const loadFaildImg = "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9rguy3btj306p05tjr6.jpg"

const musicList = [
	{
		"title": "Dream It Possible",
		"author": "Delacey",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/dreamit.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk8v4iosc4j30f00f0q5s.jpg",
		"language": ["英语"],
		"style": ["摇滚", "励志"],
	},
	{
		"title": "情感禁区",
		"author": "刘德华",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/qingganjinqu.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk8vf35ol8j30go0gotns.jpg",
		"language": ["粤语"],
		"style": ["传统", "情感"],
	},
	{
		"title": "不再犹豫",
		"author": "Beyond",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/buzaiyouyu.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk8viyzglaj30go0gowfh.jpg",
		"language": ["粤语"],
		"style": ["摇滚", "励志"],
	},
	{
		"title": "相思",
		"author": "毛阿敏",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/xiangsi.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk8vvky642j30go0gogm7.jpg",
		"language": ["汉语"],
		"style": ["传统", "情感"],
	},
	{
		"title": "烦恼歌",
		"author": "张学友",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/fannaoge.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk8wa0ncp7j30go0gojzd.jpg",
		"language": ["汉语"],
		"style": ["摇滚"],
	},
	{
		"title": "Salt",
		"author": "Ava Max",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/salt.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9wm366j1j30go0gowid.jpg",
		"language": ["英语"],
		"style": ["摇滚"],
	},
	{
		"title": "Lonely Dance",
		"author": "Vexento",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/lonelydance.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9wnv9nw7j30dp0dpwh8.jpg",
		"language": [],
		"style": ["摇滚", "纯音乐"],
	},
	{
		"title": "YaSuo",
		"author": "league",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/yasuo.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9wsed6qbj30go09sjzk.jpg",
		"language": ["汉语"],
		"style": ["摇滚"],
	},
	{
		"title": "野孩子",
		"author": " 杨千嬅",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/yehaizi.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9wx277foj30go0go0vo.jpg",
		"language": ["粤语"],
		"style": ["传统"],
	},
	{
		"title": "打上花火",
		"author": "米津玄師",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/dashanghuahuo.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9x0op1cqj30go0go79n.jpg",
		"language": ["日语"],
		"style": ["传统"],
	},
	{
		"title": "他只是经过",
		"author": "Felix Bennett",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/tazhishijingguo.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9x2dlbrkj30go0gomzs.jpg",
		"language": ["汉语"],
		"style": ["传统", "情感"],
	},
	{
		"title": "Walk Thru Fire",
		"author": "Vicetone",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/walkthrufire.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9x70hnjuj30go0go145.jpg",
		"language": ["英语"],
		"style": ["传统"],
	},
	{
		"title": "谁伴我闯荡",
		"author": "Beyond",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/sheibanwochuangdang.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9x9u8in4j30go0gon0c.jpg",
		"language": ["粤语"],
		"style": ["励志"],
	},
	{
		"title": "渴望光荣",
		"author": "群星",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/kewangguangrong.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9xc16xvej30go0gojww.jpg",
		"language": ["汉语"],
		"style": ["励志"],
	},
	{
		"title": "兄弟想你了",
		"author": "未知",
		"url": "https://cdn.jsdelivr.net/gh/1046224544/musiclist1@master/xiongdixiangnile.mp3",
		"post": "http://ww1.sinaimg.cn/large/005HV6Avgy1gk9xhkvp1oj308c08c0sw.jpg",
		"language": ["汉语"],
		"style": ["摇滚", "情感"],
	},
];

const MusicPlayer = {
	data() {
		return {
			spinning: false,
			currentMusic: {},
			playing: false,
			musicIndex: -1,
		}
	},

	mounted() {
		this.currentMusic = musicList[Math.floor(Math.random() * musicList.length)]
		this.musicIndex = musicList.map((music) => music.title).indexOf(this.currentMusic.title)
	},

	methods: {
		togglePlay() {
			if (this.playing) {
				this.$refs.musicPlayer.pause()
			} else {
				this.$refs.musicPlayer.play()
			}
			this.playing = !this.playing
		},
		nextMusic() {
			this.spinning = true
			if (this.musicIndex < musicList.length - 1) {
				this.musicIndex++
				this.currentMusic = musicList[this.musicIndex]
			} else {
				this.musicIndex = 0
				this.currentMusic = musicList[this.musicIndex]
			}
		},
		prevMusic() {
			this.spinning = true
			if (this.musicIndex < 1) {
				this.musicIndex = musicList.length - 1
				this.currentMusic = musicList[this.musicIndex]
			} else {
				this.musicIndex--
				this.currentMusic = musicList[this.musicIndex]
			}
		},
		loadMusic() {
			this.spinning = false
		},
		fetchMusic() {
			this.spinning = false
			this.$nextTick(() => {
				if (this.playing) {
					this.$refs.musicPlayer.play()
				}
			})
		},
		errorMusic(e) {
			if (e) {
				this.$message.error("歌曲错误，将为您播放下一首")
				this.nextMusic()
			}
		},
	},

	render() {
		return (
			<div class={"blog-musicplayer"}>
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
				<div class="music-cover">
					<img
						src={this.currentMusic.post}
					/>
				</div>
				<div class="music-content">
					<div class="music-title">
						{this.currentMusic.title}
					</div>

					<svg aria-hidden="true" class="music-icon close" data-v-d060bb14="">
						<use xlinkHref="#icon-close" data-v-d060bb14="">
							<svg id="icon-close" viewBox="0 0 1024 1024" data-v-d060bb14="">
								<path
									d="M514.496 738.944C389.392 738.944 288 637.536 288 512.448c0-125.104 101.392-226.512 226.496-226.512 125.088 0 226.496 101.408 226.496 226.512C740.992 637.536 639.6 738.944 514.496 738.944zM620.72 434.624c6.16-6.16 4.336-18-4.064-26.4l-0.96-0.944c-8.4-8.4-20.224-10.24-26.384-4.064l-75.344 75.36-80.816-80.832c-6.256-6.256-18.24-4.4-26.752 4.128l-0.96 0.96c-8.528 8.512-10.352 20.496-4.112 26.72l80.816 80.832-78.864 78.848c-6.176 6.192-4.352 17.984 4.064 26.4l0.944 0.944c8.4 8.4 20.224 10.256 26.384 4.064l78.88-78.88 76.32 76.336c6.256 6.24 18.224 4.416 26.736-4.112l0.976-0.976c8.528-8.496 10.368-20.48 4.112-26.736l-76.32-76.336L620.72 434.624z"
									data-v-d060bb14=""
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
								<svg id="icon-dingbuzuoqiehuan" viewBox="0 0 1024 1024" data-v-d060bb14="">
									<path d="M0 512L558.545455 0v1024z m465.454545 0L1024 0v1024z" data-v-d060bb14=""/>
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
						<svg aria-hidden="true" class="music-icon icon">
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
			</div>
		)
	}
}

export default MusicPlayer
