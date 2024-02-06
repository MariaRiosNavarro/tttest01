import { User } from "../users/users.model.js";
import { Post } from "./posts.model.js";
import { deleteImage, uploadImage } from "../config/storage.config.js";

// export const createPost = async (req, res, next) => {
//   const newPost = new Post(req.body);

//   try {
//     const cloudinaryResult = await uploadImage(req.file.buffer);
//     newPost.img = cloudinaryResult.secure_url;
//     newPost.cloudinaryId = cloudinaryResult.public_id;
//     const savedPost = await newPost.save();
//     if (!savedPost) {
//       res.status(400).json({ message: "Post not saved! Try again." });
//     }

//     // * Funktion um den Post direkt in den User zu pushen
//     const user = await User.findById(newPost.user)
//       .select({
//         _id: 1,
//         username: 1,
//         img: 1,
//         job: 1,
//       })
//       .exec();
//     if (!user) {
//       return res.status(404).json({ message: "User not found!" });
//     }

//     user.posts.push(savedPost._id);
//     await user.save();
//     res.status(201).json({
//       message: "Post sucessfully created!",
//       postId: savedPost._id,
//       user: user,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const createPost = async (req, res, next) => {
  const newPost = new Post(req.body);
  const payload_id = req.payload.id;

  console.log("--------req.body---------", req.body);

  console.log("-------payload_id----------", payload_id);

  try {
    const cloudinaryResult = await uploadImage(req.file.buffer);

    if (!cloudinaryResult) {
      return res
        .status(400)
        .json({ message: "Error uploading image to Cloudinary." });
    }
    newPost.user = payload_id;
    newPost.img = cloudinaryResult.secure_url;
    newPost.cloudinaryId = cloudinaryResult.public_id;

    const savedPost = await newPost.save();

    if (!(savedPost instanceof Post)) {
      return res.status(400).json({ message: "Error saving post." });
    }

    const user = await User.findById(payload_id).select({
      _id: 1,
      username: 1,
      img: 1,
      job: 1,
      posts: 1,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check ob ein Array ist
    user.posts = user.posts || [];

    // Hinzufügen, damit nicht überschreiben wird

    user.posts = user.posts.concat(savedPost._id);

    await user.save();

    res.status(201).json({
      message: "Post successfully created!",
      postId: savedPost._id,
      user: user,
    });
  } catch (err) {
    console.log("----------------createError-------", err);

    next(err);
  }
};

// ---------------------
export const updatePost = async (req, res, next) => {
  const postId = req.params.id;
  const updatedPost = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }
    if (req.file) {
      const cloudinaryResult = await uploadImage(req.file.buffer);
      updatedPost.img = cloudinaryResult.secure_url;
      updatedPost.cloudinaryId = cloudinaryResult.public_id;
      deleteImage(post.cloudinaryId);
    }
    const savedPost = await Post.findByIdAndUpdate(postId, {
      $set: updatedPost,
      new: true,
    });
    res
      .status(200)
      .json({ message: "Post sucessfully updated!", post: savedPost });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const user = await User.findById(post.user);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    await deleteImage(post.cloudinaryId);
    user.posts = user.posts.filter(
      (userPostId) => userPostId.toString() !== postId
    );

    await user.save();

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post successfully deleted!" });
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId).populate("comments");
    console.log(post);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
