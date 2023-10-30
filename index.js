const crypto = require('crypto');

function generateHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function generateHashes(num) {
  let hashes = [];
  for (let i = 0; i < num; i++) {
    // Using the current index as the data to hash
    hashes.push(BigInt(`0x${generateHash(i.toString())}`));
  }
  return hashes;
}

const hashes = generateHashes(100);

const recursive = function (hash, n) {
  if (n === 0) {
    return 1n;
  }
  return hash ** BigInt(n) + recursive(hash, n - 1);
};

const mockHash = BigInt(
  '0xba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
);

function addPolynomials(p1, p2) {
  const length = Math.max(p1.length, p2.length);
  const result = new Array(length).fill({ num: 0, denom: 1 });

  for (let i = 0; i < length; i++) {
    const term1 = p1[i] || { num: 0, denom: 1 };
    const term2 = p2[i] || { num: 0, denom: 1 };
    result[i] = addFractions(term1, term2);
  }

  return result;
}

function getLagrangeCoefficients(x, y) {
  const n = x.length;
  let coefficients = new Array(n).fill({ num: 0, denom: 1 });

  for (let i = 0; i < n; i++) {
    let basisCoeff = [{ num: 1, denom: 1 }];

    let denom = 1;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        denom *= x[i] - x[j];
      }
    }

    for (let j = 0; j < n; j++) {
      if (i !== j) {
        basisCoeff = multiplyPolynomials(basisCoeff, [
          { num: -x[j], denom: 1 },
          { num: 1, denom: 1 },
        ]);
      }
    }

    // Multiply each coefficient by the scaled y value
    for (let j = 0; j < basisCoeff.length; j++) {
      basisCoeff[j].num *= y[i];
      basisCoeff[j].denom *= denom;
      basisCoeff[j] = simplifyFraction(basisCoeff[j]);
    }

    coefficients = addPolynomials(coefficients, basisCoeff);
  }

  return coefficients.reverse(); // highest degree first
}

function multiplyPolynomials(p1, p2) {
  const result = new Array(p1.length + p2.length - 1).fill({
    num: 0,
    denom: 1,
  });
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      let temp = multiplyFractions(p1[i], p2[j]);
      result[i + j] = addFractions(result[i + j], temp);
    }
  }
  return result;
}

function multiplyFractions(f1, f2) {
  return simplifyFraction({
    num: f1.num * f2.num,
    denom: f1.denom * f2.denom,
  });
}

function addFractions(f1, f2) {
  const commonDenom = f1.denom * f2.denom;
  const num = f1.num * f2.denom + f2.num * f1.denom;
  return simplifyFraction({
    num: num,
    denom: commonDenom,
  });
}

function gcd(a, b) {
  if (b === 0) return a;
  return gcd(b, a % b);
}

function simplifyFraction(fraction) {
  const commonDivisor = gcd(fraction.num, fraction.denom);
  return {
    num: fraction.num / commonDivisor,
    denom: fraction.denom / commonDivisor,
  };
}

const x = Array.from({ length: hashes.length }, (_, i) => i + 1);
const y = hashes;

// Running the sum
// const result = recursive(mockHash, 2000);

console.log(getLagrangeCoefficients(x, y));
