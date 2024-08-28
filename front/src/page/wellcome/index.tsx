import "./index.css";
import Button from "../../component/button";
import Heading from "../../component/heading";
import { Link } from "react-router-dom";

export default function WellcomePage() {
  return (
    <div className="wellcome">
      <div>
        <Heading
          title="Hello!"
          description="Welcome to bank app"
          className="wellc"
        />
        <div className="picture"><img src="../../../img/kerfin.png" alt="kerfin" className="kerfin" /></div>
        
      </div>
      <div>
        <Link to="/signup">
          <Button text="Sign Up" className="primary" disabled="" />
        </Link>
        <Link to="/signin">
          <Button text="Sign In" className="white" disabled="" />
        </Link>
      </div>
    </div>
  );
}
