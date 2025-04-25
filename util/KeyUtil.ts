/**
 * Replaces all '|' characters in the given string with '-'.
 *
 * @param sub The string to modify.
 * @returns The modified string
 */
export function secureStoreKeyFromUserSub(sub: string) {
  return sub.replaceAll("|", "-");
}
