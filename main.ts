/**
 * Provides access to basic micro:bit functionality.
 */

//% color=190 weight=100 icon="\uf1ec" block="Basic Blocks"
namespace jonathan 
{

//% block
export function allLED(v: number, interval: number = 150): void
{
    basic.showLeds
    (`
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    # # # # #
    `)

 }

}