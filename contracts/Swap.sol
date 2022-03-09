pragma solidity ^0.8.0;

import "./interfaces/IUniswapV2Pair.sol";
import "./libraries/UniswapV2Library.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IWETH.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swap is Ownable {
    event Received(address, uint256);
    // IUniswapV2Router02 public immutable router;
    address public immutable WETH;

    // Add the library methods
    using EnumerableMap for EnumerableMap.UintToAddressMap;

    // Declare a set state variable
    EnumerableMap.UintToAddressMap private routers;

    constructor(address _WETH) {
        WETH = _WETH;
    }

    function aggregatePrices(uint256 amountIn, address[] memory path)
        external
        view
        returns (uint256[] memory amounts)
    {
        IUniswapV2Router02 router = IUniswapV2Router02(routers.get(0));
        amounts = UniswapV2Library.getAmountsOut(
            router.factory(),
            amountIn,
            path
        );
        console.log(amounts.length);
    }

    function swapExactETHForTokens(
        uint256 _exchangeIdx,
        uint256 amountOutMin,
        address _beneficiary,
        address[] calldata path,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts) {
        IUniswapV2Router02 router = getRouter(_exchangeIdx);
        amounts = router.swapExactETHForTokens{value: msg.value}(
            amountOutMin,
            path,
            _beneficiary,
            deadline
        );

        console.log("Input: %s ETH; Output: %s DAI", amounts[0], amounts[1]);
        uint256 dust = msg.value - amounts[0];
        if (dust > 0) payable(_beneficiary).transfer(dust);
    }

    function getRouter(uint256 _exchangeIdx)
        public
        view
        returns (IUniswapV2Router02)
    {
        (bool success, address routerAddress) = routers.tryGet(_exchangeIdx);
        require(success, "Router not initialised");
        return IUniswapV2Router02(routerAddress);
    }

    function addRouter(uint256 _exchangeIdx, address routerAddress)
        external
        onlyOwner
        returns (bool success)
    {
        success = routers.set(_exchangeIdx, routerAddress);
        require(success, "Failed to add router");
    }

    // function swap(
    //     address _tokenIn,
    //     address _tokenOut,
    //     uint256 _amountIn,
    //     uint256 _amountOutMin,
    //     address _to
    // ) external {
    //     IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
    //     IERC20(_tokenIn).approve(address(router), _amountIn);

    //     address[] memory path;

    //     if (_tokenIn == router.WETH() || _tokenOut == router.WETH()) {
    //         path = new address[](2);
    //         path[0] = _tokenIn;
    //         path[1] = _tokenOut;
    //     } else {
    //         path = new address[](3);
    //         path[0] = _tokenIn;
    //         path[1] = router.WETH();
    //         path[2] = _tokenOut;
    //     }

    //     router.swapExactTokensForTokens(
    //         _amountIn,
    //         _amountOutMin,
    //         path,
    //         _to,
    //         block.timestamp
    //     );
    // }

    // function swapETHForExactTokens(
    //     address _tokenOut,
    //     uint256 _amountOutMin,
    //     address _to
    // ) external payable returns (uint256[] memory amounts) {
    //     // amountOutMin must be retrieved from an oracle of some kind
    //     // console.log(_tokenOut, _amountOutMin, _to, msg.value);
    //     address[] memory path = new address[](2);
    //     path[0] = router.WETH();
    //     path[1] = _tokenOut;
    //     console.log(_amountOutMin);
    //     amounts = router.swapETHForExactTokens{value: msg.value}(
    //         _amountOutMin,
    //         path,
    //         _to,
    //         block.timestamp
    //     );

    //     console.log("Input: %s ETH; Output: %s DAI", amounts[0], amounts[1]);
    //     uint256 dust = msg.value - amounts[0];
    //     if (dust > 0) payable(_to).transfer(dust);
    // }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
