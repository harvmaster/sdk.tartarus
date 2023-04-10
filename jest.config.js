// module.exports = {
//   preset: "ts-jest",
//   // testEnvironment: "node",

//   transformIgnorePatterns: [
//     'node_modules/(?!(@noble/secp256k1)/)',
//     // 'node_modules/(?!(ecies-wasm)/)'
//   ],
//   moduleNameMapper: {
//     "^worker_threads$": "<rootDir>/node_modules/worker_threads",
//   },
// };


module.exports = {
  // Your existing configuration...
  preset: "jest-puppeteer",
  transformIgnorePatterns: [
    'node_modules/(?!(@noble/secp256k1)/)',
    // 'node_modules/(?!(ecies-wasm)/)'
  ]
};
