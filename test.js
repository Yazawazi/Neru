const fs = require("fs")
const pcapParser = require("pcap-parser")

const stream = fs.createReadStream("E:/meledy.pcap")
const parser = pcapParser.parse(stream)

const { ipHeaderParser, tcpHeaderParser } = require("./lib/headerReader.js")
const { PacketManager } = require("./lib/neru/packetManager.js")
const { FrameManager } = require("./lib/frameManager.js")

const print = arg => console.log(arg)
let packets = []

const packetManager = new PacketManager()

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
        print(packet)
    }
})
