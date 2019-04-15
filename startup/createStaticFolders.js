const folderCreator = require('../utils/folderCreator');
const constants = require('../constants');

module.exports = async function createStaticDirectories() {
  const errors = [];

  // static folder
  let err = await folderCreator('./static');
  if (err) errors.push(err);

  // images folder in static
  err = await folderCreator('./static/images');
  if (err) errors.push(err);

  // catalogues folder for images
  err = await folderCreator(`.${constants.CATALOGUE_IMAGES_URL}`);
  if (err) errors.push(err);

  // categories folder for images
  err = await folderCreator(`.${constants.CATEGORY_IMAGES_URL}`);
  if (err) errors.push(err);

  // subcategories folder for images
  err = await folderCreator(`.${constants.SUBCATEGORY_IMAGES_URL}`);
  if (err) errors.push(err);

  // products folder for images
  err = await folderCreator(`.${constants.PRODUCT_IMAGES_URL}`);
  if (err) errors.push(err);

  // for homepage carousel images
  err = await folderCreator(`.${constants.HOMEPAGE_CAROUSEL_URL}`);
  if (err) errors.push(err);

  // for shipping and payment images
  err = await folderCreator(`.${constants.SHIPPING_AND_PAYMENT_URL}`);
  if (err) errors.push(err);

  // for partners
  err = await folderCreator(`.${constants.PARTNERS_URL}`);
  if (err) errors.push(err);

  if (errors.length > 0) {
    // TODO: log the error, stop the server

    throw new Error('COULD NOT CREATE STATIC FOLDERS!!');
  }

  return undefined;
};
