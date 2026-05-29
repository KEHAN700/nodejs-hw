import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createHttpError(400, 'No file'));
    }

    const uploadedImage = await saveFileToCloudinary(req.file.buffer);

    await User.updateOne(
      { _id: req.user._id },
      { avatar: uploadedImage.secure_url },
    );

    res.status(200).json({
      url: uploadedImage.secure_url,
    });
  } catch (error) {
    next(error);
  }
};
