import {ApiResponse} from "../utils/api-response.js";
import {ApiError} from "../utils/api-error.js";
import { asyncHandler } from "../utils/asyncHadler.js";
import { donationForm } from "../models/formDonation.model.js";

const createDonationForm = asyncHandler(async (req, res) => {
    const {
        name,
        quantity,
        email,
        phone,
        address,
        preparedAt,
        picture,
        addtionalNote,
        landmark,
        pickupTime,
        pickupDate,
        } = req.body;
    
        if(!name || !quantity || !email || !phone || !address || !preparedAt || !picture || !pickupTime || !pickupDate ){
            throw new Error("All fields are required");
        }
        const form = await donationForm.create({
            name,
            quantity,
            email,
            phone,
            address,
            preparedAt,
            picture,
            addtionalNote,
            landmark,
            pickupTime,
            pickupDate,
        });

        if(!form){
            throw new ApiError(500, "Something went wrong");
        }

        res.status(201).json(new ApiResponse(201, form,"form created successfully"));

})

export {createDonationForm};