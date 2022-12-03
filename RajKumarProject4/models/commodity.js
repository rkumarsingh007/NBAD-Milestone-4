const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commoditySchema = new Schema({
    name: {type: String, required: [true, 'Title is required']},
    category: {type: String, required: [true, 'Topic is required']},
    details: {type: String, required: [true, 'Detail is required'], 
              minLength: [10, 'The detail should have at least 10 characters']},
    seller: {type: Schema.Types.ObjectId, ref: 'User'},
    sellerName:{type: String, required: [true, 'Title is required']},
    location: {type: String, required: [true, 'Location is required']},
    date: {type: String, required: [true, 'Date is required']},
    // startTime: {type: String, required: [true, 'Start time is required']},
    // endTime: {type: String, required: [true, 'End Time is required']},
    image: {type: String, required: [true, 'Image is required']},
},
{timestamps: true}
);

//collection name : commodities
module.exports = mongoose.model('commodities', commoditySchema);

