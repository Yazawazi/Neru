/**
 * DataManager
 *
 * v0.1.0 Yazawazi
 */

const fs = require("fs")
const { log } = require("../log.js")
const { DuckStruct } = require("../duckStruct.js")

const DataManager = class {
    constructor(config) {
        this.structPath = config.structPath || "./struct.json"
        this.errorHandle = config.errorHandle || false
        this.packetIdTable = {}
        this.packetStructs = {}
        this.idTable = {}
        this.duckStruct = new DuckStruct()
        this.supportType = this.duckStruct.getTypes()
        this.createPacketIdTable()
    }

    /**
     * Extract the struct expression and field name list from the struct.
     *
     * @param {Object} struct
     *
     * @return {Object}
     */
    extractExpression(struct) {
        let expression = ""
        let names = []

        if ("isEmpty" in struct && struct.isEmpty) {
            expression = "*"
            names = []
        } else {
            for (const field of struct.fields) {
                const lowerType = field.type.toLowerCase()
                if (lowerType in this.supportType) {
                    expression += this.supportType[lowerType]
                    names.push(field.name)
                } else {
                    expression = "*"
                    names = []
                    break
                }
            }
        }

        return {
            expression: expression,
            names: names
        }
    }

    /**
     * Create the packet id table from struct file.
     */
    createPacketIdTable() {
        log("Creating packet id table...")

        this.packetIdTable["None"] = -1
        this.packetStructs["None"] = {}
        this.packetIdTable[-1] = "None" // For some reason, I need this.

        const struct = fs.readFileSync(this.structPath).toString("utf-8")
        const structJson = JSON.parse(struct)
        for (const share of structJson) {
            if ("isRPC" in share && share.isRPC) {
                this.packetIdTable[share.info[0].value] = share.info[1].value
                this.idTable[share.info[1].value] = share.info[0].value
            }
            this.packetStructs[share.name] = share
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
     * @param {boolean} isRet
     *
     * @return {Object[]}
     */
    parse(data, type= -1, isRet) {
        if (type === -1 || type === "None") return [{ parse: false, data: data }]
        let struct = null
        if (type in this.packetStructs) {
            const message = this.packetStructs[type]
            if (isRet) {
                if ("ret" in message) struct = message.ret
            } else {
                if ("arg" in message) struct = message.arg
            }
        } else {
            const message = this.packetStructs[this.idTable[type]]
            if (isRet) {
                if ("ret" in message) struct = message.ret
            } else {
                if ("arg" in message) struct = message.arg
            }
        }

        this.duckStruct.clear()

        const { expression, names } = this.extractExpression(struct)
        this.duckStruct.setExpression(expression)
        this.duckStruct.setFieldNames(names)

        return this.duckStruct.parse(data)
    }

}

module.exports = { DataManager }
