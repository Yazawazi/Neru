// ZZZ Only
// Have bugs i guess

const FrameManager = class {
    constructor () {
        this.data = null
    }

    /**
     * Set the TCP Stream data.
     *
     * @param {Buffer[]} data
     */
    setTCPStreamData(data) {
        this.data = data
    }

    /**
     * Get Analyzed Packets.
     *
     * @return {Buffer[]} data
     */
    getAnalyzedPackets() {
        let packets = []
        this.data.forEach(packet => {
            if (packet.length <= 2) return
            if (packet[6] === 0x0d) {
                packets.push(packet)
            } else {
                packets[packets.length - 1] = Buffer.concat([packets[packets.length - 1], packet])
            }
        })
        return packets
    }
}

module.exports = { FrameManager }
