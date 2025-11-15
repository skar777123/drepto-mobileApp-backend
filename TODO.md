# TODO for Fixing PASETO Key Error

1. [x] Update src/auth/auth.service.ts to import crypto module.
2. [x] Modify constructor to generate Ed25519 key pair using crypto.generateKeyPairSync.
3. [x] Store privateKey and publicKey as Buffers in the class.
4. [x] Update generateToken method to use privateKey for V2.sign.
5. [x] Update verifyToken method to use publicKey for V2.verify.
6. Test the login endpoint to ensure token generation and verification work.
