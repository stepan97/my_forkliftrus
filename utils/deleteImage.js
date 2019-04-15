const { unlink } = require('fs');
const {
  DEFAULT_CATALOGUE_IMAGE,
  DEFAULT_CATEGORY_IMAGE,
  DEFAULT_SUBCATEGORY_IMAGE,
  DEFAULT_PRODUCT_IMAGE,
} = require('../constants');

const defaultPaths = [
  DEFAULT_CATALOGUE_IMAGE,
  DEFAULT_CATEGORY_IMAGE,
  DEFAULT_SUBCATEGORY_IMAGE,
  DEFAULT_PRODUCT_IMAGE];

module.exports = function deleteImage(path) {
  if (defaultPaths.includes(path)) return;

  unlink(path, (err) => {
    // file does not exist
    if (err.code !== 'ENOENT') {
      // TODO: log the error ?
    }
  });
};
