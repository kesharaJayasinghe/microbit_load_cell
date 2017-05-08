/**
 * Provides access to basic micro:bit functionality.
 */

//% color=000000 weight=100 icon="\uf1ec" block="Jonathan"
namespace jonathan 
{

//% block
export function allLED(): void
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