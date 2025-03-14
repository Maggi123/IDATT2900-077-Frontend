export function secureStoreKeyFromUserSub(sub: string) {
  return sub.replaceAll("|", "-");
}
