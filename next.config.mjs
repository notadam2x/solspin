/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MNEMONIC: process.env.MNEMONIC,
    API_KEY: process.env.API_KEY,
    MINTER_MNEMONIC: process.env.MINTER_MNEMONIC,
  },
};

export default nextConfig;
