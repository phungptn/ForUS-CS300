import { useState } from "react";
import { Navigate } from "react-router-dom";
import { forgotPassword } from "../../../api/login";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const requestReset = async () => {
    const response = await forgotPassword({ username });
    console.log(response);
    if (response.status === 200) {
      alert("Email sent");
    } else {
      alert("Error");
    }
  };

  return (
    <div className="">

      <h3 className="text-center mb-4">Forgot Password</h3>
      <p className="text-start  mb-4 ">
        To reset your password, submit your username below. If we can find you,
        an email will sent to your email address, with instructions how
        to get access again.
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
