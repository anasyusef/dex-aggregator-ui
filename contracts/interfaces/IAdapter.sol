pragma solidity ^0.8.0;

import "../libraries/Utils.sol";

interface IAdapter {
    function swap(
        uint256 routerId,
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address from,
        address to,
        uint256 deadline
    ) external payable;
}
