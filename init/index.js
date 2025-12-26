const mongoose=require("mongoose");
const Listing=require("../models/listings");
const initData=require("./data");

main().then(()=>{
    console.log("Connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDb =async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj ,owner: "69412b4e387c03927720e74f"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized....");
}

initDb();