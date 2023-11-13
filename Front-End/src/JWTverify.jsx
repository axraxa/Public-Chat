import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMyContext } from "./Context";
import GoogleButton from "react-google-button";

const JWTverify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { dispatch, state } = useMyContext();
  useEffect(() => {
    const currentToken = token.replace(/jemaliBidzia/g, ".");
    axios
      .get(`http://127.0.0.1:3000/oauth/jwtverify`, {
        headers: { Authorization: currentToken },
      })
      .then((res) => {
        const user = res.data?.decoded?.data;
        if (user) {
          dispatch({ type: "USER_SIGNED", payload: { ...user, currentToken } });
          localStorage.setItem(
            "User",
            JSON.stringify({ ...user, currentToken }),
          );
          navigate("/");
          return;
        }
        localStorage.removeItem("User");
        navigate("/");
        return;
      })
      .catch((err) => {
        console.log(err);
        navigate("/");
      });
  }, []);

  return (
    <div className="container">
      <div className="chatContainer">
        <div className="mainSection">
        </div>
        <form className="typingSection" onSubmit={(e) => e.preventDefault(e)}>
          <GoogleButton />
        </form>
      </div>
    </div>
  );
};

export default JWTverify;
