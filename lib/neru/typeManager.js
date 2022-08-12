/**
 * TypeManager
 *
 * v0.1.0 Yazawazi
 */

const TypeManager = class {
    constructor () {
    }

    /**
     * Parse the CPDictionary
     *
     * @param {Buffer} data
     */

    /**
     * Parse the Float
     *
     * @param {Buffer} data
     *
     * @return {Number}
     */
    readFloat(data) {
        return data.readFloatLE()
    }

    /**
     * Write the Float
     *
     * @param {Number} number
     *
     * @return {Buffer}
     */
    writeFloat(number) {
        const data = Buffer.alloc(4)
        data.writeFloatLE(number)
        return data
    }

    /**
     * Parse the Double
     *
     * @param {Buffer} data
     *
     * @return {Number}
     */
    readDouble(data) {
        return data.readDoubleLE()
    }

    /**
     * Write the Double
     *
     * @param {Number} number
     *
     * @return {Buffer}
     */
    writeDouble(number) {
        const data = Buffer.alloc(8)
        data.writeDoubleLE(number)
        return data
    }

    /**
     * Parse the bool
     *
     * @param {Buffer} data
     *
     * @return {Boolean}
     */
    readBool(data) {
        return data.readUInt8() === 1
    }

    /**
     * Write the bool
     *
     * @param {Boolean} bool
     *
     * @return {Buffer}
     */
    writeBool(bool) {
        return Buffer.from([bool ? 1 : 0])
    }

    /**
     * Parse the UShort
     *
     * @param {Buffer} data
     *
     * @return {Number}
     */
    readUShort(data) {
        return data.readUInt16LE()
    }

    /**
     * Write the UShort
     *
     * @param {Number} number
     */
    writeUShort(number) {
        return Buffer.from([
            number >> 8 & 0xFF,
            number & 0xFF
        ])
    }

    /**
     * Parse the Short
     *
     * @param {Buffer} data
     *
     * @return {Number}
     */
    readShort(data) {
        return data.readInt16LE()
    }

    /**
     * Write the Short
     *
     * @param {Number} number
     */
    writeShort(number) {
        return Buffer.from([
            number >> 8 & 0xFF,
            number & 0xFF
        ])
    }

    /**
     * Parse the ULong
     *
     * @param {Buffer} data
     *
     * @return {BigInt}
     */
    readULong(data) {
        return data.readBigUInt64LE()
    }

    /**
     * Write the ULong
     *
     * @param {BigInt} number
     *
     * @return {Buffer}
     */
    writeULong(number) {
        const data = Buffer.alloc(8)
        data.writeBigUint64LE(number)
        return data
    }

    /**
     * Parse the Long
     *
     * @param {Buffer} data
     *
     * @return {BigInt}
     */
    readLong(data) {
        return data.readBigInt64LE()
    }

    /**
     * Write the Long
     *
     * @param {BigInt} number
     *
     * @return {Buffer}
     */
    writeLong(number) {
        const data = Buffer.alloc(8)
        data.writeBigInt64LE(number)
        return data
    }

    /**
     * Parse the Byte
     *
     * @param {Buffer} data
     *
     * @return {Buffer}
     */
    readByte(data) {
        return Buffer.from(data.readUInt8())
    }

    /**
     * Write the Byte
     *
     * @param {Buffer || Number} data
     *
     * @return {Buffer}
     */
    writeByte(data) {
        return Buffer.from([data])
    }

    /**
     * Parse the SByte
     *
     * @param {Buffer} data
     *
     * @return {Buffer}
     */
    readSByte(data) {
        return Buffer.from(data.readInt8())
    }

    /**
     * Write the SByte
     *
     * @param {Buffer || Number} data
     *
     * @return {Buffer}
     */
    writeSByte(data) {
        return Buffer.from([data & 0xFF])
    }

    /**
     * Parse the UInt
     *
     * @param {Buffer} data
     *
     * @return {Number}
     */
    readUInt(data) {
        return data.readUInt32LE()
    }

    /**
     * Write the UInt
     *
     * @param {Number} number
     *
     * @return {Buffer}
     */
    writeUInt(number) {
        const data = Buffer.alloc(4)
        data.writeUInt32LE(number)
        return data
    }

    /**
     * Parse the Int
     *
     * @param {Buffer} data
     *
     * @return {Number}
     */
    readInt(data) {
        return data.readInt32LE()
    }

    /**
     * Write the Int
     *
     * @param {Number} number
     *
     * @return {Buffer}
     */
    writeInt(number) {
        const data = Buffer.alloc(4)
        data.writeInt32LE(number)
        return data
    }

    /**
     * Parse the String Length
     *
     * @param {Buffer} data
     *
     * @return {Object}
     */
    readStringLength(data) {
        return data.readUInt32LE()
    }

    /**
     * Parse the String
     *
     * @param {Buffer} data
     * @param {boolean} needUTF8
     *
     * @return {Object}
     */
    readString(data, needUTF8 = true) {
        const length = data.readUInt32LE()
        const stringData = data.subarray(4, 4 + length)
        if (needUTF8) {
            return {
                length: length,
                value: stringData.toString("utf8")
            }
        }
        return {
            length: length,
            value: stringData.toString("binary")
        }
    }

    /**
     * Write the String
     *
     * @param {String} string
     * @param {boolean} needUTF8
     *
     * @return {Buffer}
     */
    writeString(string, needUTF8 = true) {
        if (needUTF8) {
            return Buffer.concat([
                this.writeInt(string.length),
                Buffer.from(string, "utf8")
            ])
        }
        return Buffer.concat([
            this.writeInt(string.length),
            Buffer.from(string, "binary")
        ])
    }
}

module.exports = { TypeManager }
