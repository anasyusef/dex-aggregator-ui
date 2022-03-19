pragma solidity ^0.8.0;

import "../interfaces/IAdapter.sol";
import "../interfaces/IUniswapV2Router02.sol";
import "../interfaces/IWETH.sol";
import "../libraries/Utils.sol";
import "../interfaces/ISwapper.sol";
import "./AdapterStorage.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UniswapV2Adapter is AdapterStorage, IAdapter {
    event Received(address, uint256);

    ISwapper internal swapper;

    constructor(address swapContract) {
        swapper = ISwapper(swapContract);
    }

    function swap(
        uint256 routerId,
        uint256 amountIn,
        uint256 amountOut,
        address[] memory path,
        address from,
        address to,
        uint256 deadline
    ) external payable override {
        require(routers[routerId] != address(0), "Router not registered");
        bool fromETH = false;
        if (path[0] == Utils.ETH) {
            require(msg.value > 0, "Value must be non-zero");
            require(msg.value == amountIn, "Value doesn't match");
            fromETH = true;
            console.log("%s ETH sent. Wrapping into WETH", msg.value);
            IWETH(Utils.WETH).deposit{value: msg.value}();
            path[0] = Utils.WETH;
        }
        IUniswapV2Router02 router = IUniswapV2Router02(routers[routerId]);
        IERC20 tokenToSell = IERC20(path[0]);
        if (!fromETH) {
            swapper.transferFrom(tokenToSell, from, address(this), amountIn);
        }
        assert(tokenToSell.approve(address(router), amountIn));

        uint256[] memory amounts = router.swapExactTokensForTokens(
            amountIn,
            amountOut,
            path,
            to,
            deadline
        );
        console.log(amounts[0], amounts[1]);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
