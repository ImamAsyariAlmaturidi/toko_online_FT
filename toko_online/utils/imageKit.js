const ImageKit = require("imagekit");
const dotenv = require("dotenv");
dotenv.config();
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Uploads an image to ImageKit.
 * @param {Buffer | string} file - The file to upload (Buffer or base64 string).
 * @param {string} fileName - The name of the file.
 * @param {Object} [options] - Additional upload options.
 * @returns {Promise<Object>} - The uploaded file details.
 */
const uploadImage = async (file, fileName, options = {}) => {
  try {
    const response = await imageKit.upload({
      file,
      fileName,
      ...options,
    });
    return response;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Generates a URL for an image with transformations.
 * @param {string} path - The path of the image.
 * @param {Object} [transformation] - Transformation options.
 * @returns {string} - The transformed image URL.
 */
const generateImageUrl = (path, transformation = {}) => {
  return imageKit.url({
    path,
    transformation,
  });
};

module.exports = {
  uploadImage,
  generateImageUrl,
};
