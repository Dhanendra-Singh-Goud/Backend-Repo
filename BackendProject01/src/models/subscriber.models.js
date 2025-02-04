import mongoose from 'mongoose'
import { user } from './user.models'

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId, //one who is subscribing
        ref:user
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId, //one to whom "subscriber" is subscribing
        ref:user
    },

},{timestamps:true})

export const Subscriber = mongoose.model("subscriber", subscriptionSchema)