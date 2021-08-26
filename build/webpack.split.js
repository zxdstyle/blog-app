const chunks = {
	'ant-design-vue': ['ant-design-vue'],
	'@ant-design': ['@ant-design'],
	'core-js': ['core-js'],
	'@bytemd/vue': ['@bytemd/vue'],
	'moment': ['moment'],
	'axios': ['axios'],
	'crypto-js': ['crypto-js'],
}

const modules = [];
Object.keys(chunks).forEach((name) => {
	chunks[name].forEach((submodule) => {
		modules.push(submodule)
	})
})

function getCacheGroups() {
	const cacheGroups = {
		vendors: {
			test: (module) => {
				let flag = 0
				if (/node_modules/.test(module.context)) {
					flag += 1
				}
				modules.forEach((submodule) => {
					const reg = new RegExp(`node_modules/${submodule}`)
					if (!reg.test(module.context)) {
						flag += 1
					}
				});
				if (!/\.css$/.test(module.request)) {
					flag += 1
				}
				return flag === (modules.length + 2)
			},
			name: 'vendors',
			chunks: 'initial',
			priority: -1,
		},
	}

	Object.keys(chunks).forEach((name) => {
		cacheGroups[name] = {
			test: (module) => {
				let flag = 0;
				chunks[name].forEach((submodule) => {
					const reg = new RegExp(`node_modules/${submodule}`)
					if (reg.test(module.context)) {
						flag += 1;
					}
				});
				return flag > 0 && !/\.css$/.test(module.request);
			},
			name,
			chunks: 'initial',
			priority: -2,
		}
	})

	cacheGroups.others = {
		test: (module) => /node_modules/.test(module.context) && !/\.css$/.test(module.request),
		name: 'others',
		chunks: 'initial',
		priority: -3,
	};

	return cacheGroups
}

module.exports = getCacheGroups
