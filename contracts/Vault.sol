//SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../interfaces/IPoolTokens.sol";
import "../interfaces/ITranchedPool.sol";
import "./SafeERC20Transfer.sol";

contract Vault is ERC20Upgradeable, IERC721Receiver, SafeERC20Transfer {
  /// @notice the ERC721 token address. aka. pooltokenAddress
  address public tokenAddress;
  /// @notice the ERC721 token id
  uint256 public tokenId;

  IPoolTokens public poolTokens;
  ITranchedPool public tranchedPool;
  IERC20 public usdc;

  constructor(
    address _poolTokensAddress,
    address _tranchedPoolAddress,
    string memory _name,
    string memory _symbol
  ) public {
    poolTokens = IPoolTokens(_poolTokensAddress);
    tranchedPool = ITranchedPool(_tranchedPoolAddress);
    __ERC20_init(_name, _symbol);
    usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    // Allow vault to transfer usdc
    bool success = usdc.approve(address(this), uint256(-1));
    require(success, "Failed to approve USDC transfers from vault");
  }

  /// @notice transfer an NFT to this vault contract and mint ERC20 fractional tokens. the approve function needs to be called before transferring the NFT.
  function mint(
    address _tokenAddress,
    uint256 _tokenId,
    uint256 _totalSupply
  ) external {
    tokenAddress = _tokenAddress;
    tokenId = _tokenId;
    poolTokens.safeTransferFrom(msg.sender, address(this), _tokenId);
    _mint(msg.sender, _totalSupply);
  }

  /// @dev this function should be private but I make it public to make it easy to test in the hackathon.
  function _getWithdrawAmount(uint256 _amount) public view returns (uint256) {
    /// verify amount <= holder's balance
    (uint256 availableInterest, uint256 availablePrincipal) = tranchedPool
      .availableToWithdraw(tokenId);
    uint256 availableWithdrawAmount = availableInterest.add(availablePrincipal);
    uint256 totalSupply = totalSupply();
    uint256 withdrawAmountScaled = availableWithdrawAmount.mul(
      _amount.mul(1e18).div(totalSupply)
    );
    uint256 withdrawAmount = withdrawAmountScaled.div(1e18);
    return withdrawAmount;
  }

  /// @dev this function:
  /// 1. burns a sender's erc20 tokens
  /// 2. transfers USDC from goldfinch'c contract to the vault contract based on the burned token amount
  /// 3. transfers the USDC from the vault to the erc20 token sender
  function withdrawFractional(uint256 _amount) external returns (uint256) {
    uint256 withdrawAmount = _getWithdrawAmount(_amount);
    _burn(msg.sender, _amount);
    (uint256 interest, uint256 principal) = tranchedPool.withdraw(tokenId, withdrawAmount);
    uint256 fundsToDistribute = interest.add(principal);
    safeERC20TransferFrom(usdc, address(this), msg.sender, fundsToDistribute);
  }

  function onERC721Received(
    address,
    address,
    uint256,
    bytes calldata
  ) external override returns (bytes4) {
    return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
  }
}
