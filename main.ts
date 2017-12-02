/**
 * Allows interface with the HX711 Load Cell Board
 */

//% color=#000000 weight=100 icon="\uf013" block="Orel - Load Cell"
namespace Load_Cell {

    //% block
    export function readTemp(): void {
        basic.showLeds
            (`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
    }



    //% block    
    export function readValue(): number {

        serial.writeString("one")
        let j = 0
        let count = 0
        pins.digitalWritePin(DigitalPin.P0, 0)
        count = 0
        serial.writeString("two")

        while (pins.digitalReadPin(DigitalPin.P1) == 1) {

        }

        serial.writeString("three")
        count = 0
        while (j < 24) {
            pins.digitalWritePin(DigitalPin.P0, 1)
            control.waitMicros(5)
            pins.digitalWritePin(DigitalPin.P0, 0)
            control.waitMicros(5)
            basic.pause(1)
            count = count << 1;
            if (pins.digitalReadPin(DigitalPin.P1) == 1) {
                count = count + 1
            }
        }
        serial.writeString("four")
        pins.digitalWritePin(DigitalPin.P0, 1)
        control.waitMicros(5)
        count = count ^ 0x800000
        pins.digitalWritePin(DigitalPin.P0, 0)
        serial.writeString("Weight Value:")
        serial.writeNumber(count)
        serial.writeLine("")
        serial.writeLine("")
        serial.writeString("five")
        return count;

    }
}