/**
 * PacketManager
 *
 * v0.1.0 Yazawazi
 */

const BinaryParser = require("binary-parser").Parser
const { DataManager } = require("./dataManager.js")

const { structPath, errorHandle } = require("../../config.json")

const PacketManager = class {
    constructor () {
        this.dataManager = new DataManager({
            errorHandle: errorHandle,
            structPath: structPath
        })

        this.idPacket = this.dataManager.getIdPacketTable()

        this.errorHandle = errorHandle || false
        this.cPacketParser = new BinaryParser()
            .endianess("little")
            .uint16("remoteChannel")
            .uint32("bodySize")
            .uint16("headerSize")
            .uint16("toChannel")
            .uint16("fromChannel")
            .bit1("isRpcRet")
            .uint64("rpcArgUID")
            .buffer("bodyData", {
                length: function () {
                    return this.bodySize
                }
            })
    }

    /**
     * Parse the model data to JSON object.
     *
     * @param {Buffer} modelData
     *
     * @return {Object}
     */
    parseModelData(modelData) {
        let offset = 0
        let models = []
        while (offset < modelData.length) {
            const middlewareId = modelData.readUInt16LE(offset)
            offset += 2
            const middlewareSize = modelData.readUInt16BE(offset)
            offset += 2
            const playerUID = modelData.readBigUint64LE(offset)
            offset += 8
            const clientProtocolUID = modelData.readBigUint64LE(offset)
            offset += 8
            const resend = modelData.readUInt8(offset) === 0x01
            models.push({
                middlewareId: middlewareId,
                middlewareSize: middlewareSize,
                playerUID: playerUID,
                clientProtocolUID: clientProtocolUID,
                resend: resend
            })
        }
        return models
    }

    /**
     * Parse the body data to JSON object.
     *
     * @param {Buffer} bodyData
     * @param {boolean} isRet
     *
     * @return {Object}
     */
    parseBodyData(bodyData, isRet) {
        let offset = 0
        if (isRet) {
            offset += 6
            const data = bodyData.subarray(offset)
            return {
                data: data
            }
        } else {
            const protocolId = bodyData.readUInt16LE(offset)
            const rpcDataSize = bodyData.readUInt32BE(offset + 2)
            const rpcData = bodyData.subarray(offset + 6, offset + 6 + rpcDataSize)
            const modelsSize = bodyData.readUInt16LE(offset + 6 + rpcDataSize)
            const modelsData = bodyData.subarray(offset + 8 + rpcDataSize, offset + 8 + rpcDataSize + modelsSize)
            const protocolName = this.idPacket[protocolId]
            return {
                protocolId: protocolId,
                protocolName: protocolName,
                rpcDataSize: rpcDataSize,
                rpcData: rpcData,
                modelsSize: modelsSize,
                modelsData: modelsData
            }
        }
    }

    /**
     * Parse the data to JSON object.
     *
     * @param {Buffer[]} data
     *
     * @return {Object[]}
     */
    parse(data) {
        let packets = []
        data.forEach(packet => {
            let result = this.cPacketParser.parse(packet)
            result.isRpcRet = result.isRpcRet === 1
            result.body = this.parseBodyData(result.bodyData, result.isRpcRet)
            if ("modelsData" in result.body) result.model = this.parseModelData(result.body.modelsData)
            packets.push(result)
        })
        return packets
    }
}

module.exports = { PacketManager }
