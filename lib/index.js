"use strict";

var _apolloServer = require("apollo-server");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    # Comments in GraphQL are defined with the hash (#) symbol.\n    # This \"Book\" type can be used in other type declarations.\n    type Book {\n        title: String\n        author: String\n    }\n\n    # The \"Query\" type is the root of all GraphQL queries.\n    # (A \"Mutation\" type will be covered later on.)\n    type Query {\n        books: [Book]\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
var _books = [{
  title: 'Harry Potter',
  author: 'J.K. Rowling'
}, {
  title: 'Pet Sametary',
  author: 'Stephen King'
}]; // Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.

var typeDefs = (0, _apolloServer.gql)(_templateObject()); // Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.

var resolvers = {
  Query: {
    books: function books() {
      return _books;
    }
  }
}; // In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.

var server = new _apolloServer.ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers
}); // This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.

server.listen().then(function (_ref) {
  var url = _ref.url;
  console.log(" Server ready at ".concat(url));
});