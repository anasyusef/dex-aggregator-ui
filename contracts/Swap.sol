pragma solidity ^0.8.0;

import "./interfaces/IUniswapV2Pair.sol";
import "./libraries/UniswapV2Library.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract Swap {
    event Received(address, uint256);
    IUniswapV2Router02 public immutable router;

    constructor(address _router) {
        router = IUniswapV2Router02(_router);
    }

    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _to
    ) external {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenIn).approve(address(router), _amountIn);

        address[] memory path;

        if (_tokenIn == router.WETH() || _tokenOut == router.WETH()) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        } else {
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = router.WETH();
            path[2] = _tokenOut;
        }

        router.swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            _to,
            block.timestamp
        );
    }

    function swapETHForExactTokens(
        address _tokenOut,
        uint256 _amountOutMin,
        address _to
    ) external payable returns (uint256[] memory amounts) {
        // amountOutMin must be retrieved from an oracle of some kind
        // console.log(_tokenOut, _amountOutMin, _to, msg.value);
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = _tokenOut;
        console.log(_amountOutMin);
        amounts = router.swapETHForExactTokens{value: msg.value}(
            _amountOutMin,
            path,
            _to,
            block.timestamp
        );

        console.log("Input: %s ETH; Output: %s DAI", amounts[0], amounts[1]);
        uint256 dust = msg.value - amounts[0];
        if (dust > 0) payable(_to).transfer(dust);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
