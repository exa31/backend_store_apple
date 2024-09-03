import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/iphonestore').then(() => {
    console.log('Connected to MongoDB');
});

const db = mongoose.connection;


export default db;



