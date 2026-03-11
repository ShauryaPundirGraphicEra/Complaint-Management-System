const mongoose= require("mongoose")
const Schema=mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const comment=new Schema({
    postId: { type: ObjectId, ref: 'Post' },
    userId: { type: ObjectId, ref: 'User' },
    text: { type: String, required: true },
    upVotes: [{ type: ObjectId, ref: 'User' }],
    upvoteCount: { type: Number, default: 0 },
    downVotes:[{ type: ObjectId, ref: 'User' }],
    downCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});


const Comment=mongoose.model('Comment',comment);

module.exports={
    Comment
};