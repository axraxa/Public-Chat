export const reducer = (state, action) => {
  switch (action.type) {
    case "UpdateChat":
      break;
    case "USER_SIGNED":
      return {
        ...state,
        user: {
          mail: action.payload.email,
          photo: action.payload.picture,
          token: action.payload.currentToken,
          name: action.payload.name,
          status: true,
        },
      };
    case "NEW_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "FETCHED_MESSAGES":
      return {
        ...state,
        messages: [...action.payload.reverse(), ...state.messages],
      };
    case "FIRSTLY_FETCHED_MESSAGES":
      return {
        ...state,
        messages: [...action.payload.reverse()],
      };
    case "USER_LOGOUT":
      return {
        ...state,
        user: {
          photo: "",
          mail: "",
          token: "",
          status: false,
          name: "",
        },
      };
    default:
      return state;
  }
};
