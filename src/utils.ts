import { BigInt } from "@graphprotocol/graph-ts";

export const ONE = BigInt.fromI32(1)
export const ZERO = BigInt.fromI32(0)


export function pow(base: BigInt, exponent: BigInt): BigInt {
    if (exponent.equals(ZERO)) return ONE; // Any number to the power of 0 is 1
    if (exponent.equals(ONE)) return base; // Any number to the power of 1 is the number itself

    let half = pow(base, exponent.div(ONE.plus(ONE)));

    if (exponent.mod(ONE.plus(ONE)).equals(ZERO)) {
        return half.times(half);
    } else {
        return base.times(half.times(half));
    }
}