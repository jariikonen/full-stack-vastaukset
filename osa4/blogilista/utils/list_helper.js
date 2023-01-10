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

const mostBlogs = (blogList) => {
  if (blogList.length === 0) {
    return undefined;
  }

  const [author, blogs] = _(blogList)
    .countBy((blog) => blog.author)
    .toPairs()
    .maxBy(1);

  return { author, blogs };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
