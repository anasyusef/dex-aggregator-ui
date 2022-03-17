pragma solidity ^0.8.0;

import "../interfaces/IAdapter.sol";
import "../interfaces/IUniswapV2Router02.sol";
import "../interfaces/IWETH.sol";
import "../libraries/Utils.sol";
import "./AdapterStorage.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UniswapV2Adapter is AdapterStorage, IAdapter {

    event Received(address, uint256);

    function swap(
        uint256 routerId,
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable override {
        require(routers[routerId] != address(0), "Router not registered");
        IUniswapV2Router02 router = IUniswapV2Router02(routers[routerId]);

        // Wrapping ETH to WETH and swap tokens
        if (path[0] == Utils.WETH && msg.value > 0) {
            // require(msg.value > 0, "Value must be non-zero");
            console.log("%s ETH sent. Wrapping into WETH", msg.value);
            IWETH(Utils.WETH).deposit{value: msg.value}();
            assert(IERC20(Utils.WETH).approve(address(router), amountIn));
            console.log("WETH approved. Swapping tokens...");
            uint256[] memory amounts = router.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                to,
                deadline
            );

            console.log(amounts[0], amounts[1]);
        }
        // Here, there is no ETH, so use tokensforTokens
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
