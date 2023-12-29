import React, { useState } from "react";
import {resetPassword} from "../../../api/user";
import { useParams } from "react-router-dom";
export default function ResetPassword() {
  let { reset_token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const updatePasswordFunction = async () => {
try{        if (newPassword !== confirmNewPassword) {
            alert("Passwords do not match");
        } else {
            const data = {
              passwordResetToken: reset_token,
                newPassword: newPassword,
                confirmNewPassword: confirmNewPassword,
            };
            const response = await resetPassword(data);
            if (response.status === 200){
              alert("Password updated successfully")
              window.location.href = "/login";
            }
            else{
              alert("Error")
            }
            
        }}
        catch (e){
          console.log(e)
        }
    }
    return (
      
        <div className="order-md-1 text-start ">
                
                  <h3 className="mb-3">Reset Password</h3>
          

                  <div className="   ">


                      <div className="mb-3">
                        <label htmlFor="address">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          placeholder="***********"
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter your new password.
                        </div>
                    </div>

                      <div className="mb-3">
                        <label htmlFor="address">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmNewPassword"
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="***********"
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter your new password.
                        </div>
                      </div>
      

                    <button
                      className="w-100 btn btn-warning btn-lg btn-block "
                      type="submit"
                      onClick={(event) => {
                        event.preventDefault();
                        updatePasswordFunction();
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
    );
}