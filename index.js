const recursive = function (hash, n) {
  if (n === 0) {
    return 1n;
  }
  return hash ** BigInt(n) + recursive(hash, n - 1);
};

const mockHash = BigInt(
  '0xba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
);

const result = recursive(mockHash, 2000);

console.log(result);
