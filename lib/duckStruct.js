/**
 * DuckStruct
 *
 * v0.1.0 Yazawazi
 */

const { TypeManager } = require("./neru/typeManager.js")

const DuckStruct = class {
    constructor (expression, fieldNames) {
        this.expression = expression || "*"
        this.fieldNames = fieldNames || []
        this.typeManager = new TypeManager()
        this.structs = []
        this.offset = 0
        this.times = 0
        this.support = {
            "all": "*",
            "float": "f",
            "double": "d",
            "bool": "b",
            "ushort": "S",
            "short": "s",
            "ulong": "L",
            "long": "l",
            "byte": "y",
            "sbyte": "Y",
            "uint": "I",
            "int": "i",
            "string": "T"
        }
    }

    /**
     * Get all support type
     *
     * @return {Object}
     */
    getTypes() {
        return this.support
    }

    /**
     * Clear the struct
     */
    clear() {
        this.expression = ""
        this.fieldNames = []
        this.structs = []
        this.offset = 0
        this.times = 0
    }

    /**
     * Set expression
     *
     * @param {String} expression
     */
    setExpression(expression) {
        this.expression = expression
    }

    /**
     * Set the fieldNames
     *
     * @param {String[]} fieldNames
     */
    setFieldNames(fieldNames) {
        this.fieldNames = fieldNames
    }

    /**
     * Get the fieldName
     *
     * @return {String}
     */
    getFieldName() {
        if (this.fieldNames.length > this.offset) {
            return this.fieldNames[this.offset]
        } else {
            return "Unknown"
        }
    }

    /**
     * Update the structs.
     *
     * @param {Object} result
     * @param {String} type
     * @param {Number} offsetAdd
     */
    update(result, type, offsetAdd) {
        let fieldName = this.getFieldName()
        this.structs.push({
            result: result,
            type: type,
            fieldName: fieldName
        })
        this.offset += offsetAdd
        this.times += 1
    }

    /**
     * Parse the data to JSON object.
     *
     * @param {Buffer} data
     *
     * @return {Array}
     */
    parse(data) {
        let result = null
        let length = 0
        for (let i = 0; i < this.expression.length; i++) {
            switch (this.expression[i]) {
                case "*":
                    return [data]
                case "f":
                    result = this.typeManager.readFloat(
                        data.subarray(this.offset, this.offset + 4)
                    )
                    this.update(result, "float", 4)
                    break
                case "d":
                    result = this.typeManager.readDouble(
                        data.subarray(this.offset, this.offset + 8)
                    )
                    this.update(result, "double", 8)
                    break
                case "b":
                    result = this.typeManager.readBool(
                        data.subarray(this.offset, this.offset + 1)
                    )
                    this.update(result, "bool", 1)
                    break
                case "S":
                    result = this.typeManager.readUShort(
                        data.subarray(this.offset, this.offset + 2)
                    )
                    this.update(result, "ushort", 2)
                    break
                case "s":
                    result = this.typeManager.readShort(
                        data.subarray(this.offset, this.offset + 2)
                    )
                    this.update(result, "short", 2)
                    break
                case "L":
                    result = this.typeManager.readULong(
                        data.subarray(this.offset, this.offset + 8)
                    )
                    this.update(result, "ulong", 8)
                    break
                case "l":
                    result = this.typeManager.readLong(
                        data.subarray(this.offset, this.offset + 8)
                    )
                    this.update(result, "long", 8)
                    break
                case "y":
                    result = this.typeManager.readByte(
                        data.subarray(this.offset, this.offset + 1)
                    )
                    this.update(result, "byte", 1)
                    break
                case "Y":
                    result = this.typeManager.readSByte(
                        data.subarray(this.offset, this.offset + 1)
                    )
                    this.update(result, "sbyte", 1)
                    break
                case "I":
                    result = this.typeManager.readUInt(
                        data.subarray(this.offset, this.offset + 4)
                    )
                    this.update(result, "uint", 4)
                    break
                case "i":
                    result = this.typeManager.readInt(
                        data.subarray(this.offset, this.offset + 4)
                    )
                    this.update(result, "int", 4)
                    break
                case "T":
                    length = this.typeManager.readStringLength(data.subarray(this.offset))
                    result = this.typeManager.readString(
                        data.subarray(this.offset, this.offset + length + 4)
                    )
                    this.update(result, "string", length + 4)
                    break
                default:
                    throw new Error("Unknown expression: " + this.expression[i])
            }
        }
        return this.structs
    }
}

module.exports = { DuckStruct }
