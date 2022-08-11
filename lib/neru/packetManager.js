/**
 * PacketManager
 *
 * v0.1.0 Yazawazi
 */

const BinaryParser = require("binary-parser").Parser

const PacketManager = class {
    constructor (config) {
        this.errorHandle = config.errorHandle || false
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
            return {
                protocolId: protocolId,
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
            result.body = this.parseBodyData(result.bodyData, result.isRpcRet)
            packets.push(result)
        })
        return packets
    }
}

module.exports = { PacketManager }
