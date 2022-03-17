pragma solidity ^0.8.0;

interface IAdapter {
    function swap(
        uint256 routerId,
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable;
}
