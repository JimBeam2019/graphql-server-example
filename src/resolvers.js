import AchModel from './ach/AchModel';
import Crypto from './aws/crypto';

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
    {
        title: 'Harry Potter Series',
        author: 'Ms J.K. Rowling',
    },
    {
        title: 'Pet Sametary',
        author: 'Mr Stephen King',
    },
    {
        title: 'The Hunger Games',
        author: 'S.C.'
    },
];

const authors = [
    {
        name: 'Ms J.K. Rowling',
    },
    {
        name: 'Mr Stephen King'
    },
    {
        name: 'Ms S.C.'
    }
]

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
    Query: {
        getBooks: () => books,
        getAuthors: () => authors,
        createACH: () => {
            AchModel.createAchFile();

            return 1;
        },
        awsCrypto: () => {
            const crypto = new Crypto();
            crypto.encryptText('asdf');

            return 1;
        },
        kmsCrypto: async (_, args) => {

            const { text } = args;
            const crypto = new Crypto();
            const cipherText = await crypto.KmsEncryptText(text);

            console.log('Ciper text: ', cipherText);

            const plainText = await crypto.KmsDecryptText(cipherText);

            return { cipherText, plainText };
        },
        aesEncrypt: async (_, args) => {

            const { text } = args;
            const crypto = new Crypto();
            console.log('Plain text: ', text);
            
            const cipherText = await crypto.aesEncryptText(text);
            console.log('AES Encrypted text: ', cipherText);

            const decipherText = await crypto.aesDecryptText(cipherText);
            console.log('AES Decrypted text: ', decipherText);

            return { cipherText, decipherText }; 
        }
    },
    
};

module.exports = {
    resolvers
};