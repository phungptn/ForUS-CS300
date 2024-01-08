import { useState } from "react";
import { Navigate } from "react-router-dom";
import { forgotPassword } from "../../../api/user";
import EmailIcon from '@mui/icons-material/Email';
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState({}); 
  const [isLoading, setLoading] = useState(false);

  const requestReset = async () => {
   try {
    setLoading(true);
    
    const response = await forgotPassword({ username });
    setLoading(false);

    console.log(response);
    if (response.status === 200) {

      setStatus({message:'Email is sent.', level: 'success'});
    } else {
      setStatus({message: response.data.error , level: 'error'});
    }}
    catch (error) {
      console.log(error);
      setLoading(false);
      setStatus({message:error.message, level: 'error'});

    }
  };

  return (
    <div className="">
      <h3 className="text-center mb-4">Forgot Password</h3>
      <div
        className={`alert alert-danger my-2 d-flex align-items-center font-weight-bold ${
          !!status.message && status.level ==='error'  ? "d-block" : "d-none"
        }`}
      >
        <PriorityHighIcon className="me-2"></PriorityHighIcon>
        <div className="">{status.message}</div>


      </div>
      <div
          className={`alert alert-info my-2 d-flex align-items-center font-weight-bold ${
            !!status.message && status.level === 'success'  ? "d-block" : "d-none"
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
        className="w-100 btn btn-lg btn-primary mt-4 d-flex align-items-center justify-content-center"
        type="submit"
        onClick={(event) => {
          event.preventDefault();
          requestReset();
        }}

        disabled={isLoading}
        
      >
          <span className={`spinner-border spinner-border-sm ${isLoading? "d-block" : "d-none"}`}  role="status" aria-hidden="true"  >
    
          </span>
          <p className="mb-0 ms-2">Send Email</p>

      </button>
    </div>
  );
}
