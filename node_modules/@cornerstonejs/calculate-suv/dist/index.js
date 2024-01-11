
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./calculate-suv.cjs.production.min.js')
} else {
  module.exports = require('./calculate-suv.cjs.development.js')
}
