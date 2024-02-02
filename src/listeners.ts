import { BigInt } from "@graphprotocol/graph-ts";
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
import { AddPointsCall, AddPointsSingleCall, SpinsBought, WheelSpin } from "./generated/ScoreKeeper/ScoreKeeper";

const DIVIDOR = BigInt.fromI32(4)
const MULTIPLIER = BigInt.fromI32(3)

export function handleTokensDistributed(event: TokensDistributed): void {
  let userAddress = event.params.user.toHexString();
  let recipientId = event.params.id;

  let user = getOrCreateUser(userAddress, event.block);

  if(!user.joinId){
    user.joinId = recipientId;
    user.score = user.score.plus(BigInt.fromI64(500));
    user.actionCount = user.actionCount.plus(ONE);
  
    updateSys("tokensDistributed", BigInt.fromI64(500))
  
    user.save()
  }
}

export function handlePairCreated(event: PairCreated): void {
  let pairAddress = event.params.pair.toHexString();
  let pair = Pair.load(pairAddress);

  if(!pair) {
    pair = new Pair(pairAddress);
    pair.factory = event.address;
  }

  pair.save()
}

export function handleNetswapSwap(event: Swap): void {
  let pairAddress = event.address.toHexString()
  let pair = Pair.load(pairAddress)

  if(!pair) return

  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let netswapSwapCnt = user.netswapSwap;
  let gain = BigInt.fromI64(300).times(pow(MULTIPLIER, netswapSwapCnt)).div(pow(DIVIDOR, netswapSwapCnt))
  user.score = user.score.plus(gain)
  user.netswapSwap = user.netswapSwap.plus(ONE)
    
  updateSys("netswapSwap", gain)

  user.save()
}

export function handleNetswapLiquidity(event: Mint): void {
  let pairAddress = event.address.toHexString()
  let pair = Pair.load(pairAddress)

  if(!pair) return

  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let netswapLpCnt = user.netswapLp;
  let gain = BigInt.fromI64(500).times(pow(MULTIPLIER, netswapLpCnt)).div(pow(DIVIDOR, netswapLpCnt))
  user.score = user.score.plus(gain)
  user.netswapLp = user.netswapLp.plus(ONE)

  updateSys("netswapLp", gain)

  user.save()
}

export function handleTethysSwap(event: TSwap): void {
  let userAddress = event.params.account.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let tethysSwapCnt = user.tethysSwap;
  let gain = BigInt.fromI64(300).times(pow(MULTIPLIER, tethysSwapCnt)).div(pow(DIVIDOR, tethysSwapCnt))
  user.score = user.score.plus(gain)
  user.tethysSwap = user.tethysSwap.plus(ONE)
  
  updateSys("tethysSwap", gain)

  user.save()
}

export function handleTethysPerp(event: IncreasePosition): void {
  let userAddress = event.params.account.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let tethysPerpCnt = user.tethysPerp;
  let gain = BigInt.fromI64(400).times(pow(MULTIPLIER, tethysPerpCnt)).div(pow(DIVIDOR, tethysPerpCnt))
  user.score = user.score.plus(gain)
  user.tethysPerp = user.tethysPerp.plus(ONE)

  updateSys("tethysPerp", gain)

  user.save()
}

export function handleTethysTLP(event: AddLiquidity): void {
  let userAddress = event.params.account.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let tethysTLPCnt = user.tethysTLP;
  let gain = BigInt.fromI64(500).times(pow(MULTIPLIER, tethysTLPCnt)).div(pow(DIVIDOR, tethysTLPCnt))
  user.score = user.score.plus(gain)
  user.tethysTLP = user.tethysTLP.plus(ONE)

  updateSys("tethysTLP", gain)

  user.save()
}

export function handleLottery(event: TicketsPurchase): void {
  let userAddress = event.params.buyer.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let lotterCnt = user.midasLottery;
  let gain = BigInt.fromI64(1000).times(pow(MULTIPLIER, lotterCnt)).div(pow(DIVIDOR, lotterCnt))
  user.score = user.score.plus(gain)
  user.midasLottery = user.midasLottery.plus(ONE)
  
  updateSys("midasLottery", gain)

  user.save()
}

