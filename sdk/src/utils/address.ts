/**
 * Address utility functions.
 * @author Qova Engineering <eng@qova.cc>
 */

import { type Address, getAddress, isAddress } from "viem";

/**
 * Shorten an Ethereum address for display.
 * @param address - The full Ethereum address.
 * @param chars - Number of characters to show on each side (default 4).
 * @returns Shortened address string, e.g. "0x1234...abcd".
 * @example shortenAddress("0x0a3AF9a104Bd2B5d96C7E24fe95Cc03432431158") // "0x0a3A...1158"
 */
export function shortenAddress(address: string, chars = 4): string {
	return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Validate whether a string is a valid Ethereum address.
 * @param address - The string to validate.
 * @returns True if valid Ethereum address.
 * @example isValidAddress("0x0a3AF9a104Bd2B5d96C7E24fe95Cc03432431158") // true
 */
export function isValidAddress(address: string): boolean {
	return isAddress(address);
}

/**
 * Convert an address to its checksummed form.
 * @param address - The Ethereum address string.
 * @returns The checksummed address.
 * @throws If the address is not valid.
 * @example checksumAddress("0x0a3af9a104bd2b5d96c7e24fe95cc03432431158")
 */
export function checksumAddress(address: string): Address {
	return getAddress(address);
}
