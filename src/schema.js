import { gql } from 'apollo-server';

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
    # Comments in GraphQL are defined with the hash (#) symbol.
    # This "Book" type can be used in other type declarations.
    type Book {
        title: String
        author: String
    }

    type Author {
        name: String
    }

    type KmsCipherText {
        cipherText: String
        plainText: String
    }

    # The "Query" type is the root of all GraphQL queries.
    # (A "Mutation" type will be covered later on.)
    type Query {
        getBooks: [Book],
        getAuthors: [Author],
        createACH: Int,
        awsCrypto: Int,
        kmsCrypto: KmsCipherText
    }
`;

module.exports = {
    typeDefs
};