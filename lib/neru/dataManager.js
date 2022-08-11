/**
 * DataManager
 *
 * v0.1.0 Yazawazi
 */

const fs = require("fs")
const { log } = require("../log.js")

const DataManager = class {
    constructor(config) {
        this.structPath = config.structPath
        this.errorHandle = config.errorHandle
        this.packetIdTable = {}
        this.packetStructs = {}
        this._createPacketIdTable()
    }

    /**
     *
     * ! DO NOT CALL THIS FUNCTION IF YOU KNOW WHAT YOU ARE DOING.
     *
     * Create the packet id table from struct file.
     */
    _createPacketIdTable() {
        log("Creating packet id table...")
        const struct = fs.readFileSync(this.structPath)
        const structJson = JSON.parse(struct)
        for (const share of structJson) {
            if (share.isRPC) {
                this.packetIdTable[share.info[0].value] = share.info[1].value
                this.packetStructs[share.info[0].value] = share
            }
        }
        log("Packet id table created.")
    }

    /**
     * Get the PacketName<->ID Table.
     *
     * @return {Object}
     */
    getPacketIdTable() {
        return this.packetIdTable
    }

    /**
     * Parse the data to JSON object.
     *
     * @param {Buffer} data
     * @param {String || Number} type
     *
     * @return {Object}
     */
    parse(data, type) {

    }
}
