pragma solidity ^0.8.0;

import "../interfaces/IAdapter.sol";
import "../interfaces/IUniswapV2Router02.sol";
import "../interfaces/IWETH.sol";
import "../libraries/Utils.sol";
import "../interfaces/ISwapper.sol";
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
    ) external payable returns (uint256[] memory amounts) {
        require(routers[routerId] != address(0), "Router not registered");
        bool fromETH = false;
        if (path[0] == Utils.ETH) {
            require(msg.value > 0, "Value must be non-zero");
            require(msg.value == amountIn, "Value doesn't match");
            fromETH = true;
            IWETH(Utils.WETH).deposit{value: msg.value}();
            path[0] = Utils.WETH;
        }
        IUniswapV2Router02 router = IUniswapV2Router02(routers[routerId]);
        IERC20 tokenToSell = IERC20(path[0]);
        if (!fromETH) {
            swapper.transferFrom(tokenToSell, from, address(this), amountIn);
        }
        assert(tokenToSell.approve(address(router), amountIn));

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
    ) external payable returns (uint256 amountSwapped) {
        require(routers[routerId] != address(0), "Router not registered");
        bool fromETH = false;

        IUniswapV2Router02 router = IUniswapV2Router02(routers[routerId]);

        if (srcToken == Utils.ETH) {
            require(msg.value > 0, "Value must be non-zero");
            require(msg.value == amountIn, "Value doesn't match");
            fromETH = true;
            IWETH(Utils.WETH).deposit{value: msg.value}();
            srcToken = Utils.WETH;
        }
        IERC20 tokenToSell = IERC20(srcToken);
        if (!fromETH) {
            swapper.transferFrom(tokenToSell, from, address(this), amountIn);
        }

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
