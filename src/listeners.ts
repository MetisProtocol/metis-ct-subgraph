import { BigInt, store, log, Address } from "@graphprotocol/graph-ts";
import { TokensDistributed } from "./generated/TokensDistributed/TokenDistributor";
import { Pair, User } from "./generated/schema";
import { PairCreated } from "./generated/NetSwapNewLp/V2Factory";
import { Mint, Swap } from "./generated/NetSwapSwap/V2Pair";
import { Swap as TSwap, IncreasePosition } from "./generated/TethysPerp/TVault";
import { ONE, ZERO, getOrCreateUser, pow } from "./utils";
import { AddLiquidity } from "./generated/TethysTLP/TLPManager";
import { TicketsPurchase } from "./generated/Midas/Midas";
import { Subscription, Trade } from "./generated/LeagueTech/LeagueTech";
import { Swap as SwapHummusVault, PoolBalanceChanged } from "./generated/HummusVault/HummusVault";
import { Swap as SwapHummusPool, Deposit } from "./generated/Hummus/HummusPool";

const DIVIDOR = BigInt.fromI32(2)

export function handleTokensDistributed(event: TokensDistributed): void {
  let userAddress = event.params.user.toHexString();
  let recipientId = event.params.id;

  let user = getOrCreateUser(userAddress, event.block);

  if(!user.joinId){
    user.joinId = recipientId;
    user.score = user.score.plus(BigInt.fromI64(500));
    user.actionCount = user.actionCount.plus(BigInt.fromI64(1));
  
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
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, netswapSwapCnt))
  user.score = user.score.plus(gain)
  user.netswapSwap = user.netswapSwap.plus(ONE)

  user.save()
}

export function handleNetswapLiquidity(event: Mint): void {
  let pairAddress = event.address.toHexString()
  let pair = Pair.load(pairAddress)

  if(!pair) return

  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let netswapLpCnt = user.netswapLp;
  let gain = BigInt.fromI64(500).div(pow(DIVIDOR, netswapLpCnt))
  user.score = user.score.plus(gain)
  user.netswapLp = user.netswapLp.plus(ONE)

  user.save()
}

export function handleTethysSwap(event: TSwap): void {
  let userAddress = event.params.account.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let tethysSwapCnt = user.tethysSwap;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, tethysSwapCnt))
  user.score = user.score.plus(gain)
  user.tethysSwap = user.tethysSwap.plus(ONE)

  user.save()
}

export function handleTethysPerp(event: IncreasePosition): void {
  let userAddress = event.params.account.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let tethysPerpCnt = user.tethysPerp;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, tethysPerpCnt))
  user.score = user.score.plus(gain)
  user.tethysPerp = user.tethysPerp.plus(ONE)

  user.save()
}

export function handleTethysTLP(event: AddLiquidity): void {
  let userAddress = event.params.account.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let tethysTLPCnt = user.tethysTLP;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, tethysTLPCnt))
  user.score = user.score.plus(gain)
  user.tethysTLP = user.tethysTLP.plus(ONE)

  user.save()
}

export function handleLottery(event: TicketsPurchase): void {
  let userAddress = event.params.buyer.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let lotterCnt = user.midasLottery;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, lotterCnt))
  user.score = user.score.plus(gain)
  user.midasLottery = user.midasLottery.plus(ONE)

  user.save()
}

export function handleSub(event: Subscription): void {
  let userAddress = event.params.user.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let leagueSubs = user.leagueSub;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, leagueSubs))
  user.score = user.score.plus(gain)
  user.leagueSub = user.leagueSub.plus(ONE)

  user.save()
}

export function handleBuy(event: Trade): void {
  let userAddress = event.params.trader.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let leagueBuys = user.leagueBuy;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, leagueBuys))
  user.score = user.score.plus(gain)
  user.leagueBuy = user.leagueBuy.plus(ONE)

  user.save()
}
// TODO: add hummus
export function handleHummusSwap(event: SwapHummusPool): void {
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let leagueBuys = user.leagueBuy;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, leagueBuys))
  user.score = user.score.plus(gain)
  user.leagueBuy = user.leagueBuy.plus(ONE)

  user.save()
}
export function handleHummusLp(event: Deposit): void {
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let leagueBuys = user.leagueBuy;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, leagueBuys))
  user.score = user.score.plus(gain)
  user.leagueBuy = user.leagueBuy.plus(ONE)

  user.save()
}
export function handleHummusVaultSwap(event: SwapHummusVault): void {
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let leagueBuys = user.leagueBuy;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, leagueBuys))
  user.score = user.score.plus(gain)
  user.leagueBuy = user.leagueBuy.plus(ONE)

  user.save()
}
export function handleHummusVaultLp(event: PoolBalanceChanged): void {
  let userAddress = event.transaction.from.toHexString()
  let user = getOrCreateUser(userAddress, event.block)

  let leagueBuys = user.leagueBuy;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, leagueBuys))
  user.score = user.score.plus(gain)
  user.leagueBuy = user.leagueBuy.plus(ONE)

  user.save()
}