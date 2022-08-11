require("colors")

const log = obj => console.log(`[LOG\t ${new Date().toISOString()}] ${obj}`.magenta)
const warn = obj => console.warn(`[WARN\t ${new Date().toISOString()}] ${obj}`.yellow)
const error = obj => console.error(`[ERROR\t ${new Date().toISOString()}] ${obj}`.red)
const debug = obj => console.debug(`[DEBUG\t ${new Date().toISOString()}] ${obj}`.gray)

module.exports = {
    log,
    warn,
    error,
    debug
}
