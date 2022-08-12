/**
 * TypeManager
 *
 * v0.1.0 Yazawazi
 */

const TypeManager = class {
    constructor () {
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
        return Buffer.from([
            number >> 56 & 0xFF,
            number >> 48 & 0xFF,
            number >> 40 & 0xFF,
            number >> 32 & 0xFF,
            number >> 24 & 0xFF,
            number >> 16 & 0xFF,
            number >> 8 & 0xFF,
            number & 0xFF
        ])
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
        return Buffer.from([
            number >> 24 & 0xFF,
            number >> 16 & 0xFF,
            number >> 8 & 0xFF,
            number & 0xFF
        ])
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
        if (needUTF8) {
            return {
                length: length,
                value: data.toString("utf8", 4, 4 + length)
            }
        }
        return {
            length: length,
            value: data.toString("binary", 4, 4 + length)
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
