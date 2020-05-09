const Event = require('../../models/events');
const User = require('../../models/user')
const {
    transformEvent
} = require('./merge')


module.exports = {
    events: async () => {
        try {

            // populate - go to DB with the _id and by the ref (the type of the object) it finds the right object
            const events = await Event.find()


            return events.map(event => {
                //    return {...event._doc, _id: event._doc._id.toString()}; 
                //same as: 
                return transformEvent(event)
            })
        } catch (e) {
            throw e;
        }
    },
    createEvent: async (args, req) => {

        if(!req.isAuth){
            throw new Error('Unauthenticated!'); 
        }

        let createdEvent;

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        try {

            const retEvent = await event.save()
            createdEvent = transformEvent(retEvent)


            // start block of adding event to user 
            const userFromId = await User.findById('5ea837b72fc38672f860321a');
            console.log(userFromId)
            if (!userFromId) {
                throw new Error('User does not exist');
            }
            userFromId.createdEvents.push(event);

            userFromId.save();
            // end block of adding event to user 

            return createdEvent;

        } catch (e) {
            throw e
        }
    }
}