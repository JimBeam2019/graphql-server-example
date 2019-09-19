import { KmsKeyringNode, encrypt, decrypt } from '@aws-crypto/client-node';
import aws from 'aws-sdk';
import crypto from 'crypto';

const generatorKeyId = 'arn:aws:kms:us-west-2:111122223333:alias/EncryptDecrypt';
const keyIds = ['arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab'];

class Crypto {
    /**
     * 
     */
    constructor() {
        this.context = {
            stage: 'demo',
            purpose: 'simple demonstration app',
            origin: 'us-west-2'
        };

        this.awsToken = {
            accessKeyId: '----', //credentials for your IAM user
            secretAccessKey: '----', //credentials for your IAM user
            region: '----'
        };

        this.KeyId = '----'; // The identifier of the CMK to use for encryption. You can use the key ID or Amazon Resource Name (ARN) of the CMK, or the name or ARN of an alias that refers to the CMK.

        // For Nodejs Crypto.
        this.algorithm = 'aes-256-cbc';
        this.password = crypto.randomBytes(16);
        this.secretKey = crypto.scryptSync(this.password, 'salt', 32);
        this.iv = crypto.randomBytes(16);
    }

    /**
     * AWS Encryption SDK
     * 
     * https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/js-examples.html
     * 
     * @param {string} clearText 
     */
    async encryptText(clearText) {
        try {
            const keyRing = new KmsKeyringNode({generatorKeyId, keyIds});
        
            const { ciphertext } = await encrypt(keyRing, clearText, { context: this.context });

            console.log('The cipher text: ', ciphertext);

            const { plaintext, messageHeader } = await decrypt(keyRing, ciphertext);
            const { encryptionContext } = messageHeader;

            console.log('The plaintext: ', plaintext);
            console.log('The encryption context: ', encryptionContext);

            Object.entries(this.context).forEach(([key, value]) => {
                if (encryptionContext[key] !== value) {
                    throw new Error('Encryption Context does not match expected values.');
                }
            });
        } catch (error) {
            console.error(error);
        }
        
    }

    /**
     * AWS KMS encrypt
     * 
     * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#encrypt-property
     * 
     * @param {string} clearText 
     */
    KmsEncryptText(clearText) {
        try {
            const kms = new aws.KMS(this.awsToken);

            return new Promise((resolve, reject) => {
                console.log('>>>>> Ciper text: ', clearText);

                const params = {
                    KeyId: this.KeyId,
                    Plaintext: Buffer.from(clearText, 'utf-8')
                };

                kms.encrypt(params, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        const { CiphertextBlob } = data;

                        console.log('CiphertextBlob >>>> ', CiphertextBlob);

                        const cipherText = CiphertextBlob.toString('base64');

                        resolve(cipherText);
                    }
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * AWS KMS decrypt
     * 
     * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#decrypt-property
     * 
     * @param {string} cipherText 
     */
    KmsDecryptText(cipherText) {
        try {
            const kms = new aws.KMS(this.awsToken);

            return new Promise((resolve, reject) => {
                console.log('>>>>> Ciper text: ', cipherText);

                const encryptedText = Buffer.from(cipherText, 'base64');

                const params = {
                    CiphertextBlob: encryptedText
                };

                kms.decrypt(params, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        const { Plaintext } = data;

                        const clearText = Plaintext.toString('utf-8');

                        resolve(clearText);
                    }
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Node.js Crypto createCipheriv with aes-256-cbc
     * 
     * https://nodejs.org/dist/latest-v10.x/docs/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options
     * 
     * @param {string} plainText 
     */
    aesEncryptText(plainText) {

        return new Promise((resolve, reject) => {
            try {
                const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
        
                let encryptedText = cipher.update(plainText, 'utf8', 'base64');
                
                encryptedText += cipher.final('base64');

                resolve(encryptedText);
            } catch (error) {
                console.error(error);

                reject(error);
            }
        });
        
    }

    /**
     * Node.js Crypto createDecipheriv with aes-256-cbc
     * 
     * https://nodejs.org/dist/latest-v10.x/docs/api/crypto.html#crypto_crypto_createdecipheriv_algorithm_key_iv_options
     * 
     * @param {string} cipherText 
     */
    aesDecryptText(cipherText) {

        return new Promise((resolve, reject) => {
            try {
                const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, this.iv);

                let decryptedText = decipher.update(cipherText, 'base64', 'utf8');

                decryptedText += decipher.final('utf8');

                resolve(decryptedText);
            } catch (error) {
                console.error(error);

                reject(error);
            }
        });
    }
}

export default Crypto;