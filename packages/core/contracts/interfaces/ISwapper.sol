pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../libraries/Utils.sol";

interface ISwapper {
    // function singleSwap(
    //     uint256 adapterId,
    //     uint256 routerId,
    //     uint256 amountIn,
    //     uint256 amountOutMin,
    //     address[] calldata path,
    //     address to,
    //     uint256 deadline
    // ) external payable;

    // function swap(bytes[] calldata calls) external payable;

    function transferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 amount
    ) external;
}
