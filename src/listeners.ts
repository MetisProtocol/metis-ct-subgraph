import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { TokensDistributed } from "./generated/TokensDistributed/TokenDistributor";
import { Pair } from "./generated/schema";
import { PairCreated } from "./generated/NetSwapNewLp/V2Factory";
import { Mint, Swap } from "./generated/NetSwapSwap/V2Pair";
import { Swap as TSwap, IncreasePosition } from "./generated/TethysPerp/TVault";
import { ONE, getOrCreateUser, pow, updateSys } from "./utils";
import { AddLiquidity } from "./generated/TethysTLP/TLPManager";
import { TicketsPurchase } from "./generated/Midas/Midas";
import { Subscription, Trade } from "./generated/LeagueTech/LeagueTech";
import { Swap as SwapHummusVault, PoolBalanceChanged } from "./generated/HummusVault/HummusVault";
import { Swap as SwapHummusPool, Deposit } from "./generated/Hummus/HummusPool";
import { SpinsBought, WheelSpin } from "./generated/ScoreKeeper/ScoreKeeper";
import { Transfer } from "./generated/eMetisMint/ERC20";

const DIVIDOR = BigInt.fromI32(4)
const MULTIPLIER = BigInt.fromI32(3)

export function isSeason1Over(event: ethereum.Event): boolean {
  return event.block.number.gt(BigInt.fromI64(5200000))
}

export function handleTokensDistributed(event: TokensDistributed): void {
  // if(isSeason1Over(event)){
  //   return
  // }
  let userAddress = event.params.user.toHexString();
  let recipientId = event.params.id;

  let user = getOrCreateUser(userAddress, event.block);

  user.botClaims = user.botClaims.plus(ONE)
  if(!user.joinId){
    user.joinId = recipientId;
    user.score = user.score.plus(BigInt.fromI64(500));
    user.actionCount = user.actionCount.plus(ONE);
  
    updateSys("tokensDistributed", BigInt.fromI64(500), event.block)
    user.save()
  }
}

export function handlePairCreated(event: PairCreated): void {
  if(isSeason1Over(event)){
    return
  }
  let pairAddress = event.params.pair.toHexString();
  let pair = Pair.load(pairAddress);

  if(!pair) {
    pair = new Pair(pairAddress);
    pair.factory = event.address;
  }

  pair.save()
}

export function handleNetswapSwap(event: Swap): void {
  if(isSeason1Over(event)){
    return
  }
  let pairAddress = event.address.toHexString()
  let pair = Pair.load(pairAddress)

  if(!pair) return

  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let netswapSwapCnt = user.netswapSwap;
  let gain = BigInt.fromI64(300).times(pow(MULTIPLIER, netswapSwapCnt)).div(pow(DIVIDOR, netswapSwapCnt))
  user.score = user.score.plus(gain)
  user.netswapSwap = user.netswapSwap.plus(ONE)
    
  updateSys("netswapSwap", gain, event.block)

  user.save()
}

export function handleNetswapLiquidity(event: Mint): void {
  if(isSeason1Over(event)){
    return
  }
  let pairAddress = event.address.toHexString()
  let pair = Pair.load(pairAddress)

  if(!pair) return

  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let netswapLpCnt = user.netswapLp;
  let gain = BigInt.fromI64(500).times(pow(MULTIPLIER, netswapLpCnt)).div(pow(DIVIDOR, netswapLpCnt))
  user.score = user.score.plus(gain)
  user.netswapLp = user.netswapLp.plus(ONE)

  updateSys("netswapLp", gain, event.block)

  user.save()
}

export function handleTethysSwap(event: TSwap): void {
  if(isSeason1Over(event)){
    return
  }
  let userAddress = event.params.account.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let tethysSwapCnt = user.tethysSwap;
  let gain = BigInt.fromI64(300).times(pow(MULTIPLIER, tethysSwapCnt)).div(pow(DIVIDOR, tethysSwapCnt))
  user.score = user.score.plus(gain)
  user.tethysSwap = user.tethysSwap.plus(ONE)
  
  updateSys("tethysSwap", gain, event.block)

  user.save()
}

export function handleTethysPerp(event: IncreasePosition): void {
  if(isSeason1Over(event)){
    return
  }
  let userAddress = event.params.account.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let tethysPerpCnt = user.tethysPerp;
  let gain = BigInt.fromI64(400).times(pow(MULTIPLIER, tethysPerpCnt)).div(pow(DIVIDOR, tethysPerpCnt))
  user.score = user.score.plus(gain)
  user.tethysPerp = user.tethysPerp.plus(ONE)

  updateSys("tethysPerp", gain, event.block)

  user.save()
}

