/**
 * Allows interface with the HX711 Load Cell Board
 */

enum maxWeight {

    //% block="5kg"
    fivekilograms,

    //% block="500g"
    fivehundredgrams,
}


let value = 0;
let usedCalibration = 0;
let maximumLoadValue = 50000000;
let outputMax = 5000;
let inputKnownWeight = 109166;


//% color=#000000 weight=100 icon="\uf24e" block="Orel - Load Cell"
namespace Load_Cell {

    /**
     * Initialize a 500g load cell. Call in the "on start" block
     */
    //% block  
    export function InitializeW500gLoadCellWith(calibration: number): void {

        usedCalibration = calibration;
        maximumLoadValue = 5000000;
        outputMax = 500;
        inputKnownWeight = 95355;
    }


    /**
     * Initialize a 500g load cell. Call in the "on start" block
     */
    //% block  
    export function InitializeW5kgLoadCellWith(calibration: number): void {

        usedCalibration = calibration;
        maximumLoadValue = 50000000;
        outputMax = 5000;
        inputKnownWeight = 109166;
    }


    /**
     * Use this function when no weight is placed on the load cell. Returns the value that can be used for calibration.
     */
    //% block    
    export function GetCalibrationValue(): void {

        let j = 0
        let count = 0
        let rawValue = 0
        let totalValue = 0
        let avgValue = 0

        pins.digitalWritePin(DigitalPin.P0, 0)

        while (pins.digitalReadPin(DigitalPin.P1) == 1) {

        }

        for (let i = 0; i < 10; i++) {

            pins.digitalWritePin(DigitalPin.P0, 0)
            count = 0
            j = 0

            while (pins.digitalReadPin(DigitalPin.P1) == 1) {

            }

            count = 0
            rawValue = 0

            while (j < 24) {
                pins.digitalWritePin(DigitalPin.P0, 1)
                control.waitMicros(5)
                pins.digitalWritePin(DigitalPin.P0, 0)
                control.waitMicros(5)
                count = count << 1;
                if (pins.digitalReadPin(DigitalPin.P1) == 1) {
                    count = count + 1
                }

                if (j == 23) {
                    pins.digitalWritePin(DigitalPin.P0, 1)
                    control.waitMicros(5)
                    pins.digitalWritePin(DigitalPin.P0, 0)
                    control.waitMicros(5)
                }
                j = j + 1

            }

            rawValue = count ^ 0x800000

            rawValue = rawValue / 100

            serial.writeLine("Raw Value: ")
            serial.writeNumber(rawValue)
            serial.writeLine(" ")

            totalValue = totalValue + rawValue;

        }

        avgValue = totalValue / 10;
        basic.showNumber(avgValue)
    }

    /**
     * Sets the current weight value to 0, regardless of the load on the cell. Assign this function to button A or B
     */
    //% block  
    export function CalibrateToZero(): void {

        basic.showLeds(`
    # # # # #
    . . # . .
    . . # . .
    . . # . .
    . . # . .
    `)

        usedCalibration = value;

        basic.clearScreen()
        basic.pause(500)

    }

    /**
    * Read raw sensor reading with no conversion. Value depends on calibration. Useful for creating your own scale. Call initialization function in "on start" block first
    */
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
        control.waitMicros(3)
        rawValue = count ^ 0x800000
        pins.digitalWritePin(DigitalPin.P0, 0)
        return rawValue;
    }


    /**
    * Read sensor value in grams. Value depends on calibration. Call initialization function in "on start" block first
    */    
    //% block  
    export function ReadValueInGrams(): number {

        let j = 0
        let count = 0
        let rawValue = 0
        let output = 0
        let weight = 0
        let inputRange = 0;

        inputRange = outputMax * (inputKnownWeight - usedCalibration) / outputMax;


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

            if (j == 23) {
                pins.digitalWritePin(DigitalPin.P0, 1)
                control.waitMicros(5)
                pins.digitalWritePin(DigitalPin.P0, 0)
                control.waitMicros(5)
            }

            j = j + 1
        }

        rawValue = count ^ 0x800000

        value = rawValue / 100
        output = (value - usedCalibration) * (maximumLoadValue / inputRange)
        weight = output / 10000

        serial.writeLine("Calibration: ")
        serial.writeNumber(usedCalibration)
        serial.writeLine("")
        serial.writeLine("Maximum Load Value")
        serial.writeNumber(maximumLoadValue);
        serial.writeLine("")
        serial.writeLine("Input Known Weight")
        serial.writeNumber(inputKnownWeight);
        serial.writeLine("")
        serial.writeLine("Raw Value")
        serial.writeNumber(rawValue);
        serial.writeLine("")
        serial.writeLine("Value: ")
        serial.writeNumber(value)
        serial.writeLine("")
        serial.writeLine("Value-Calibration: ")
        serial.writeNumber(value - usedCalibration)
        serial.writeLine("")
        serial.writeLine("Weight Output: ")
        serial.writeNumber(weight)
        serial.writeLine("")

        return weight;
    }


}
