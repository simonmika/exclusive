require('ts-node').register({
	project: './source/webpack.tsconfig.json'
})
module.exports = require('./webpack.config.ts').default
