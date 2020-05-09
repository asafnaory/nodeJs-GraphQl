const { dateToStringHelper } = require('../../helpers/date');
const Event = require('../../models/events')
const User = require('../../models/user')

const user = async userId => {
    try{
        const userRet =  await User.findById(userId)

        return {
            ...userRet._doc,
            _id: userRet.id,
            createdEvents: events.bind(this, userRet._doc.createdEvents)
        }

    }
    catch(e){
        return e; 
    }
}


const events = async eventIds => {
    try{
        const events = await Event.find({_id: { $in: eventIds}});
        
        return events.map (event => {
            return transformEvent(event)
        });
    }
    catch(e){
        return e; 
    }
} 

const singleEvent = async eventId =>{
    try{
        const event = await Event.findById(eventId)
        return transformEvent(event)
    }catch(e){

    }
}

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toDateString(),
        // graphQL can return functions as return values because of the graphQL parser ->
        // -> that executes that function and returns the return value 
        creator: user.bind(this, event.creator)
    };
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToStringHelper(booking._doc.createdAt),
        updatedAt: dateToStringHelper(booking._doc.updatedAt)
    }
}


exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;