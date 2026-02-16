import Blog from "../models/Blog.model.js";

// ==============================
// CREATE BLOG
// ==============================
export const createBlog = async (req, res, next) => {
  try {
    const { title, content, tags, published } = req.body;

    const blog = await Blog.create({
      title,
      content,
      tags: tags ? tags.split(",") : [],
      author: req.user._id,
      published,
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET ALL BLOGS
// ==============================
export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ published: true })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET SINGLE BLOG
// ==============================
export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name avatar");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// LIKE / UNLIKE BLOG
// ==============================
export const toggleLikeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const liked = blog.likes.includes(req.user._id);

    if (liked) {
      blog.likes.pull(req.user._id);
    } else {
      blog.likes.push(req.user._id);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      likes: blog.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPDATE BLOG
// ==============================
export const updateBlog = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only author can update blog",
      });
    }

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (tags) blog.tags = Array.isArray(tags) ? tags : tags.split(",");

    await blog.save();

    res.status(200).json({
      success: true,
      data: { blog },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// DELETE BLOG
// ==============================
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only author can delete blog",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
