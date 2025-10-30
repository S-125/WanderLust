const mongoose = require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listings.js');

const MONGO_URL='mongodb://localhost:27017/wanderlust';

main().then(() => {
    console.log("MongoDB connected");
})
.catch(err => console.log(err));  

async function main()
{
    await mongoose.connect(MONGO_URL);  
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68f91ae2408df1a9adb2edc7"}));
    await Listing.insertMany(initData.data);

    console.log("data was initialized");
};

initDB();