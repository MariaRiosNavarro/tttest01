import { User } from "./users.model.js";
import { uploadImage, deleteImage } from "../config/storage.config.js";

//! brauchen wir eine Route für getAllFollowing oder so um im Home Feed dann die Beiträge der user denen man folgt anzuzeigen?

// für die search page:
export const getAllUsers = async (_, res, next) => {
  try {
    const users = await User.find().select({
      _id: 1,
      username: 1,
      img: 1,
      job: 1,
      posts: 1,
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//$ getUser --- user data des other users für 06 --------------------------------------------------

// api/users?id=${_id}
export const getUser = async (req, res, next) => {
  const payload_id = req.payload.id; // id des eingeloggten users

  const { id } = req.query;

  console.log({ payload_id });
  try {
    const user = await User.findById(id).lean().select({
      _id: 1,
      username: 1,
      img: 1,
      name: 1,
      job: 1,
      description: 1,
      website: 1,
      posts: 1,
      followers: 1,
      following: 1,
      favorites: 1,
    });
    // console.log({ user });

    if (user) {
      const followers = user.followers.map((follower) => follower.toJSON());
      const followStatus = followers.includes(payload_id) ? true : false;
      console.log({ followStatus });
      console.log({ followers });

      res.json({ user, followStatus: followStatus });
    }
  } catch (err) {
    next(err);
  }
};

//$ getLoginUserData --- data des eingeloggten users für den login context ------------------------

export const getLoginUserData = async (req, res, next) => {
  const user_id = req.payload.id;

  try {
    const user = await User.findById(user_id)
      .select({
        password: 0,
        salt: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      })
      .exec();

    if (!user) return next(createError(404, "User not found"));
    console.log(user);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

//$ updateFollowStatus --- einem anderen user follown bzw. unfollown ------------------------------

// /api/users/follow?id=${_id}
export const updateFollowStatus = async (req, res, next) => {
  const loginUser_id = req.payload.id;
  const otherUser_id = req.query.id;

  try {
    const loginUser = await User.findById(loginUser_id).exec();
    console.log(
      "loginUser --",
      loginUser._id,
      loginUser.username,
      " -- number of following before - ",
      loginUser.following.length
    );

    const otherUser = await User.findById(otherUser_id).exec();

    console.log(
      "otherUser --",
      otherUser._id,
      otherUser.username,
      " -- number of followers before - ",
      otherUser.followers.length
    );

    if (loginUser.following.includes(otherUser_id)) {
      console.log(
        "Does loginUser currently follow otherUser? -- Y E S --> unfollow!"
      );

      loginUser.following.pull(otherUser_id);
      otherUser.followers.pull(loginUser_id);

      await Promise.all([loginUser.save(), otherUser.save()]);

      console.log(
        "loginUser number of following after - ",
        loginUser.following.length
      );
      console.log(
        "otherUser number of followers after - ",
        otherUser.followers.length
      );

      res.status(200).json({
        success: true,
        message: `loginUser '${loginUser.username}' unfollowed otherUser '${otherUser.username}'`,
      });
    } else if (!loginUser.following.includes(otherUser_id)) {
      console.log(
        "Does loginUser currently follow otherUser? -- N O --> follow!"
      );

      loginUser.following.push(otherUser_id);
      otherUser.followers.push(loginUser_id);

      await Promise.all([loginUser.save(), otherUser.save()]);

      console.log(
        "loginUser number of following after - ",
        loginUser.following.length
      );
      console.log(
        "otherUser number of followers after - ",
        otherUser.followers.length
      );

      res.status(200).json({
        success: true,
        message: `loginUser '${loginUser.username}' followed otherUser '${otherUser.username}'`,
      });
    }
  } catch (err) {
    next(err);
  }
};

//$ updateUser --- user profil data bearbeiten ----------------------------------------------------

export const editUser = async (req, res, next) => {
  const payload_id = req.payload.id;
  console.log("---------------------payload_id", payload_id);

  const {
    username,
    name,
    telephone,
    birthday,
    description,
    job,
    website,
    userId,
  } = req.body;
  console.log("--------------------req.body.userId", req.body.userId);

  try {
    const user = await User.findById(userId).exec();
    const query = { _id: userId };

    if (user) {
      const updateResult = await User.updateOne(query, {
        $set: {
          username,
          name,
          telephone,
          birthday,
          description,
          job,
          website,
        },
      });
      if (updateResult.modifiedCount > 0) {
        const updatedUser = await User.findById(user._id).exec();
        console.log({ updatedUser });
        res.status(201).json({
          success: true,
          message: "user data updated in database",
        });
      } else {
        res.status(404).json({ success: false, message: "user not found" });
      }
    }
  } catch (err) {
    next(err);
  }
};

//$ addImage --- profilbild hochladen oder ändern -------------------------------------------------

export const addImage = async (req, res, next) => {
  // const payload_id = req.payload.id;
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId).exec();
    const query = { _id: userId };

    if (user) {
      // if image already exists in db entry the old one will be deleted first
      if (user.cloudinary_id) {
        const deleteResult = await deleteImage(user.cloudinary_id);
        console.log({ deleteResult });
      }

      try {
        const cloudinaryResult = await uploadImage(req.file.buffer);
        const img = cloudinaryResult.secure_url;
        const cloudinary_id = cloudinaryResult.public_id;

        const updateResult = await User.updateOne(query, {
          $set: {
            img,
            cloudinary_id,
          },
        });
        //

        if (updateResult.modifiedCount > 0) {
          console.log({ updateResult: { result: "ok" } });

          res.status(201).json({
            success: true,
            message: "user img saved to database",
            secure_url: img,
            public_id: cloudinary_id,
          });
        }
        //
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ success: false, message: "img could not be updated" });
      }
      //
    } else {
      res.status(404).json({ success: false, message: "user not found" });
    }
    //
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    res.end();
  } catch (err) {
    next(err);
  }
};
