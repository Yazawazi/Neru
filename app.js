const fs = require("fs")
const pcapParser = require("pcap-parser")

const { ipHeaderParser, tcpHeaderParser } = require("./lib/headerReader.js")
const { PacketManager } = require("./lib/neru-lib.js")
const { FrameManager } = require("./lib/frameManager.js")
const { error } = require("./lib/log.js")
const { structPath, errorHandle } = require("./config.json")

const args = process.argv.slice(2)
if (args[0] === null) {
    error("No file specified!")
    return
}

const stream = fs.createReadStream(args[0])
const parser = pcapParser.parse(stream)

let packets = []

const packetManager = new PacketManager({
    errorHandle: errorHandle,
    structPath: structPath
})
const frameManager = new FrameManager()

parser.on("packet", packet => {
    let ethernet = packet.data.readInt16LE(12)

    if (ethernet !== 8) return
    const ip = packet.data.slice(14)
    const ipHeader = ipHeaderParser.parse(ip)

    const isTcp = ipHeader.protocol === 6

    if (isTcp) {
        const tcp = ipHeader.data
        const tcpHeader = tcpHeaderParser.parse(tcp)

        const tcpData = tcpHeader.data
        if (tcpData.length <= 0) return
        if (tcpData[0] === 0x64 && tcpData[1] === 0x00 && tcp.length() === 2) return // Handshake

        packets.push(tcpData)
    }
})

parser.on("end", async () => {
    frameManager.setTCPStreamData(packets)
    const analyzedPackets = frameManager.getAnalyzedPackets()

    const allPackets = packetManager.parse(analyzedPackets)

    for (const packet of allPackets) {
        console.log(packet)
    }
})
