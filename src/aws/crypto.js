import { KmsKeyringNode, encrypt, decrypt } from '@aws-crypto/client-node';
import aws from 'aws-sdk';

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
    }

    /**
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
     * 
     * @param {string} clearText 
     */
    KmsEncryptTest(clearText) {
        try {
            const kms = new aws.KMS({
                accessKeyId: 'AKCVBTRNOSMLTIA7RPQQ', //credentials for your IAM user
                secretAccessKey: 'lJQtdIfH/Cup9AyaaHV8h2NnR/eKFIsZea5Vn0k', //credentials for your IAM user
                region: 'ap-southeast-1'
            });

            return new Promise((resolve, reject) => {
                const params = {
                    KeyId: '965d2884-b2cd-4d79-8773-6b1f57133300',
                    Plaintext: clearText
                };

                kms.encrypt(params, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.CiphertextBlob);
                    }
                })
            })
        } catch (error) {
            console.error(error);
        }
    }
}

export default Crypto;