import { useState } from "react";
import { Navigate } from "react-router-dom";
import { forgotPassword } from "../../../api/user";
import EmailIcon from '@mui/icons-material/Email';
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [valid, setValid] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const requestReset = async () => {
    const response = await forgotPassword({ username });
    console.log(response);
    if (response.status === 200) {
      setEmailSent(true);
      setValid(true);
    } else {
      setValid(false);
      setEmailSent(false);
    }
  };

  return (
    <div className="">
      <h3 className="text-center mb-4">Forgot Password</h3>
      <div
        className={`alert alert-danger my-2 d-flex align-items-center font-weight-bold ${
          !valid ? "d-block" : "d-none"
        }`}
      >
        <PriorityHighIcon className="me-2"></PriorityHighIcon>
        <div className="">Invalid Username</div>


      </div>
      <div
          className={`alert alert-info my-2 d-flex align-items-center font-weight-bold ${
            emailSent ? "d-block" : "d-none"
          }`}
        >
          <EmailIcon className="me-2"></EmailIcon>
          <div className="">Email is sent.</div>
        </div>
    
      <p className="text-start  mb-4 ">
        To reset your password, submit your username below. If we can find you,
        an email will be sent to your email address, with instructions how to get
        access again.
      </p>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="floatingInput"
          placeholder="username"
          onChange={(event) => setUsername(event.target.value)}
        />
        <label htmlFor="floatingInput">Username</label>
      </div>

      <button
        className="w-100 btn btn-lg btn-primary mt-4"
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          requestReset();
        }}
      >
        Reset Password
      </button>
    </div>
  );
}
