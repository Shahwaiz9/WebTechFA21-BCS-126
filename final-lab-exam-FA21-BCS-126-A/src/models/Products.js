const mongoose=require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: 'This field is required.'
    },
    description: {
      type: String,
      required: 'This field is required.'
    },
    email: {
      type: String,
      required: 'This field is required.'
    },
    ingredients: {
      type: Array,
      required: 'This field is required.'
    },
    category: {
      type: String,
      enum: ['Thai', 'American', 'Chinese', 'Mexican', 'Pakistani'],
      required: 'This field is required.'
    },
    image: {
      type: String,
      required: 'This field is required.'
    },
    isFeatured: {
         type: Boolean,
        default: false
    },
        
  });

  productSchema.index({name:'text',description:'text'});
  
module.exports=mongoose.model('Products',productSchema);