export const backendRoute = {
  // User Auth Routes
  USER_LOGIN: '/user/login',
  USER_SIGNUP: '/user/signUp',
  USER_FORGOT_PASSWORD: '/user/forgotPassword',
  USER_VERIFY_FORGOT_PASSWORD: '/user/verifyForgotEmail',
  USER_RESET_PASSWORD: '/user/changeForgotPassword',
  USER_VERIFY_EMAIL: '/user/emailVerification',
  CHANGE_PASSWORD: '/user/changePassword',

  // API Key Routes
  LIST_API_KEYS: '/apikey/listAPIKey',
  GENERATE_API_KEY: '/apikey/generateAPIKey',
  DELETE_API_KEY: '/apikey/deleteAPIKey/',

  // Chatbot Routes
  CHATBOT_LIST: '/chatbot/listChatBot',
  CREATE_CHATBOT: '/chatbot/createChatBot',
  GET_CHATBOT_BY_ID: '/chatbot/getById/',
  UPDATE_CHATBOT: '/chatbot/updateChatBot',
  DELETE_CHATBOT: '/chatbot/deleteChatBot/',
};

export default backendRoute; 