/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
const fs = require('fs');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');
const { Catalogue, validateCatalogue } = require('../models/Cataluge');
const { Product } = require('../models/Product');
const {
  DEFAULT_CATALOGUE_IMAGE,
  CATALOGUE_IMAGES_URL,
} = require('../constants');

// get all catalogues
router.get('/', async (req, res) => {
  const catalogues = await Catalogue.find()
    .populate('categories');

  res.send(catalogues);
});

// get catalogue by id
router.get('/:id', validateObjectId, async (req, res) => {
  const catalogue = await Catalogue.findById(req.params.id)
    .populate('categories');
  if (!catalogue) return res.status(400).send('Catalogue with given id was not found.');

  return res.send(catalogue);
});

router.post('/', [auth, adminAuth], async (req, res) => {
  const values = req.body;
  values.image = DEFAULT_CATALOGUE_IMAGE;
  const { error } = validateCatalogue(values);
  if (error) return res.status(400).send(error.details[0].message);

  const catalogue = new Catalogue({
    title: values.title,
    image: values.image,
    categories: [],
  });

  await catalogue.save();

  return res.send(catalogue);
});

// upload image for a catalogue
router.put('/image/:id', [auth, adminAuth], async (req, res, next) => {
  // uploaded image
  const imageFile = req.files.image;
  // console.log(req.files);

  // create unique path for uploaded image
  const path = `${CATALOGUE_IMAGES_URL}/${Date.now()}_${imageFile.name}`;

  const catalogue = await Catalogue.findOneAndUpdate({ _id: req.params.id }, {
    $set: {
      image: path,
    },
  });
  if (!catalogue) return res.status(400).send('Catalogue with given id was not found.');

  if (catalogue.image) await deleteAnImage(`.${catalogue.image}`);

  // move file to the path (./static/* directory)
  return imageFile.mv(`.${path}`, async (err) => {
    if (err) {
      const error = new Error('Internal server error. Could not upload image.');
      error.status = 500;
      return next(err);
    }

    // respond the updated catalogue
    catalogue.image = path;
    return res.send(catalogue);
  });
});

router.put('/:id', [auth, adminAuth], validateObjectId, async (req, res) => {
  const values = req.body;
  const { error } = validateCatalogue(values);
  if (error) return res.status(400).send(error.details[0].message);

  // 1 - CatalogueProduct -> CatalogueCagetoryProduct
  // 2 - CatalogueProduct -> CatalogueCategorySubcategoryProduct
  // 3 - CatalogueCategoryProduct - CatalogueCategorySubcategoryProduct

  const catalogue = await Catalogue.findOneAndUpdate({ _id: req.params.id }, {
    title: values.title,
    categories: values.categories || [],
  }, { new: true });

  if (!catalogue) return res.status(400).send('Catalogue with given id was not found.');

  return res.send(catalogue);
});

router.delete('/:id', [auth, adminAuth], validateObjectId, async (req, res) => {
  const catalogue = await Catalogue.findOneAndRemove({ _id: req.params.id }, { new: true });
  if (!catalogue) return res.status(400).send('Catalogue with given id was not found.');

  const productIds = [];

  const {categories} = catalogue;

  // if catalogue has categories, browse them
  if (categories && categories.length > 0) {
    for (let i = 0; i < categories.length; i += 1) {
      // if a category has subcategories, then products reference subcategories
      if (categories[i].subcategories) {
        for (let j = 0; j < categories[i].subcategories.length; j += 1) {
          productIds.push(categories[i].subcategories[j]._id);
        }
      } else {
        // otherwise products reference a category
        productIds.push(categories[i]._id);
      }
    }
  } else {
    productIds.push(catalogue._id);
  }

  await Product.deleteMany({ _id: { $in: { productIds } } });

  return res.send(`DELETED: ${catalogue}`);
});

// deletes a file if it's not the default image or icon
function deleteAnImage(path) {
  return new Promise((resolve) => {
    if (path === DEFAULT_CATALOGUE_IMAGE) resolve();
    // delete image
    fs.unlink(path, (err) => {
      if (err) {
        // TODO: log the error
        // logger.log('error',
        //  `Could not delete image in /catalogues/deleteAnImage. path: ${path}`,
        //  err);
        console.log(new Error(`Could not delete an image: ${path}`));
        console.log(err);
      }
      resolve();
    });
  });
}

module.exports = router;
