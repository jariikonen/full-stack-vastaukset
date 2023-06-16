const _ = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const reducer = (total, blog) => total + blog.likes;

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const { title, author, likes } = blogs.reduce(
    (favorite, blog) => (blog.likes > favorite.likes ? blog : favorite),
  );
  return { title, author, likes };
};

const mostBlogs = (blogArray) => {
  if (blogArray.length === 0) {
    return undefined;
  }

  const [author, blogs] = _(blogArray)
    .countBy((blog) => blog.author)
    .toPairs()
    .maxBy(1);

  return { author, blogs };
};

const mostLikes = (blogArray) => {
  if (blogArray.length === 0) {
    return undefined;
  }

  const likeArray = blogArray.reduce(
    (accu, blog) => {
      accu[blog.author] = accu[blog.author] || 0;
      accu[blog.author] += blog.likes;
      return accu;
    },
    {},
  );

  const [author, likes] = _(likeArray).toPairs().maxBy(1);
  return { author, likes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
