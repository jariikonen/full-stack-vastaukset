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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
