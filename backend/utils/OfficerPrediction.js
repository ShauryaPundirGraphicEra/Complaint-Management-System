// import axios from "axios";
// import { Complaint } from "../model/complain.model.js";
// import { User } from "../model/user.model.js";
// import { asyncHandler } from "./AsyncHandler.js";

// const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
// const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;





// export const predictOfficer = async (complaint) => {
//     console.log(complaint);

//     const officers = await User.find({
//         role: "Officer",
//         isVerified: true,
//     });


//     const prompt = `
//         You are a government complaint assignment assistant.
//         Here is a new complaint:
//         Title: ${complaint.title}
//         Description: ${complaint.description}
//         Category: ${complaint.category}
//         Department: ${complaint.department}
//         Location: ${complaint.location}

//         Here are the verified government officers available to you:

//         ${JSON.stringify(officers)}

//         Based on the complaint relevance,urgency,department, complexity, and officers' workload history, select the officer most suitable to handle this complaint. Only return the officer's ID.
//         `;


//     const response = await axios.post(
//         HUGGINGFACE_API_URL,
//         { inputs: prompt },
//         {
//             headers: {
//                 Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
//                 "Content-Type": "application/json"
//             }
//         }
//     );
//     conole.log("*************************************")
//     console.log(response);
//     // LLM should return only the officer ID
//     const predictedOfficerId = response.data?.generated_text?.trim();
//     return predictedOfficerId;
// };










import axios from "axios";
import { User } from "../model/user.model.js";


const HUGGINGFACE_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

export const predictOfficer = async (complaint) => {
    try {
        console.log(`Assigning officer for: ${complaint.title}`);

        const officers = await User.find({
            role: "Officer",
            isVerified: true,
        });

        if (!officers || officers.length === 0) {
            console.log("No verified officers available for assignment.");
            return null;
        }

        const userPrompt = `New complaint:
        Title: ${complaint.title}
        Description: ${complaint.description}
        Category: ${complaint.category}
        Department: ${complaint.department}
        Location: ${complaint.location}

        Available officers:
        ${JSON.stringify(officers)}
        
        Based on relevance, department, and location, return ONLY the exact ID string of the most suitable officer.`;

        // Using the new standard Messages payload format
        const response = await axios.post(
            HUGGINGFACE_API_URL,
            {
                model: "Qwen/Qwen2.5-7B-Instruct", // Note: The model name moves into the body!
                messages: [
                    { 
                        // System prompts are great for strict instructions
                        role: "system", 
                        content: "You are a precision government assignment assistant. You must return ONLY the MongoDB ObjectId of the selected officer. No explanations, no markdown, no other text." 
                    },
                    { 
                        role: "user", 
                        content: userPrompt 
                    }
                ],
                max_tokens: 50,
                temperature: 0.1 // Keeping temperature low so the AI doesn't get "creative" and add extra text
            },
            {
                headers: {
                    Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
                    "Content-Type": "application/json"
                },
                timeout:10000
            }
        );

        console.log("*************************************");
        
        // The response format changes slightly with the new chat/completions endpoint
        const predictedOfficerId = response.data.choices[0]?.message?.content?.trim();
        console.log("Extracted ID:", predictedOfficerId);
        
        return predictedOfficerId;

    } catch (error) {
        console.error("Prediction Error:", error.response?.data || error.message);
        throw error;
    }
};