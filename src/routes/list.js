const {extractList} = require("../extract");

module.exports = async ({context,enqueue}) => {
  await extractList({context,enqueue}) 
};
