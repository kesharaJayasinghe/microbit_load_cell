/**
 * Provides access to basic micro:bit functionality.
 */

//% color=#000000 weight=100 icon="\uf013" block="Orel - Temp Sensor"
namespace jonathan {

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
    export function setTempThreshold(value: number): void {
        basic.showLeds
            (`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)
    }
