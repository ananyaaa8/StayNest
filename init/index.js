const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/staynest');
}

const seedDB = async () => {

  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "6812508e68eb7ca101f654d2" }));
  await Listing.insertMany(initdata.data);
  console.log('All listings inserted successfully!');
};

seedDB();
