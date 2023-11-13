import { createContext, useContext, useReducer } from "react";
import { reducer } from "./Reducer";
const MyContext = createContext();

const defaultState = {
  user: {
    photo: "",
    mail: "",
    token: "",
    status: false,
    name: "",
  },
  messages: [],
};

function MyProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return (
    <MyContext.Provider value={{ state, dispatch }}>
      {children}
    </MyContext.Provider>
  );
}
export function useMyContext() {
  return useContext(MyContext);
}

export { MyProvider };
