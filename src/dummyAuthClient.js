export const dummyAuthClient = {
  start: async ({ phoneNumber, password, phoneCode, onError }) => {
    if (
      typeof phoneNumber !== "function" ||
      typeof password !== "function" ||
      typeof phoneCode !== "function" ||
      typeof onError !== "function"
    ) {
      throw new Error("Missing required parameters");
    }

    try {
      // Resolve values from the functions
      const resolvedPhoneNumber = await phoneNumber();
      const resolvedPassword = await password();
      if (resolvedPhoneNumber === "12345" && resolvedPassword === "password") {
        console.log("Code sent to user");
      } else {
        throw new Error("Invalid phone number or password");
      }
      const resolvedPhoneCode = await phoneCode();

      if (resolvedPhoneCode === "123456") {
        return true; // Simulate successful login
      } else {
        throw new Error("Invalid code. Please try again.");
      }
    } catch (error) {
      onError(error);
      throw error;
    }
  },
  session: {
    save: () => "dummy_session_string", // Simulate saving session
  },
  sendMessage: async (recipient, { message }) => {
    console.log(`Message sent to ${recipient}: ${message}`);
  },
};