export function handleTethysTLP(event: AddLiquidity): void {
  if(isSeason1Over(event)){
    return
  }
  let userAddress = event.params.account.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let tethysTLPCnt = user.tethysTLP;
  let gain = BigInt.fromI64(500).times(pow(MULTIPLIER, tethysTLPCnt)).div(pow(DIVIDOR, tethysTLPCnt))
  user.score = user.score.plus(gain)
  user.tethysTLP = user.tethysTLP.plus(ONE)

  updateSys("tethysTLP", gain, event.block)

  user.save()
}

export function handleLottery(event: TicketsPurchase): void {
  if(isSeason1Over(event)){
    return
  }
  let userAddress = event.params.buyer.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let lotterCnt = user.midasLottery;
  let gain = BigInt.fromI64(1000).times(pow(MULTIPLIER, lotterCnt)).div(pow(DIVIDOR, lotterCnt))
  user.score = user.score.plus(gain)
  user.midasLottery = user.midasLottery.plus(ONE)
  
  updateSys("midasLottery", gain, event.block)

  user.save()
}

export function handleSub(event: Subscription): void {
  if(isSeason1Over(event)){
    return
  }
  let userAddress = event.params.user.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let leagueSubs = user.leagueSub;
  let gain = BigInt.fromI64(1000).times(pow(MULTIPLIER, leagueSubs)).div(pow(DIVIDOR, leagueSubs))
  user.score = user.score.plus(gain)
  user.leagueSub = user.leagueSub.plus(ONE)

  updateSys("leagueSub", gain, event.block)

  user.save()
}

export function handleBuy(event: Trade): void {
  if(isSeason1Over(event)){
    return
  }
  let userAddress = event.params.trader.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let leagueBuys = user.leagueBuy;
  let gain = BigInt.fromI64(1000).times(pow(MULTIPLIER, leagueBuys)).div(pow(DIVIDOR, leagueBuys))
  user.score = user.score.plus(gain)
  user.leagueBuy = user.leagueBuy.plus(ONE)
  updateSys("leagueBuy", gain, event.block)

  user.save()
}
// TODO: add hummus
export function handleHummusSwap(event: SwapHummusPool): void {
  if(isSeason1Over(event)){
    return
  }
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let humSwaps = user.hummusSwap;
  let gain = BigInt.fromI64(300).times(pow(MULTIPLIER, humSwaps)).div(pow(DIVIDOR, humSwaps))
  user.score = user.score.plus(gain)
  user.hummusSwap = user.hummusSwap.plus(ONE)
  updateSys("hummusSwap", gain, event.block)

  user.save()
}
export function handleHummusLp(event: Deposit): void {
  if(isSeason1Over(event)){
    return
  }
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let hummusLp = user.hummusLp;
  let gain = BigInt.fromI64(500).times(pow(MULTIPLIER, hummusLp)).div(pow(DIVIDOR, hummusLp))
  user.score = user.score.plus(gain)
  user.hummusLp = user.hummusLp.plus(ONE)
  updateSys("hummusLp", gain, event.block)

  user.save()
}
export function handleHummusVaultSwap(event: SwapHummusVault): void {
  if(isSeason1Over(event)){
    return
  }
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let humSwaps = user.hummusSwap;
  let gain = BigInt.fromI64(300).times(pow(MULTIPLIER, humSwaps)).div(pow(DIVIDOR, humSwaps))
  user.score = user.score.plus(gain)
  user.hummusSwap = user.hummusSwap.plus(ONE)
  updateSys("hummusSwap", gain, event.block)

  user.save()
}
export function handleHummusVaultLp(event: PoolBalanceChanged): void {
  if(isSeason1Over(event)){
    return
  }
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let hummusLp = user.hummusLp;
  let gain = BigInt.fromI64(500).times(pow(MULTIPLIER, hummusLp)).div(pow(DIVIDOR, hummusLp))
  user.score = user.score.plus(gain)
  user.hummusLp = user.hummusLp.plus(ONE)
  updateSys("hummusLp", gain, event.block)

  user.save()
}

export function handleWheelSpin(event: WheelSpin): void {
  let userAddress = event.params.user.toHexString()
  
  let points = event.params.pointsAdded
  let tokens = event.params.tokensAdded

  let user = getOrCreateUser(userAddress, event.block)

  user.score = user.score.plus(points)
  user.spinPointsEarned = user.spinPointsEarned.plus(points)
  user.spinTokensEarned = user.spinTokensEarned.plus(tokens)

  user.spins = user.spins.plus(ONE)
  updateSys("spins", points, event.block)

  user.save()
}

