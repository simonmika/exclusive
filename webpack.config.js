require('ts-node').register({
	project: './config/webpack.tsconfig.json'
})
module.exports = require('./config/webpack.config.ts').default
