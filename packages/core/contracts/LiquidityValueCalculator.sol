//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./interfaces/ILiquidityValueCalculator.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./libraries/UniswapV2Library.sol";

contract LiquidityValueCalculator is ILiquidityValueCalculator {
    address public factory;

    constructor(address _factory) {
        factory = _factory;
    }

    function pairInfo(address tokenA, address tokenB)
        internal
        view
        returns (
            uint256 reserveA,
            uint256 reserveB,
            uint256 totalSupply
        )
    {
        IUniswapV2Pair pair = IUniswapV2Pair(
            UniswapV2Library.pairFor(factory, tokenA, tokenB)
        );
        totalSupply = pair.totalSupply();
        (uint256 reserves0, uint256 reserves1, ) = pair.getReserves();
        (reserveA, reserveB) = tokenA == pair.token0()
            ? (reserves0, reserves1)
            : (reserves1, reserves0);
    }

    function computeLiquidityShareValue(
        uint256 liquidity,
        address tokenA,
        address tokenB
    )
        external
        view
        override
        returns (uint256 tokenAAmount, uint256 tokenBAmount)
    {
        (uint256 reservesA, uint256 reservesB, uint256 totalSupply) = pairInfo(
            tokenA,
            tokenB
        );
        console.log(
            "Reserves A: %s; Reserves B: %s; Total Supply: %s",
            reservesA,
            reservesB,
            totalSupply
        );
        uint256 x = liquidity > totalSupply
            ? (liquidity / totalSupply)
            : (totalSupply / liquidity);
        tokenAAmount = reservesA / x;
        tokenBAmount = reservesB / x;
    }
}