export function handleBoughtSpins(event: SpinsBought): void {
  let numSpins = event.params.numSpins;
  let userAddress = event.params.user.toHexString();
  let user = getOrCreateUser(userAddress, event.block)

  let spinsBought = user.spinsBought;
  let gain = BigInt.fromI64(100).times(pow(MULTIPLIER, spinsBought)).div(pow(DIVIDOR, spinsBought)).times(numSpins)
  user.score = user.score.plus(gain)
  user.spinsBought = user.spinsBought.plus(ONE)
  updateSys("spinsBought", gain, event.block)

  user.save()
}

export function handleEMetisMint(event: Transfer): void {
  if (!event.params.from.equals(Address.zero())) {
      // only for mint
      return;
  }

  if (event.params.to.equals(Address.fromHexString("0x8b12371D74dE67dFA787CEeaF84b3BE85D199a01")) || event.params.to.equals(Address.fromHexString("0x254FD55eDf6ec7dD093Ce042a52dE367EEC3187B"))) {
      // exclude internal transfer
      return;
  }

  let userAddress = event.params.to.toHexString();
  let user = getOrCreateUser(userAddress, event.block)

  let enkiStakeMetis = user.enkiStakeMetis;
  let gain = BigInt.fromI64(1500).times(pow(MULTIPLIER, enkiStakeMetis)).div(pow(DIVIDOR, enkiStakeMetis))
  user.score = user.score.plus(gain)
  user.enkiStakeMetis = user.enkiStakeMetis.plus(ONE)
  updateSys("enkiStakeMetis", gain, event.block)

  user.save()
}

export function handleSeMetisMint(event: Transfer): void {
  if (!event.params.from.equals(Address.zero())) {
      // only for mint
      return;
  }

  let userAddress = event.params.to.toHexString();
  let user = getOrCreateUser(userAddress, event.block)

  let enkiStakeEMetis = user.enkiStakeEMetis;
  let gain = BigInt.fromI64(1500).times(pow(MULTIPLIER, enkiStakeEMetis)).div(pow(DIVIDOR, enkiStakeEMetis))
  user.score = user.score.plus(gain)
  user.enkiStakeEMetis = user.enkiStakeEMetis.plus(ONE)
  updateSys("enkiStakeEMetis", gain, event.block)

  user.save()
}

export function handleEnkiStaked(event: SpinsBought): void {
  let userAddress = event.params.user.toHexString();
  let user = getOrCreateUser(userAddress, event.block)

  let enkiStakeEnki = user.enkiStakeEnki;
  let gain = BigInt.fromI64(1500).times(pow(MULTIPLIER, enkiStakeEnki)).div(pow(DIVIDOR, enkiStakeEnki))
  user.score = user.score.plus(gain)
  user.enkiStakeEnki = user.enkiStakeEnki.plus(ONE)
  updateSys("enkiStakeEnki", gain, event.block)

  user.save()
}

// export function handleDrip(event: Transfer): void {
//   if (!event.transaction.from.equals(Address.fromHexString("0x57B62267BFe3B6Ae09BD49c292e87E8364d8036F"))) {
//       return;
//   }

//   let businessId: string;
//   if (event.address == Address.fromHexString("0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000")) {
//       businessId = "metisDrip";
//   } else if (event.address == Address.fromHexString("0xa32d8902891B665939c1534283f1Bb7d9D283793")) {
//       businessId = "enkiDrip";
//   } else {
//       return;
//   }

//   const stat = loadStat(businessId);
//   stat.txCount = stat.txCount.plus(BigInt.fromI32(1));
//   stat.totalAmount = stat.totalAmount.plus(event.params.value);
//   countAddress(stat, event.params.to);
//   stat.save();
// }


// export function handleAddManyPoints(call: AddPointsCall): void {
//   let addresses = call.inputs.addresses
//   let points = call.inputs.points

//   for(let i = 0 ; i<addresses.length ; i++) {
//     let userAddress = addresses[i].toHexString()
//     let user = getOrCreateUser(userAddress, call.block)
//     user.score = user.score.plus(points[i])
//     user.adminPointsAdded = user.adminPointsAdded.plus(points[i])
//     updateSys("adminPointsAdded", points[i])

//     user.save()
//   }
// }

// export function handleAddPoints(call: AddPointsSingleCall): void {
//   let addresses = call.inputs.addresses
//   let points = call.inputs.points

//   for(let i = 0 ; i<addresses.length ; i++) {
//     let userAddress = addresses[i].toHexString()
//     let user = getOrCreateUser(userAddress, call.block)
//     user.score = user.score.plus(points)
//     user.adminPointsAdded = user.adminPointsAdded.plus(points)
//     updateSys("adminPointsAdded", points, )

//     user.save()
//   }
// }