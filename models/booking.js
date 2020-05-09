const mongoose = require('mongoose') 

const Scheama = mongoose.Schema;

const bookingSchema = new Scheama({
    event: {
        type: Scheama.Types.ObjectId,
        ref :'Event'
    },
    user:{
        type: Scheama.Types.ObjectId,
        ref: 'User'
    },

},
{
            timestamps: true
})

module.exports = mongoose.model('Booking', bookingSchema)