import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';

const DB_CONNECT = async()=>{
    try{
    const instanceConnection = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`\n Mongoose connected :: DB host !! ${instanceConnection.connection.host}`)
    //connection .host glti se kissi dusre server pr connect ho jao toh isse ptarh konse host pr connect huva
    }catch(error){
        console.log(`ERROR NOT CONNNECTED!! ${error}`)
        process.exit(1)
    }
}

export default DB_CONNECT