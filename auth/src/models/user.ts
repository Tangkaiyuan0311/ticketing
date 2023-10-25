import mongoose from "mongoose";
import { Password } from "../services/password";

// interface that describe the input structure of a user document
interface userAttrs {
    email: string,
    password: string
}

// interface that tell tsc about structure of a single user document
interface UserDoc extends mongoose.Document {
    email: string,
    password: string
}

// interface that tell tsc about structure of the user model (the model that has been added static method)
interface UserModel extends mongoose.Model<UserDoc> {
    addUser(attrs: userAttrs): UserDoc;
}

// define user schema
const userSchema = new mongoose.Schema<UserDoc>(
    {
        email: {
            type: String, // a String constructor function, var String redeclares a variable with the name String, which will shadow the global String constructor
            required: true
        },
        password: {
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
                delete ret.password;
                delete ret.__v;
                // rename some database dependent property
                ret.id = ret._id; // value of the old property is copied (by value and by referenec) to the new property.
                delete ret._id; // delete the old property
            }
        }
    }
);

//add pre-save hook
//if password field is updated or newly created, hash it
userSchema.pre("save", async function(next){
    // this: document that is about to be saved
    // rehash the password onlf if the password has been updated
    // case: retrieve the doc, uodate only the email, save back to db
    if (this.isModified("password")) {
        const hashedPassword = await Password.toHash(this.get("password"));
        this.set("password", hashedPassword);
    }
    // advances the document/query to the next awaiting middleware
    // next() will immediately proceed to the next step in the process and will not automatically wait for asynchronous functions to be resolved
    next();
    

});

// add static saving functions to your model
// why use it: enforce ts type check for input
userSchema.statics.addUser = (attrs: userAttrs) => {
    return new User(attrs);
};

// compiling our schema into a Model
// The first argument is the singular name of the collection your model is for
// model name: User     collection name: Users
// type param: custom document type and model type
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);


// A model is a class with which we construct documents.




export { User };



