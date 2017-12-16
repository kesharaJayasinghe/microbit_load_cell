/**
 * Allows interface with the HX711 Load Cell Board
 */

enum maxWeight {

    //% block="5kg"
    fivekilograms,

    //% block="500g"
    fivehundredgrams,
}

let lastValue = 0;
let value = 0;


//% color=#000000 weight=100 icon="\uf24e" block="Orel - Load Cell"
namespace Load_Cell {

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


    //% block  
    //% blockId=load_cell block="read value in grams with calibration %calibration| and maximum load %maximumload"
    export function ReadValueInGramsWith(calibration: number, maximumLoad: maxWeight): number {

        let j = 0
        let count = 0
        let rawValue = 0
        let output = 0
        let weight = 0
        let maximumLoadValue = 0;
        let inputRange = 0;
        let outputMax = 0;
        let inputKnownWeight = 0;


        switch (maximumLoad) {
            case maxWeight.fivehundredgrams: maximumLoadValue = 5000000;
            case maxWeight.fivekilograms: maximumLoadValue = 50000000;
            default: maximumLoadValue = 50000000;
        }

        switch (maximumLoad) {
            case maxWeight.fivehundredgrams: outputMax = 500, inputKnownWeight = 10700;
            case maxWeight.fivekilograms: outputMax = 5000, inputKnownWeight = 109166;
        }

        if (input.buttonIsPressed(Button.A)) {
            basic.showLeds(`
            # # # # #
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            `)

            calibration = lastValue;

            basic.pause(500)

            basic.showLeds(`
            . . . . . 
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
        }

        inputRange = outputMax * (inputKnownWeight - calibration) / outputMax;


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
        output = (value - calibration) * (maximumLoadValue / inputRange)
        weight = output / 10000

        serial.writeLine("Calibration: ")
        serial.writeNumber(calibration)
        serial.writeLine("")
        serial.writeLine("Value: ")
        serial.writeNumber(value)
        serial.writeLine("")
        serial.writeLine("Value-Calibration: ")
        serial.writeNumber(value - calibration)
        serial.writeLine("")
        serial.writeLine("Weight Output: ")
        serial.writeNumber(weight)
        serial.writeLine("")

        if (weight < 0) weight = 0;


        switch (maximumLoad) {
            case maxWeight.fivehundredgrams: {
                if (weight > 500) { weight = 500 };
            }
            case maxWeight.fivekilograms: {
                if (weight > 5000) { weight = 5000 };
            }
        }

        lastValue = value;
        return weight;

    }

    //% block      
    export function TareWith(maximumLoad: maxWeight): number {

        let j = 0
        let count = 0
        let rawValue = 0
        let output = 0
        let weight = 0
        let maximumLoadValue = 0;
        let inputRange = 0;
        let outputMax = 0;
        let inputKnownWeight = 0;
        let calibration = value;


        switch (maximumLoad) {
            case maxWeight.fivehundredgrams: maximumLoadValue = 5000000;
            case maxWeight.fivekilograms: maximumLoadValue = 50000000;
            default: maximumLoadValue = 50000000;
        }

        switch (maximumLoad) {
            case maxWeight.fivehundredgrams: outputMax = 500, inputKnownWeight = 10700;
            case maxWeight.fivekilograms: outputMax = 5000, inputKnownWeight = 109166;
        }



        inputRange = outputMax * (inputKnownWeight - calibration) / outputMax;


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
        output = (value - calibration) * (maximumLoadValue / inputRange)
        weight = output / 10000

        serial.writeLine("Calibration: ")
        serial.writeNumber(calibration)
        serial.writeLine("")
        serial.writeLine("Value: ")
        serial.writeNumber(value)
        serial.writeLine("")
        serial.writeLine("Value-Calibration: ")
        serial.writeNumber(value - calibration)
        serial.writeLine("")
        serial.writeLine("Weight Output: ")
        serial.writeNumber(weight)
        serial.writeLine("")

        if (weight < 0) weight = 0;


        switch (maximumLoad) {
            case maxWeight.fivehundredgrams: {
                if (weight > 500) { weight = 500 };
            }
            case maxWeight.fivekilograms: {
                if (weight > 5000) { weight = 5000 };
            }
        }

        return weight;

    }

}