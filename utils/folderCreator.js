const fs = require('fs');

module.exports = function folderCreator(path, folderName) {
  return new Promise((resolve) => {
    const newPath = folderName ? `${path}/${folderName}` : path;

    fs.mkdir(newPath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') return resolve(new Error(`Path ${path} does not exist.`));
        if (err.code === 'EEXIST') return resolve(undefined);
        // TODO: log the error
        console.log(err);
        return resolve(new Error(`Unable to create ${newPath} folder.`));
      }

      return resolve(undefined);
    });
  });
};
