pragma solidity ^0.8.0;

import "./interfaces/IExecutor.sol";
import "hardhat/console.sol";

contract Executor is IExecutor  {

    function executeCalls(IExecutor.CallDescription[] memory calls) external override payable {
        require(calls.length > 0, "call length must be > 0");
        if (calls.length == 1) {
            console.log("Call length equal to 1");
            bytes memory data = calls[0].data;
            address targetAddress = calls[0].targetAddress; 
            (bool success, bytes memory returnData) = targetAddress.call(data);
            console.log("Success: %s ", success);
            console.logBytes(returnData);
            // console.log(data[0].targetAddress);

        }
    }
}