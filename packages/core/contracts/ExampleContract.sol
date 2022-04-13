pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ExampleContract {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {
        console.log("Msg sender: %s", msg.sender);
        amounts[0] = 0;
        amounts[1] = 1;
    }
}
