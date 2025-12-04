// constants/EMPLOYEE_VALIDATION.js (Recommended file path)

const EMPLOYEE_MAX_LENGTHS = {
    // Basic identification fields
    USER_NAME: 50,    // Mongoose: userName
    FULL_NAME: 100,   // Mongoose: fullName
    EMAIL: 100,       // Mongoose: email

    // Contact and physical location
    PHONE: 15,        // Mongoose: phone (Max length for international numbers)
    ADDRESS: 255,     // Mongoose: address (Standard limit for a short text field)

    // Other fields (Designation is usually controlled by an enum/select)
    DESIGNATION: 50,  // If the select field is ever replaced by a text input
    
    // Default system fields (if you track these)
    PASSWORD: 100,    // Max length for storing the hashed password string
};

// Freeze the object to prevent any runtime modification, ensuring immutability.
Object.freeze(EMPLOYEE_MAX_LENGTHS);

export default EMPLOYEE_MAX_LENGTHS;