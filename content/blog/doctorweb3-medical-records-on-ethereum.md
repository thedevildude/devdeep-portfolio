---
title: DoctorWeb3: sharing medical records without a central database
tag: Case study
work: doctorweb3
seoTitle: DoctorWeb3 Case Study: Medical Records on Ethereum
description: DoctorWeb3 lets patients own their medical records and share them with verified doctors and hospitals using Ethereum, IPFS and Chainlink, with end-to-end encryption and revocable access. Published at IEEE IEMECON 2024.
date: 2026-10-14
updated: 2026-10-14
keywords: DoctorWeb3, Doctor Web3.0, IEEE IEMECON 2024, end-to-end encryption, access revocation, medical records blockchain, Ethereum, Solidity, IPFS, Chainlink, healthcare, smart contracts
---

A patient's medical history is scattered across clinics, each holding its own copy, and the patient is rarely the one deciding who sees it. DoctorWeb3 flips that. The patient holds the record, and a smart contract, not a hospital's database, says who may receive it. The file stays encrypted, so even the storage network never sees the contents.

## What it does

A patient connects a wallet and uploads a PDF report. The browser encrypts it, the ciphertext goes to IPFS, and the contract stores its hash against the patient's address, so the patient can list their own reports at any time.

Doctors and hospitals apply for verification with a name and a medical ID. Once the oracle confirms them they appear in a registry that patients can browse. To share, the patient picks a verified doctor or hospital, sets how long access should last, and attaches a note. The recipient opens the report, reads it, and sends a response back, which is stored the same way. Every step emits an event, so the front end reacts to what actually happened on chain.

The front end is React with ethers, Tailwind and Headless UI. The contracts are Solidity, deployed with Truffle and covered by a full test suite.

## Who counts as a doctor

The hard part of a system like this is not storage, it is trust: how does the contract know an applicant really is a doctor? Every application goes through a Chainlink oracle. The contract sends a request, the oracle job checks the applicant's medical ID against a registry, and the contract admits them only when the callback confirms it. There is one verification path and no shortcut around it. That keeps the decision off the applicant's machine and out of the contract owner's hands.

## Why IPFS and not the chain

Putting a PDF on Ethereum would be absurdly expensive and permanent. IPFS holds the file, and the chain holds a small pointer to it plus the rules about who may have it. That split, bulk data off chain and access rules on chain, is the core idea. It also kept the code simple: one hook wraps contract calls, one context holds the wallet and contract, and each page is a thin form over a contract function.

## Privacy by construction

A blockchain is public by default, so nothing sensitive is allowed to touch it in readable form.

- **Encrypt before upload.** The browser encrypts each report with a fresh AES-256-GCM key before it reaches IPFS, so the network only ever stores ciphertext.
- **Share a wrapped key, not a password.** When a patient shares a report, the report key is wrapped with ECIES to the recipient's public key and stored with the share. Only that recipient can unwrap it, and the contract holds nothing readable.
- **Keep the profile off chain.** Age, weight, height and the rest travel inside the encrypted payload instead of public contract storage. The chain holds hashes, addresses and permissions.

## How the encryption works

The scheme is hybrid encryption, because no single algorithm is good at both big files and key exchange.

- **The file: AES-256-GCM.** Each report gets a fresh random 256-bit key and a unique 96-bit nonce, generated in the browser with the Web Crypto API. GCM is authenticated encryption, so it hides the contents and also detects tampering: if a single byte of the ciphertext on IPFS is altered, decryption fails instead of returning a corrupted report. Nothing ever reuses a key or a nonce.
- **The key: ECIES on secp256k1.** An Ethereum wallet is already a secp256k1 key pair, so there is no new identity to manage. To share, the patient's client encrypts the report key to the recipient's public key using ECIES, which derives a one-time shared secret with ECDH, stretches it with a KDF, and wraps the key under that. The wrapped key is small enough to store with the share, and only the recipient's private key can open it.
- **Integrity and binding.** The IPFS content hash is a SHA-256 based CID, so the pointer on chain already commits to the exact ciphertext. The patient also signs the share with their wallet, so the recipient can prove the grant came from the record's owner.
- **Nothing sensitive leaves the browser.** Keys and plaintext live only in memory on the client. The server side of this system, which is the contract and IPFS, holds ciphertext, wrapped keys and hashes, and could be fully public without leaking a report.

Revocation follows from this design. Cutting off a recipient means the patient re-encrypts the report under a new AES key, uploads the new ciphertext, and re-wraps the new key for everyone who should still have access. The old wrapped key then opens a file that is no longer the current record.

## Access that can end

Medical access should not last forever by default. Each share carries an expiry, and the patient can revoke it at any time. Revoking stops future access through the contract, and re-encrypting the report under a new key closes off anyone who already held the old one. The patient can see every active grant in one place.

## Tested like it matters

A contract that guards health records gets a real test suite: registration and oracle callbacks, sharing, expiry, revocation, and the failure cases such as an unverified recipient or a repeated medical ID. The aim was for the contract to be boring, so every path is exercised before it is deployed anywhere that counts.
