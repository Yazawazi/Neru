/**
 * DataManager
 *
 * v0.1.0 Yazawazi
 */

const fs = require("fs")
const { log } = require("../log.js")

const DataManager = class {
    constructor(config) {
        this.structPath = config.structPath || "./struct.json"
        this.errorHandle = config.errorHandle || false
        this.packetIdTable = {}
        this.packetStructs = {}
        this.idTable = {}
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
        const struct = fs.readFileSync(this.structPath).toString("utf-8")
        const structJson = JSON.parse(struct)
        for (const share of structJson) {
            if ("isRPC" in share && share.isRPC) {
                this.packetIdTable[share.info[0].value] = share.info[1].value
                this.packetStructs[share.info[0].value] = share
                this.idTable[share.info[1].value] = share.info[0].value
            }
        }
        log("Packet id table created.")
    }

    /**
     * Get the PacketName->ID Table.
     *
     * @return {Object}
     */
    getPacketIdTable() {
        return this.packetIdTable
    }

    /**
     * Get the ID->PacketName Table
     *
     * @return {Object}
     */
    getIdPacketTable() {
        return this.idTable
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
        return {}
    }
}

module.exports = {
    DataManager
}

