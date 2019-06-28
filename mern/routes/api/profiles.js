import express from "express";
import { check, validationResult } from "express-validator/check";

import auth from "../../middleware/auth";
import Profile from "../../models/Profile";
import User from "../../models/User";

const router = express.Router();

// @route   GET api/profiles/me
// @desc    Get current user profile
// @access  public
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: `This fella ain't existing` });
    }

    return res.json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).send("We poo the profiles");
  }
});

// @route   POST api/profiles
// @desc    Create or update profile
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills are required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    const profileFields = {
      social: {}
    };
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) profileFields.skills = skills;
    if (youtube) profileFields.youtube = youtube;
    if (facebook) profileFields.facebook = facebook;
    if (twitter) profileFields.twitter = twitter;
    if (instagram) profileFields.instagram = instagram;
    if (linkedin) profileFields.linkedin = linkedin;

    // Skills
    if (skills) {
      profileFields.skills = skills.split(",").map(elem => elem.trim());
    }

    // Social
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          {
            $set: profileFields
          },
          { new: true }
        );
      } else {
        profile = new Profile(profileFields);
        await profile.save();
      }
      return res.json(profile);
    } catch (error) {
      console.error(error);
      return res.status(500).send("We poo the profiles edition");
    }
  }
);

// @route   GET api/profiles
// @desc    Get all users
// @access  public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["avatar", "name"]);
    return res.json(profiles);
  } catch (error) {
    console.error(error);
    return res.status(500).send("We poo the profiles listing");
  }
});

// @route   GET api/profiles/:user_id
// @desc    Get profile by user id
// @access  public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["avatar", "name"]);

    if (!profile) {
      return res.status(400).json({ msg: "This fella has no profile" });
    }

    return res.json(profile);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "This fella has no profile" });
    }
    return res.status(500).send("We poo the profiles listing");
  }
});

export default router;
