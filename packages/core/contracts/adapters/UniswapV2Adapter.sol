// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

import "../interfaces/IAdapter.sol";
import "../interfaces/IUniswapV2Router02.sol";
import "../interfaces/IWETH.sol";
import "../libraries/Utils.sol";
import "../interfaces/ISwapper.sol";
// import "../libraries/UniswapV2Library.sol";
import "./AdapterStorage.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UniswapV2Adapter is AdapterStorage {
    event Received(address, uint256);

    ISwapper internal swapper;

    constructor(address swapContract) {
        swapper = ISwapper(swapContract);
    }

    function swapExactInput(
        uint256 routerId,
        uint256 amountIn,
        uint256 amountOut,
        address[] memory path,
        address from,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {
        require(routers[routerId] != address(0), "Router not registered");
        IUniswapV2Router02 router = IUniswapV2Router02(routers[routerId]);
        IERC20 tokenToSell = IERC20(path[0]);
        console.log(
            "TokentoSell: %s ; amountIn: %s",
            address(tokenToSell),
            amountIn
        );
        swapper.transferFrom(tokenToSell, from, address(this), amountIn);
        assert(tokenToSell.approve(address(router), amountIn));

        uint256 balance = tokenToSell.balanceOf(address(this));
        console.log("Balance of this contract WETH: %s", balance);

        for (uint256 index = 0; index < path.length; index++) {
            console.log("Token address: %s", path[index]);
        }

        // uint256[] memory amountsTest = UniswapV2Library.getAmountsOut(
        //     router.factory(),
        //     amountIn,
        //     path
        // );

        // console.log(
        //     "Last amount from getAmountsOut: %s",
        //     amountsTest[amountsTest.length - 1]
        // );
        // console.log("AmountOutMin: %s", amountOut);

        amounts = router.swapExactTokensForTokens(
            amountIn,
            amountOut,
            path,
            to,
            deadline
        );
    }

    function swapExactOutput() external payable {
        // TODO
    }

    function swapExactInputSingle(
        uint256 routerId,
        uint256 amountIn,
        uint256 amountOut,
        address srcToken,
        address destToken,
        address from,
        address to,
        uint256 deadline
    ) external returns (uint256 amountSwapped) {
        require(routers[routerId] != address(0), "Router not registered");
        IUniswapV2Router02 router = IUniswapV2Router02(routers[routerId]);
        IERC20 tokenToSell = IERC20(srcToken);
        swapper.transferFrom(tokenToSell, from, address(this), amountIn);

        address[] memory path = new address[](2);
        path[0] = address(srcToken);
        path[1] = address(destToken);
        assert(tokenToSell.approve(address(router), amountIn));

        amountSwapped = router.swapExactTokensForTokens(
            amountIn,
            amountOut,
            path,
            to,
            deadline
        )[1];
    }

    function swapExactOutputSingle() external payable {
        // TODO
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
