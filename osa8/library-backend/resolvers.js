const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const { PubSub } = require('graphql-subscriptions');
const author = require('./models/author');
const pubsub = new PubSub();

const resolvers = {
  Author: {
    bookCount: async (root) => {
      return root.books.length;
    },
  },
  Query: {
    authorCount: async () => {
      const authorCount = Author.collection.countDocuments();
      return authorCount;
    },
    bookCount: async () => {
      const bookCount = Book.collection.countDocuments();
      return bookCount;
    },
    allBooks: async (root, args) => {
      let booksToReturn = await Book.find({}).populate({
        path: 'author',
        populate: {
          path: 'books',
          model: 'Book',
        },
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
    allAuthors: async () => {
      const authors = await Author.find({}).populate('books');
      return authors;
    },
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
        author = new Author({
          name: args.author,
          books: [],
        });
        author = await author.save();
      }

      const book = new Book({ ...args, author: author.id });
      await book.save();

      author.books.push(book.id);
      await author.save();

      await book.populate({
        path: 'author',
        populate: {
          path: 'books',
          model: 'Book',
        },
      });

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
        author.born = args.setBornTo;
        await author.save();
        return author;
      }
      return null;
    },
    addAuthorBook: async (root, args, context) => {
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

      const authorToUpdate = await Author.findById(args.authorId);
      authorToUpdate.books.push(args.bookId);
      const updatedAuthor = await authorToUpdate.save();
      return updatedAuthor;
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
