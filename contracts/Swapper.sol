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

    struct Swap {
        uint256 adapterId;
        uint256 routerId;
        address[] path;
        uint256 percent;
        uint256 amountOut;
        uint256 deadline;
    }

    struct MultiSwapParams {
        address to;
        uint256 amountIn;
        Swap[] swaps;
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
        for (uint256 i = 0; i < params.swaps.length; i++) {
            Swap memory swapParams = params.swaps[i];
            require(
                adapters[swapParams.adapterId] != address(0),
                "Adapter not registered"
            );
            IAdapter adapter = IAdapter(adapters[swapParams.adapterId]);
            uint256 amountIn = params.amountIn * swapParams.percent;
            adapter.swapExactInput(
                swapParams.routerId,
                amountIn,
                swapParams.amountOut,
                swapParams.path,
                from, // TODO fix from as it depends on the token
                params.to
                swapParams.deadline
            );
        }
    }

    function multiSwapExactOutput() external payable {
        // TODO
    }

    function multiDexSwapExactInput() external payable {
        // TODO
    }

    function multiDexSwapExactOutput() external payable {
        // TODO
    }

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

    function batchSwap() external payable {}

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
