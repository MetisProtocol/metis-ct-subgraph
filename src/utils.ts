import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { User } from "./generated/schema";

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

export function getOrCreateUser(address: string, block: ethereum.Block) : User {
    let user = User.load(address)

    if(!user) {
        user = new User(address);
        user.actionCount = ZERO
        user.dateJoined = block.timestamp;
        user.blockJoined = block.number;
    
        user.joinId = null;
        user.score = ZERO;
        user.actionCount = ZERO;
    
        user.netswapSwap = ZERO
        user.netswapLp = ZERO
      
        user.tethysPerp = ZERO
        user.tethysTLP = ZERO
        user.tethysSwap = ZERO
    
        user.midasLottery = ZERO
        user.leagueBuy = ZERO
        user.leagueSub = ZERO

        user.hummusSwap = ZERO
        user.hummusLp = ZERO
    }
    return user;
}