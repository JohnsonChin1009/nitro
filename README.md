# Nitro

Nitro is a decentralized financial platform leveraging zero-knowledge proofs for microloans that also features reputation management. The platform enables users to stake, borrow, and build reputation & credit score via a Soulbound Token (SBT) system.

## How it Works
{Insert Image here by @Sean Hoe}

## Features

- **Zero-Knowledge Age Verification**: Private age verification using ZK proofs
- **Soulbound Token (SBT)**: Non-transferable tokens representing user credit and reputation
- **Lending & Borrowing Pools**: Community-based lending pools with reputation-based access
- **Privacy-First**: Personal information stays private through ZK verification
- **User Dashboard**: Intuitive interface for managing staking, borrowing, and rewards

## Tech Stack
1. NextJS
2. TailwindCSS
3. SnarkJS
4. Circomlib
5. Hardhat

## Deployed and Verifier Contracts
1. ZK Proof Contract for Age Verification. View [here](https://sepolia.scrollscan.com/address/0x16596F3aD0625C0106887FE4b51E073A4669c22b#code).
2. SoulBound Token (SBT) for Users. View [here](https://sepolia.scrollscan.com/address/0xd7121344156D594Eb875213d0bdBf2BA24117944#code).

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A browser wallet (e.g., MetaMask)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/nitro.git
cd nitro
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```
cp .env.example .env.local
# Edit .env.local with your configurations
```

4. Run development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Usage

1. **Sign Up/Connect Wallet**: Connect your wallet via Privy authentication
2. **Age Verification**: Complete the ZK age verification process
3. **Dashboard Access**: Access your personalized dashboard
4. **Pool Interaction**: Participate in lending and borrowing pools
5. **Reputation Building**: Build reputation through active platform participation

## Zero-Knowledge Proofs

Nitro uses zero-knowledge proofs to verify user age without revealing actual birth dates. The circuit is implemented in Circom and verification happens on-chain through the deployed verifier contract.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Scroll](https://scroll.io/) for the L2 smart contract deployment
- [Privy](https://privy.io/) for authentication
- [Circom](https://github.com/iden3/circom) for ZK circuit development