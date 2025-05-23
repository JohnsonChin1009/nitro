# Nitro

Nitro is a decentralized financial platform leveraging zero-knowledge proofs for privacy-preserving credit and reputation management. The platform enables users to stake, borrow, and build reputation through a Soulbound Token (SBT) system.

## Features

- **Zero-Knowledge Age Verification**: Private age verification using ZK proofs
- **Soulbound Token (SBT)**: Non-transferable tokens representing user credit and reputation
- **Lending & Borrowing Pools**: Community-based lending pools with reputation-based access
- **Privacy-First**: Personal information stays private through ZK verification
- **User Dashboard**: Intuitive interface for managing staking, borrowing, and rewards
- **Role-Based Access**: Different experiences for stakers, borrowers, and validators

## Tech Stack
1. NextJS
2. TailwindCSS
3. SnarkJS
4. Circomlib
5. Hardhat
6. HuggingFace

## Deployed and Verifier Contracts
1. ZK Proof Contract for Age Verification. View [here](https://sepolia.scrollscan.com/address/0x16596F3aD0625C0106887FE4b51E073A4669c22b#code).
2. SoulBound Token (SBT) for Users. View [here](https://sepolia.scrollscan.com/address/0xd7121344156D594Eb875213d0bdBf2BA24117944#code).
3. DAO Implementation Contract. View [here](https://sepolia.scrollscan.com/address/0xf912F9472B18De307D1770acc54105d728178836)
4. Governance Token Contract. View [here](https://sepolia.scrollscan.com/address/0xb53026f22F0F4ca4145CB6E1DdC245fb89eBD435)
5. Mock USDC Token Contract. View [here](https://sepolia.scrollscan.com/address/0x824Ec7410B298599956CcBE90e448862E9514012)
6. MYRC Token Contract. View [here](https://sepolia.scrollscan.com/address/0xcdBcc28b0D9F3582E33e52c01C08966064faA373)
7. Lending Pool Contract. View [here](https://sepolia.scrollscan.com/address/0xFbD8282379E7deeE05C28AdE82F69195720B0C03)

 <b>ProposalImplementation is a child contract while the DAO contract is the factory contract that holds the implementation address of Lending Pool. </b>

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

## Acknowledgements

- [Scroll](https://scroll.io/) for the L2 smart contract deployment
- [Privy](https://privy.io/) for authentication
- [Circom](https://github.com/iden3/circom) for ZK circuit development