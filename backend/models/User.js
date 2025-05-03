import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            //minlength: 6
        },
        taxNumber: {
            type: String,
            required: true,
            unique: true,
            //minlength: 8,
            //maxlength: 8
        },
        companyName: {
            type: String,
            required: true,
            unique: false
        },
        companyNumber: {
            type: String,
            required: true,
            unique: true,
            //match: [/^[A-Z]{2}-[A-Z]{2}-\d{6}$/, 'Érvénytelen formátum! Pl: AA-BB-123456'],
        },
        headquarters: {
            type: String,
            required: true,
        },
        balance: {
            type: Number,
            required: false,
            default: 15000,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        roles:{
            type: [Schema.Types.ObjectId],
            required: true,
            ref: "Role"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', userSchema);