
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
        name: 'S.C.'
    }
]

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
    Query: {
        getBooks: () => books,
        getAuthors: () => authors,
    },
};

module.exports = {
    resolvers
};