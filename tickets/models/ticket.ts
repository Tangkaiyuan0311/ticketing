import mongoose from "mongoose";

// interface that describe the input structure of a ticket document
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// interface that tell tsc about structure of a single ticket document
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

// interface that tell tsc about structure of the Ticket model (the model that has been added static method)
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

// define user schema
const ticketSchema = new mongoose.Schema<TicketDoc>(
    {
        title:{
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        userId: {
            type: String,
            required: true
        }
    },
    // specify the schema option
    {
        // view layer code, not very suitable
        // define how the document is tansmitted
        // define a transform function that gets called whenever the document is converted to JSON
        // deleting or modifying properties before output
        toJSON: {
            // doc: The document being converted. It provides access to the original Mongoose document that is calling .toJSON() or is otherwise getting serialized.
            // ret: The plain JavaScript object that represents the document, which will be returned as the result of the serialization. 
            // modify ret as necessary
            transform(doc, ret) {
                // remove unnecessary property from the stringified document
                // rename some database dependent property
                ret.id = ret._id; // value of the old property is copied (by value and by referenec) to the new property.
                delete ret._id; // delete the old property
                delete ret.__v;
            }
        }
    }
);

// add static saving functions to your model
// why use it: enforce ts type check for input
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

// compiling our schema into a Model
// The first argument is the singular name of the collection your model is for
// model name: User     collection name: Users
// type param: custom document type and model type
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);


// A model is a class with which we construct documents.




export { Ticket };



