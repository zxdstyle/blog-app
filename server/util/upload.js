/*
 *      Generic much page project.
 *  FileName:   upload.js
 *  Create On:  2020/11/29 15:42
 *  Create By:  Peachick <wsm_1105@163.com>
 *  Copyright (c) 2017-present github.com/Peachick. All rights reserved.
 */
const fs = require("fs")
const path = require("path")
const { DateFormat } = require("./date")

const resolve = (...p) => path.resolve(__dirname, ...p)

const getFileExt = (fileName) => {
	const extReg = /(\.[^.]+)$/
	extReg.test(fileName)
	const ext = RegExp.$1
	extReg.lastIndex = 0
	return ext
}

const STATIC_DIR = resolve("../static")
const UPLOAD_FILE_PUBLIC_DIR = resolve("../static/upload")

const UPLOAD_FILE_TYPES = {
	DEFAULT: "DEFAULT", // 普通文件
	IMAGE: "IMAGE", // 图片
	MUSIC: "MUSIC", // 歌曲
}

const UPLOAD_FILE_TYPE_DIR_PREFIX = {
	[UPLOAD_FILE_TYPES.DEFAULT]: "",
	[UPLOAD_FILE_TYPES.IMAGE]: "./img",
	[UPLOAD_FILE_TYPES.MUSIC]: "./music",
}

const UPLOAD_FILE_TYPE_HTTP_PREFIX = {
	[UPLOAD_FILE_TYPES.DEFAULT]: "/upload/",
	[UPLOAD_FILE_TYPES.IMAGE]: "/upload/img/",
	[UPLOAD_FILE_TYPES.MUSIC]: "/upload/music/",
}

const handleUpload = async (ctx, file, fileType) => {
	try {
		const { path: FilePath, name: FileName, size: FileSize } = file
		const FileExt = await getFileExt(FileName)
		const newFileName = `${DateFormat("yyyyMMddHHmm")}_${Math.floor(Math.random() * 100000)}`
		const newFileFullName = `${newFileName}${FileExt}`
		const uploadFileDir = resolve(UPLOAD_FILE_PUBLIC_DIR, UPLOAD_FILE_TYPE_DIR_PREFIX[fileType], newFileFullName)
		const uploadTypeDir = resolve(UPLOAD_FILE_PUBLIC_DIR, UPLOAD_FILE_TYPE_DIR_PREFIX[fileType])
		const isExistStaticDir = await fs.existsSync(STATIC_DIR)
		if(!isExistStaticDir) {
			await fs.mkdirSync(STATIC_DIR)
			ctx.isDev ? console.log("static创建成功") : null
		}
		const isExistUploadDir = await fs.existsSync(UPLOAD_FILE_PUBLIC_DIR)
		if(!isExistUploadDir) {
			await fs.mkdirSync(UPLOAD_FILE_PUBLIC_DIR)
			ctx.isDev ? console.log("upload创建成功") : null
		}
		const isExistUploadType = await fs.existsSync(uploadTypeDir)
		if(!isExistUploadType) {
			await fs.mkdirSync(uploadTypeDir)
			ctx.isDev ? console.log(`upload:${fileType} 创建成功`) : null
		}
		const reader = fs.createReadStream(FilePath)
		const writer = fs.createWriteStream(uploadFileDir)
		await reader.pipe(writer)
		writer.on("finish", () => {
			ctx.isDev ? console.log(`文件上传成功:${newFileFullName}`) : null
		})
		return {
			url: uploadFileDir,
			ext: FileExt,
			name: newFileFullName,
			originName: FileName,
			size: FileSize,
			type: fileType,
		}
	} catch (error) {
		throw {
			...error,
			error: "服务器错误,文件上传失败",
			errorMsg: {
				message: error.message,
				...error,
			},
		}
	}
}

const getFileHttpURL = (ctx, fileName, fileType) => {
	const serverStorePath = `${UPLOAD_FILE_TYPE_HTTP_PREFIX[fileType]}${fileName}`
	return ctx.isDev ? `${ctx.protocol}://${ctx.host}${serverStorePath}` : serverStorePath
}

module.exports = {
	handleUpload,
	getFileHttpURL,
	UPLOAD_FILE_TYPES,
}
