const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Book = require('./models/book');
const Author = require('./models/author');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

console.log('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
  Author: {
    bookCount: async (root) => {
      const booksByAuthor = await Book.find({ author: root.id });
      return booksByAuthor.length;
    },
  },
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      let booksToReturn = await Book.find({}).populate('author', {
        name: 1,
        id: 1,
      });
      if (args.author) {
        booksToReturn = booksToReturn.filter(
          (b) => b.author.name === args.author
        );
      }
      if (args.genre) {
        booksToReturn = booksToReturn.filter((b) =>
          b.genres.includes(args.genre)
        );
      }
      return booksToReturn;
    },
    allAuthors: async () => await Author.find({}),
  },
  Mutation: {
    addBook: async (root, args) => {
      if (args.title.length < 5) {
        throw new GraphQLError(
          'Title too short (must be at least 5 characters long)',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
            },
          }
        );
      }
      if (args.author.length < 4) {
        throw new GraphQLError(
          'Author name too short (must be at least 4 characters long)',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
            },
          }
        );
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        author = await author.save();
      }

      const book = new Book({ ...args, author: author.id });
      await book.populate('author', { name: 1, id: 1 });
      return await book.save();
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });
      if (author) {
        const newAuthor = { name: author.name, born: args.setBornTo };
        const updatedAuthor = await Author.findByIdAndUpdate(
          author.id,
          newAuthor,
          {
            new: true,
            runValidators: true,
          }
        );
        return updatedAuthor;
      }
      return null;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: PORT },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
