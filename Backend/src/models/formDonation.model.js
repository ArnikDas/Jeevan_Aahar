import mongoose, { Schema } from "mongoose";

const donationFormSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
            preparedAt : {
                type: Date,
                default: Date.now,
            },
        picture :{
            type: String,
            required: true,
        },
        addtionalNote:{
            type: String,
        },
        landmark:{
            type: String,
        },
        pickupTime:{
            type: Date,
            required: true
        },
        pickupDate:{
            type: Date,
            required: true
        },
    },
    {
        timestamps: true,

    }
);

export const donationForm = mongoose.model("forms", donationFormSchema);