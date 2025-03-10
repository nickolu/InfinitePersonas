/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_CHARACTER_CONVERSATION_GPT_MODEL: process.env.NEXT_PUBLIC_CHARACTER_CONVERSATION_GPT_MODEL,
    NEXT_PUBLIC_RATE_TRUTHFULNESS_GPT_MODEL: process.env.NEXT_PUBLIC_RATE_TRUTHFULNESS_GPT_MODEL,
    NEXT_PUBLIC_MODEL: process.env.NEXT_PUBLIC_MODEL,
  },
};

module.exports = nextConfig;
