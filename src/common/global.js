import * as api from './api'
import tool from './tool'

global.DATEFORMAT = 'YYYY-MM-DD HH:mm:ss'

Object.defineProperties(global, {
    api: {
        value: api,
        writable: false
    },
    tool: {
        value: tool,
        writable: false
    }
})