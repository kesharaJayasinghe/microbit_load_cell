/**
 * Allows interface with the HX711 Load Cell Board
 */

//% color=#000000 weight=100 icon="\uf24e" block="Orel - Load Cell"
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
    export function GetCalibrationValue(): void {

        let j = 0
        let count = 0
        let rawValue = 0
        let totalValue = 0
        let avgValue = 0

        for (let i = 0; i < 5; i++) {

            pins.digitalWritePin(DigitalPin.P0, 0)
            count = 0

            while (pins.digitalReadPin(DigitalPin.P1) == 1) {

            }

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
                j = j + 1
            }

            pins.digitalWritePin(DigitalPin.P0, 1)
            control.waitMicros(5)
            rawValue = count ^ 0x800000
            rawValue = rawValue / 100
            pins.digitalWritePin(DigitalPin.P0, 0)

            totalValue = totalValue + rawValue;
        }    
        
        avgValue = totalValue / 5;
        basic.showNumber(avgValue)
    }

    //% block    
    export function ReadRawValue(): number {

        let j = 0
        let count = 0
        let rawValue = 0

        pins.digitalWritePin(DigitalPin.P0, 0)
        count = 0

        while (pins.digitalReadPin(DigitalPin.P1) == 1) {

        }

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
            j = j + 1
        }

        pins.digitalWritePin(DigitalPin.P0, 1)
        control.waitMicros(5)
        rawValue = count ^ 0x800000
        pins.digitalWritePin(DigitalPin.P0, 0)
        return rawValue;

    }


    //% block  
    //% blockId=load_cell block="readvalueingrams calibration %calibration|maximumload %maximumload"
    export function ReadValueInGramsWith(calibration: number, maximumload: number): number {

        let j = 0
        let count = 0
        let rawValue = 0
        let value = 0
        let output = 0
        let weight = 0

        pins.digitalWritePin(DigitalPin.P0, 0)
        count = 0

        while (pins.digitalReadPin(DigitalPin.P1) == 1) {

        }

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
            j = j + 1
        }

        pins.digitalWritePin(DigitalPin.P0, 1)
        control.waitMicros(5)
        rawValue = count ^ 0x800000
        pins.digitalWritePin(DigitalPin.P0, 0)

        value = rawValue / 100
        output = (value - calibration) * (5000000 / 10700)
        weight = output / 10000
        
        serial.writeLine("Calibration: ")
        serial.writeNumber(calibration)
        serial.writeLine("")
        serial.writeLine("Value: ")
        serial.writeNumber(value - calibration)
        serial.writeLine("")


        return weight;

    }

}