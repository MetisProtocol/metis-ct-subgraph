import { BigInt, store, log, Address } from "@graphprotocol/graph-ts";
import { TokensDistributed } from "./generated/TokensDistributed/TokenDistributor";
import { Pair, User } from "./generated/schema";
import { PairCreated } from "./generated/NetSwapNewLp/V2Factory";
import { Mint, Swap } from "./generated/NetSwapSwap/V2Pair";
import { Swap as TSwap, IncreasePosition } from "./generated/TethysPerp/TVault";
import { ONE, ZERO, pow } from "./utils";
import { AddLiquidity } from "./generated/TethysTLP/TLPManager";

const DIVIDOR = BigInt.fromI32(2)

export function handleTokensDistributed(event: TokensDistributed): void {
  let userAddress = event.params.user;
  let recipientId = event.params.id;

  let user = User.load(userAddress.toHexString());

  if(user){
    // User can't claim more than once, this might be a mistake
    return
  }

  if(!user) {
    user = new User(userAddress.toHexString());
    user.actionCount = ZERO
    user.dateJoined = BigInt.fromI64(Date.now());
    user.blockJoined = event.block.number;

    user.joinId = recipientId;
    user.score = ZERO;
    user.actionCount = ZERO;

    user.netswapSwap = ZERO
    user.netswapLp = ZERO
  
    user.tethysPerp = ZERO
    user.tethysTLP = ZERO
    user.tethysSwap = ZERO
  }

  // TODO: change here;
  user.score = user.score.plus(BigInt.fromI64(500));
  user.actionCount = user.actionCount.plus(BigInt.fromI64(1));

  user.save()
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

  let userAddress = event.params.sender.toHexString()
  let user = User.load(userAddress)

  if(!user) return

  let netswapSwapCnt = user.netswapLp;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, netswapSwapCnt))
  user.score = user.score.plus(gain)
  user.netswapSwap = user.netswapLp.plus(ONE)

  user.save()
}

export function handleNetswapLiquidity(event: Mint): void {
  let pairAddress = event.address.toHexString()
  let pair = Pair.load(pairAddress)

  if(!pair) return

  let userAddress = event.params.sender.toHexString()
  let user = User.load(userAddress)

  if(!user) return

  let netswapLpCnt = user.netswapSwap;
  let gain = BigInt.fromI64(500).div(pow(DIVIDOR, netswapLpCnt))
  user.score = user.score.plus(gain)
  user.netswapSwap = user.netswapSwap.plus(ONE)

  user.save()
}

export function handleTethysSwap(event: TSwap): void {
  let userAddress = event.params.account.toHexString()
  let user = User.load(userAddress)

  if(!user) return

  let tethysSwapCnt = user.tethysSwap;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, tethysSwapCnt))
  user.score = user.score.plus(gain)
  user.tethysSwap = user.tethysSwap.plus(ONE)

  user.save()
}

export function handleTethysPerp(event: IncreasePosition): void {
  let userAddress = event.params.account.toHexString()
  let user = User.load(userAddress)

  if(!user) return

  let tethysPerpCnt = user.tethysPerp;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, tethysPerpCnt))
  user.score = user.score.plus(gain)
  user.tethysPerp = user.tethysPerp.plus(ONE)

  user.save()
}

export function handleTethysTLP(event: AddLiquidity): void {
  let userAddress = event.params.account.toHexString()
  let user = User.load(userAddress)

  if(!user) return

  let tethysTLPCnt = user.tethysTLP;
  let gain = BigInt.fromI64(300).div(pow(DIVIDOR, tethysTLPCnt))
  user.score = user.score.plus(gain)
  user.tethysTLP = user.tethysTLP.plus(ONE)

  user.save()
}


// TODO: add more handlers

// export function handleERC20Approval(event: Approval): void {
//   let token = Token.load(event.address.toHex());
//   if (!token) {
//     token = new Token(event.address.toHex());

//     let callResult = ERC20.bind(event.address).try_symbol();
//     if (callResult.reverted) {
//       log.info("get token {} symbol reverted", [event.address.toHex()]);
//       token.symbol = "Unknown Token";
//     } else {
//       token.symbol = callResult.value;
//     }

//     token.type = "ERC20";
//     token.save();
//   }

//   const approveId = `ERC20Approve-${event.address.toHex()}-${event.params.owner}-${
//     event.params.spender
//   }`;

//   let approve = Approved.load(approveId);
//   if (event.params.value.equals(BigInt.fromU32(0))) {
//     if (approve) {
//       store.remove("Approved", approveId);
//     }
//     return;
//   }

//   if (!approve) {
//     approve = new Approved(approveId);
//     approve.token = token.id;
//     approve.owner = event.params.owner;
//     approve.spender = event.params.spender;
//     approve.IsAll = false;
//   }

//   approve.Amount = event.params.value;
//   approve.UpdatedAt = event.block.timestamp;
//   approve.save();
// }
