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
                bodySize: 0,
                length: function () {
                    return this.bodySize
                }
            })
    }

    /**
     * Parse the model data to JSON object.
     *
     * @param {Buffer} modelData
     * @param {Number} modelsLength
     *
     * @return {Object}
     */
    parseModelData (modelData, modelsLength) {
        let offset = 0
        let models = []
        for (let i = 0; i < modelsLength; i++) {
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
        if (isRet) {
            const data = bodyData.subarray(0)
            return {
                rpcData: data
            }
        } else {
            const protocolId = bodyData.readUInt16LE(0)
            const rpcDataSize = bodyData.readUInt32BE(2)
            const rpcData = bodyData.subarray(6, 6 + rpcDataSize)
            const modelsLength = bodyData.readUInt16LE(6 + rpcDataSize)
            const modelsData = bodyData.subarray(8 + rpcDataSize)
            const protocolName = this.idPacket[protocolId]
            return {
                protocolId: protocolId,
                protocolName: protocolName,
                rpcDataSize: rpcDataSize,
                rpcData: rpcData,
                modelsLength: modelsLength,
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
            if ("bodyData" in result) result.body = this.parseBodyData(result.bodyData, result.isRpcRet)
            if ("modelsData" in result.body) result.model =
                this.parseModelData(result.body.modelsData, result.body.modelsLength)
            let protocolId = -1
            if ("protocolId" in result.body) protocolId = result.body.protocolId
            if ("rpcData" in result.body) result.fields = this.dataManager.parse(result.body.rpcData, protocolId)
            packets.push(result)
        })
        return packets
    }
}

module.exports = { PacketManager }
