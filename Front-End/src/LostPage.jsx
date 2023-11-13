import { Link } from "react-router-dom";
import "./scss/lostpage.scss";
const LostPage = () => {
  return (
    <div className="centered">
      <Link to={"/"} className="LostButton">
        You are Lost Buddy!
      </Link>
    </div>
  );
};

export default LostPage;
