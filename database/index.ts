import mongoose from "mongoose";

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}${process.env.ATLAS_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=AtlasCluster`).then(() => {
    console.log('Connected to MongoDB');
});

const db = mongoose.connection;


export default db;



