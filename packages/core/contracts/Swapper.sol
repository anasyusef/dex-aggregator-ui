// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

import "./interfaces/IUniswapV2Pair.sol";
import "./libraries/UniswapV2Library.sol";
import "./libraries/Utils.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IWETH.sol";
import "./interfaces/IAdapter.sol";
import "./interfaces/ISwapper.sol";
import "./interfaces/IExecutor.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swapper is Ownable, ISwapper {
    using SafeERC20 for IERC20;

    event Received(address, uint256);
    event Swap(
        address indexed sender,
        address indexed recipient,
        address srcToken,
        address destToken,
        uint256 expectedAmount,
        uint256 receivedAmount,
        uint256 percent
    );

    IExecutor public executor;

    constructor(address _executor) {
        executor = IExecutor(_executor);
    }

    // Add the library methods
    // using EnumerableMap for EnumerableMap.UintToAddressMap;

    // Declare a set state variable
    mapping(uint256 => address) public adapters;

    enum SwapSide {
        BUY,
        SELL
    }

    struct SwapStep {
        uint256 adapterId;
        uint256 routerId;
        address[] path;
        uint256 percent;
        uint256 amountOut;
        uint256 deadline;
    }

    struct MultiSwapParams {
        address to;
        address srcToken;
        address destToken;
        uint256 amountIn;
        SwapStep[] swaps;
    }

    /**
    @notice Swap directly on a single DEX given a path. 100% of the swap goes through the given path
     */
    function simpleSwapExactInput(
        uint256 adapterId,
        uint256 routerId,
        uint256 amountIn,
        uint256 amountOut,
        address[] memory path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory) {
        require(adapters[adapterId] != address(0), "Adapter not registered");
        IAdapter adapter = IAdapter(adapters[adapterId]);
        address from;
        (path[0], from) = _wrapETH(amountIn, path[0]);
        if (from == address(this)) {
            assert(IERC20(Utils.WETH).approve(address(adapter), amountIn));
        }
        return
            adapter.swapExactInput(
                routerId,
                amountIn,
                amountOut,
                path,
                from,
                to,
                deadline
            );
    }

    function simpleSwapExactInputSingle(
        uint256 adapterId,
        uint256 routerId,
        uint256 amountIn,
        uint256 amountOut,
        address srcToken,
        address destToken,
        address to,
        uint256 deadline
    ) external payable returns (uint256) {
        require(adapters[adapterId] != address(0), "Adapter not registered");
        IAdapter adapter = IAdapter(adapters[adapterId]);
        address from;
        (srcToken, from) = _wrapETH(amountIn, srcToken);
        if (from == address(this)) {
            assert(IERC20(Utils.WETH).approve(address(adapter), amountIn));
        }
        return
            adapter.swapExactInputSingle(
                routerId,
                amountIn,
                amountOut,
                srcToken,
                destToken,
                from,
                to,
                deadline
            );
    }

    /// @notice Wraps ETH to WETH
    /// @dev Given a token the function will return the WETH address as the token output if the toke input is ETH
    /// @param tokenInput Address of the token input
    /// @param amountToWrap Amount of token input to wrap
    /// @return tokenOutput will be the same if token input is not WETH, and from address will be the msg.sender if the token input is not WETH
    function _wrapETH(uint256 amountToWrap, address tokenInput)
        internal
        returns (address tokenOutput, address from)
    {
        if (tokenInput == Utils.ETH) {
            require(msg.value > 0, "Value must be non-zero");
            require(msg.value == amountToWrap, "Value doesn't match");
            IWETH(Utils.WETH).deposit{value: msg.value}();
            tokenOutput = Utils.WETH;
            from = address(this);
        } else {
            tokenOutput = tokenInput;
            from = msg.sender;
        }
    }

    function simpleSwapExactOutput() external payable {
        // TODO
    }

    function multiSwapExactInput(MultiSwapParams memory params)
        external
        payable
    {
        require(params.srcToken != params.destToken, "src token == dest token");
        address from;
        address to = params.to;
        (params.srcToken, from) = _wrapETH(params.amountIn, params.srcToken);
        if (params.destToken == Utils.ETH) {
            to = address(this);
        }
        require(
            params.srcToken != Utils.ETH && msg.value > 0,
            "no value should be sent"
        );
        for (uint256 i = 0; i < params.swaps.length; i++) {
            SwapStep memory swapParams = params.swaps[i];
            uint256 swapParamsPathLength = swapParams.path.length;
            require(
                adapters[swapParams.adapterId] != address(0),
                "Adapter not registered"
            );
            console.log(
                "Path 0: %s | SrcToken: %s",
                swapParams.path[0],
                params.srcToken
            );
            require(
                swapParams.path[swapParamsPathLength - 1] == params.destToken,
                "destToken doesn't match"
            );

            // Add checkers on the percentage
            // require(swapParams.percent > 0 && swapParams.percent <= 100, "percent not valid");
            uint256 amountIn = (params.amountIn / 100) * swapParams.percent; // TODO - Fix percentage calculation
            console.log("Amount in: %s", amountIn);
            console.log("Minimum amount out: %s", swapParams.amountOut);
            console.log("From address: %s", from);
            // (swapParams.path[i], from) = _wrapETH(amountIn, swapParams.path[i]); // TODO - Only change to check for the first and last tokens
            // TODO - Check if ETH is only at the beginning or end, if it's in the middle path then very unlikely that will result in an optimal path
            IAdapter adapter = IAdapter(adapters[swapParams.adapterId]);
            uint256[] memory amounts = adapter.swapExactInput(
                swapParams.routerId,
                amountIn,
                swapParams.amountOut,
                swapParams.path,
                from,
                to,
                swapParams.deadline
            );
            console.log("Output amounts...");
            for (uint256 j = 0; j < amounts.length; j++) {
                console.log(amounts[i]);
            }
            console.log("Emitting event...");
            emit Swap(
                msg.sender,
                params.to,
                params.srcToken,
                params.destToken,
                swapParams.amountOut,
                amounts[amounts.length - 1],
                swapParams.percent
            );
        }
        if (params.destToken == Utils.ETH) {
            // TODO - Calculate Total ETH to send back
        }
    }

    function multiSwapExactOutput() external payable {
        // TODO
    }

    // function multiDexSwapExactInput() external payable {
    //     // TODO
    // }

    // function multiDexSwapExactOutput() external payable {
    //     // TODO
    // }

    /**
    @todo
     */
    struct BatchSwapStep {
        uint256 adapterId;
        uint256 routerId;
        address[] path;
    }

    struct BatchSwap {
        address srcToken;
        address destToken;
        uint256 amountIn;
        uint256 amountOutMin;
        address to;
        uint256 deadline;
        BatchSwapStep[] steps;
    }

    // function batchSwap() external payable {}

    // function swap(IExecutor.CallDescription[] calldata calls) external payable {
    //     executor.executeCalls{value: msg.value}(calls);
    // }

    function transferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 amount
    ) external override {
        token.safeTransferFrom(from, to, amount);
    }

    function setExecutor(address _newExecutor) external onlyOwner {
        executor = IExecutor(_newExecutor);
    }

    function registerAdapter(uint256 _adapterIdx, address _routerAddress)
        external
        onlyOwner
    {
        adapters[_adapterIdx] = _routerAddress;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
