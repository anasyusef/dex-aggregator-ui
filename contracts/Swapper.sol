pragma solidity ^0.8.0;

import "./interfaces/IUniswapV2Pair.sol";
import "./libraries/UniswapV2Library.sol";
import "./libraries/Utils.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IWETH.sol";
import "./interfaces/IAdapter.sol";
import "./interfaces/ISwapper.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swapper is Ownable, ISwapper {
    using SafeERC20 for IERC20;

    event Received(address, uint256);

    // Add the library methods
    // using EnumerableMap for EnumerableMap.UintToAddressMap;

    // Declare a set state variable
    mapping(uint256 => address) public adapters;

    function singleSwap(
        uint256 adapterId,
        uint256 routerId,
        uint256 amountIn,
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable override {
        require(adapters[adapterId] != address(0), "Adapter not registered");
        IAdapter adapter = IAdapter(adapters[adapterId]);
        adapter.swap{value: msg.value}(
            routerId,
            amountIn,
            amountOut,
            path,
            msg.sender,
            to,
            deadline
        );
    }

    function transferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 amount
    ) external override {
        token.safeTransferFrom(from, to, amount);
    }

    function multiSwap() external payable {}

    function swap() external payable {}

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
