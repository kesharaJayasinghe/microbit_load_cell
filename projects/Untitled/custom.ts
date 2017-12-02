/**
 * Provides access to basic micro:bit functionality.
 */

//% color=#000000 weight=100 icon="\uf08a" block="Jonathan"
namespace jonathan {

    //% block
    export function allLED(): void {
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
    export function fadeLED(duration: number): void {

        led.plotAll()
        for (let i = 0; i <= 5 - 1; i++) {
            led.setBrightness(0)
            led.fadeIn(duration)
            basic.pause(500)
            led.fadeOut(duration)
        }


    }

}