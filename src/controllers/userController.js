import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createHttpError(400, 'No file'));
    }

    const uploadedImage = await saveFileToCloudinary(req.file.buffer, req.user._id);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: uploadedImage.secure_url },
      { returnDocument: 'after' },
    );

    res.status(200).json({
      url: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};
