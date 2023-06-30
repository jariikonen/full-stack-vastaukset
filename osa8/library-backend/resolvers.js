const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

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
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError(
          'This action is permitted only for authenticated users',
          {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          }
        );
      }

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

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error,
          },
        });
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError(
          'This action is permitted only for authenticated users',
          {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          }
        );
      }

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
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
};

module.exports = resolvers;
