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
     * Parse the data to JSON object.
     *
     * @param {Buffer[]} data
     *
     * @return {Array}
     */
    parse(data) {
        let packets = []
        data.forEach(packet => {
            let result = this.cPacketParser.parse(packet)
            packets.push(result)
        })
        return packets
    }
}

module.exports = { PacketManager }
