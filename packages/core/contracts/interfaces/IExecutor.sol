pragma solidity ^0.8.0;

interface IExecutor {
    struct CallDescription {
        address targetAddress;
        bytes data;
    }
    function executeCalls(CallDescription[] memory data) external payable;
}