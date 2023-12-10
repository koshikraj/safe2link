// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./Enum.sol";


interface GnosisSafe {
    /// @dev Allows a Module to execute a Safe transaction without any further confirmations.
    /// @param to Destination address of module transaction.
    /// @param value Ether value of module transaction.
    /// @param data Data payload of module transaction.
    /// @param operation Operation type of module transaction.
    function execTransactionFromModule(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
    ) external returns (bool success);
}

contract Safe2LinkModule  {
    string public constant NAME = "Safe2Link Module";
    string public constant VERSION = "0.1.0";


    // Safe -> Delegate -> Tokens
    mapping(address => mapping(address => address[])) public tokens;
    // Safe -> Delegates double linked list entry points


    struct Link {
        address pubKey20; // (20 bytes) last 20 bytes of the hash of the public key for the deposit
        uint256 amount; // (32 bytes) amount of the asset being sent
        ///// tokenAddress, contractType, tokenId, claimed & timestamp are stored in a single 32 byte word
        address tokenAddress; // (20 bytes) address of the asset being sent. 0x0 for eth
        bool claimed; // (1 byte) has this deposit been claimed
        uint40 timestamp; // ( 5 bytes) timestamp of the deposit
        address account; // (20 bytes) address of the sender
    }


    Link[] public links; // array of deposits


    // events
    event LinkEvent(
        uint256 indexed _index, uint256 _amount, address indexed _senderAddress
    );
    event WithdrawEvent(
        uint256 indexed _index, uint256 _amount, address indexed _recipientAddress
    ); 

    event MessageEvent(string message);



    /**
     * @notice Function to make a deposit
     * @dev For token deposits, allowance must be set before calling this function
     * @param _tokenAddress address of the token being sent. 0x0 for eth
     * @param _amount uint256 of the amount of tokens being sent (if erc20)
     * @param _pubKey20 last 20 bytes of the public key of the deposit signer
     * @return uint256 index of the deposit
     */
    function createLink(
        address _tokenAddress,
        uint256 _amount,
        address _pubKey20
    ) public returns (uint256) {


     // create link
        links.push(
            Link({
                tokenAddress: _tokenAddress,
                amount: _amount,
                claimed: false,
                pubKey20: _pubKey20,
                account: msg.sender,
                timestamp: uint40(block.timestamp)
            })
        );

        // emit the deposit event
        emit LinkEvent(links.length - 1, _amount, msg.sender);

        // return id of new deposit
        return links.length - 1;
    }




    /**
     * @param _index uint256 index of the deposit
     * @param _recipientAddress address of the recipient
     * @param _recipientAddressHash bytes32 hash of the recipient address (prefixed with "\x19Ethereum Signed Message:\n32")
     * @param _signature bytes signature of the recipient address (65 bytes)
     * @return bool true if successful
     */
    function claimLink(
        uint256 _index,
        address _recipientAddress,
        bytes32 _recipientAddressHash,
        bytes memory _signature
    ) external returns (bool) {
        // check that the link exists and that it isn't already withdrawn
        require(_index < links.length, "LINK INDEX DOES NOT EXIST");
        Link memory _link = links[_index];
        require(_link.claimed == false, "LINK ALREADY WITHDRAWN");
        // check that the recipientAddress hashes to the same value as recipientAddressHash
        require(
            _recipientAddressHash == ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_recipientAddress))),
            "HASHES DO NOT MATCH"
        );
        // check that the signer is the same as the one stored in the deposit
        address linkSigner = getSigner(_recipientAddressHash, _signature);
        require(linkSigner == _link.pubKey20, "WRONG SIGNATURE");

        // emit the withdraw event
        emit WithdrawEvent(_index, _link.amount, _recipientAddress);

        // mark as claimed
        links[_index].claimed = true;


        // Transfer token
        transfer(GnosisSafe(_link.account), _link.tokenAddress, payable(_recipientAddress), _link.amount);

        return true;
    }


    /**
     * @param messageHash bytes32 hash of the message
     * @param signature bytes signature of the message
     * @return address of the signer
     */
    function getSigner(bytes32 messageHash, bytes memory signature) public pure returns (address) {
        address signer = ECDSA.recover(messageHash, signature);
        return signer;
    }

    function transfer(GnosisSafe safe, address token, address payable to, uint256 amount) private {
        if (token == address(0)) {
            // solium-disable-next-line security/no-send
            require(safe.execTransactionFromModule(to, amount, "", Enum.Operation.Call), "Could not execute ether transfer");
        } else {
            bytes memory data = abi.encodeWithSignature("transfer(address,uint256)", to, amount);
            require(safe.execTransactionFromModule(token, 0, data, Enum.Operation.Call), "Could not execute token transfer");
        }
    }


    /**
     * @notice Simple way to get the total number of deposits
     * @return uint256 number of deposits
     */
    function getLinkCount() external view returns (uint256) {
        return links.length;
    }

    /**
     * @notice Simple way to get single deposit
     * @param _index uint256 index of the deposit
     * @return Deposit struct
     */
    function getLink(uint256 _index) external view returns (Link memory) {
        return links[_index];
    }

    /**
     * @notice Get all links in contract
     * @return Links[] array of deposits
     */
    function getAllLinks() external view returns (Link[] memory) {
        return links;
    }


}
