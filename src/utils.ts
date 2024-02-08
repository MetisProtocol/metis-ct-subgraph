import { BigInt, Value, ValueKind, ethereum } from "@graphprotocol/graph-ts";
import { System, User } from "./generated/schema";

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
    let sys = getOrCreateSystem()
    if(!user) {
        sys.usersCount = sys.usersCount.plus(ONE);
        sys.save()

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

        user.spins = ZERO
        user.spinPointsEarned = ZERO
        user.spinTokensEarned = ZERO
        user.spinsBought = ZERO
      
        user.adminPointsAdded = ZERO
        user.botClaims = ZERO

        user.enkiStakeEnki = ZERO
        user.enkiStakeEMetis = ZERO
        user.enkiStakeMetis = ZERO
    }
    return user;
}

export function getOrCreateSystem() : System {
    let sys = System.load("SYSTEM");
    
    if(!sys){
        sys = new System("SYSTEM");
        sys.usersCount = ZERO;
        sys.pointsEarned = ZERO;
        sys.actionCount = ZERO;
    
        sys.tokensDistributed = ZERO;
    
        sys.netswapSwap = ZERO
        sys.netswapLp = ZERO
      
        sys.tethysPerp = ZERO
        sys.tethysTLP = ZERO
        sys.tethysSwap = ZERO
    
        sys.midasLottery = ZERO
        sys.leagueBuy = ZERO
        sys.leagueSub = ZERO

        sys.hummusSwap = ZERO
        sys.hummusLp = ZERO

        sys.spins = ZERO
        sys.spinsBought = ZERO
        sys.adminPointsAdded = ZERO
        
        sys.latestBlock = ZERO

        sys.enkiStakeEnki = ZERO
        sys.enkiStakeEMetis = ZERO
        sys.enkiStakeMetis = ZERO
    }

    return sys;
}

export function updateSys(action: string, gain: BigInt, block: ethereum.Block): void{
    let sys = getOrCreateSystem()
    sys.actionCount = sys.actionCount.plus(ONE)
    sys.pointsEarned = sys.pointsEarned.plus(gain)
    sys.latestBlock = block.number

    let val = sys.get(action)
    if (!val || val.kind == ValueKind.NULL) {
        throw new Error("Cannot return null for a required field.");
    } else {
        sys.set(action, Value.fromBigInt(val.toBigInt().plus(ONE)));
    }
    sys.save()
}

// export function updateSys({
//     tokensDistributed,
//     netswapSwap,
//     netswapLp,
//     tethysPerp,
//     tethysTLP,
//     tethysSwap,
//     midasLottery,
//     leagueBuy,
//     leagueSub,
//     hummusSwap,
//     hummusLp,
// }: {
//     tokensDistributed? : BigInt,
//     netswapSwap? : BigInt,
//     netswapLp? : BigInt,
//     tethysPerp? : BigInt,
//     tethysTLP? : BigInt,
//     tethysSwap? : BigInt,
//     midasLottery? : BigInt,
//     leagueBuy? : BigInt,
//     leagueSub? : BigInt,
//     hummusSwap? : BigInt,
//     hummusLp? : BigInt,
// }): void {
//     let sys = getOrCreateSystem()
//     sys.actionCount = sys.actionCount.plus(ONE)

//     if(tokensDistributed){
//         sys.tokensDistributed = sys.tokensDistributed.plus(ONE)
//         sys.pointsEarned = sys.pointsEarned.plus(tokensDistributed)
//     } else if(netswapSwap){
//         sys.netswapSwap = sys.netswapSwap.plus(ONE)
//         sys.pointsEarned = sys.pointsEarned.plus(netswapSwap)
//     } else if(netswapLp){
//         sys.netswapLp = sys.netswapLp.plus(ONE)
//         sys.pointsEarned = sys.pointsEarned.plus(netswapLp)
//     } else if(tethysPerp){
//         sys.tethysPerp = sys.tethysPerp.plus(ONE)
//         sys.pointsEarned = sys.pointsEarned.plus(tethysPerp)
//     } else if(tethysTLP){
//         sys.tethysTLP = sys.tethysTLP.plus(ONE)
//         sys.pointsEarned = sys.pointsEarned.plus(tethysTLP)
//     } else if(tethysSwap){
//         sys.tethysSwap = sys.tethysSwap.plus(ONE)
//         sys.pointsEarned = sys.pointsEarned.plus(tethysSwap)
//     } else if(midasLottery){
//         sys.midasLottery = sys.midasLottery.plus(ONE)
//         sys.pointsEarned = sys.pointsEarned.plus(midasLottery)
//     } else if(leagueBuy){
//         sys.leagueBuy = sys.leagueBuy.plus(ONE)
//         sys.pointsEarned = sys.pointsEarned.plus(leagueBuy)
//     } else if(leagueSub){
//         sys.leagueSub = sys.leagueSub.plus(ONE)
//         sys.pointsEarned = sys.pointsEarned.plus(leagueSub)
//     } else if(hummusLp){
//         sys.hummusLp = sys.hummusLp.plus(ONE)
//         sys.pointsEarned = sys.pointsEarned.plus(hummusLp)
//     } else if(hummusSwap){
//         sys.hummusSwap = sys.hummusSwap.plus(ONE)
//         sys.pointsEarned = sys.pointsEarned.plus(hummusSwap)
//     }

//     sys.save()
// }