export function handleSub(event: Subscription): void {
  let userAddress = event.params.user.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let leagueSubs = user.leagueSub;
  let gain = BigInt.fromI64(1000).times(pow(MULTIPLIER, leagueSubs)).div(pow(DIVIDOR, leagueSubs))
  user.score = user.score.plus(gain)
  user.leagueSub = user.leagueSub.plus(ONE)

  updateSys("leagueSub", gain)

  user.save()
}

export function handleBuy(event: Trade): void {
  let userAddress = event.params.trader.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let leagueBuys = user.leagueBuy;
  let gain = BigInt.fromI64(1000).times(pow(MULTIPLIER, leagueBuys)).div(pow(DIVIDOR, leagueBuys))
  user.score = user.score.plus(gain)
  user.leagueBuy = user.leagueBuy.plus(ONE)
  updateSys("leagueBuy", gain)

  user.save()
}
// TODO: add hummus
export function handleHummusSwap(event: SwapHummusPool): void {
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let humSwaps = user.hummusSwap;
  let gain = BigInt.fromI64(300).times(pow(MULTIPLIER, humSwaps)).div(pow(DIVIDOR, humSwaps))
  user.score = user.score.plus(gain)
  user.hummusSwap = user.hummusSwap.plus(ONE)
  updateSys("hummusSwap", gain)

  user.save()
}
export function handleHummusLp(event: Deposit): void {
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let hummusLp = user.hummusLp;
  let gain = BigInt.fromI64(500).times(pow(MULTIPLIER, hummusLp)).div(pow(DIVIDOR, hummusLp))
  user.score = user.score.plus(gain)
  user.hummusLp = user.hummusLp.plus(ONE)
  updateSys("hummusLp", gain)

  user.save()
}
export function handleHummusVaultSwap(event: SwapHummusVault): void {
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let humSwaps = user.hummusSwap;
  let gain = BigInt.fromI64(300).times(pow(MULTIPLIER, humSwaps)).div(pow(DIVIDOR, humSwaps))
  user.score = user.score.plus(gain)
  user.hummusSwap = user.hummusSwap.plus(ONE)
  updateSys("hummusSwap", gain)

  user.save()
}
export function handleHummusVaultLp(event: PoolBalanceChanged): void {
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let hummusLp = user.hummusLp;
  let gain = BigInt.fromI64(500).times(pow(MULTIPLIER, hummusLp)).div(pow(DIVIDOR, hummusLp))
  user.score = user.score.plus(gain)
  user.hummusLp = user.hummusLp.plus(ONE)
  updateSys("hummusLp", gain)

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
  updateSys("spins", points)

  user.save()
}

export function handleBoughtSpins(event: SpinsBought): void {
  let userAddress = event.params.user.toHexString();
  let user = getOrCreateUser(userAddress, event.block)

  let spinsBought = user.spinsBought;
  let gain = BigInt.fromI64(500).times(pow(MULTIPLIER, spinsBought)).div(pow(DIVIDOR, spinsBought))
  user.score = user.score.plus(gain)
  user.spinsBought = user.spinsBought.plus(ONE)
  updateSys("spinsBought", gain)

  user.save()
}

export function handleAddManyPoints(call: AddPointsCall): void {
  let addresses = call.inputs.addresses
  let points = call.inputs.points

  for(let i = 0 ; i<addresses.length ; i++) {
    let userAddress = addresses[i].toHexString()
    let user = getOrCreateUser(userAddress, call.block)
    user.score = user.score.plus(points[i])
    user.adminPointsAdded = user.adminPointsAdded.plus(points[i])
    updateSys("adminPointsAdded", points[i])

    user.save()
  }
}

export function handleAddPoints(call: AddPointsSingleCall): void {
  let addresses = call.inputs.addresses
  let points = call.inputs.points

  for(let i = 0 ; i<addresses.length ; i++) {
    let userAddress = addresses[i].toHexString()
    let user = getOrCreateUser(userAddress, call.block)
    user.score = user.score.plus(points)
    user.adminPointsAdded = user.adminPointsAdded.plus(points)
    updateSys("adminPointsAdded", points)

    user.save()
  }
}