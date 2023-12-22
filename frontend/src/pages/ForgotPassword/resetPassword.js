export default function ResetPassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const updatePasswordFunction = async () => {
        if (newPassword !== confirmNewPassword) {
            alert("Passwords do not match");
        } else {
            const data = {
                currentPassword,
                newPassword,
            };
            const response = await updatePassword(data);
            if (response.status === 200) {
                alert("Password updated successfully");
            } else {
                alert("Password update failed");
            }
        }
    }
    return (
        <div className="order-md-1 text-start ">
                  <h1 className="mb-3 text-white">Manage Password</h1>

                  <p>
                    In order to change your password, you will need to provide
                    your current password, as well as your new password and a
                    confirmation of your new password.
                  </p>

                  <div className="   ">
                    <div className="mb-3 row ">
                      <div className="mb-3 col-md-4 "></div>
                      <div className="mb-3 col-md-4  ">
                        <label htmlFor="address">Current Password</label>
                        <input
                          type="password"
                          className="form-control "
                          id="currentPassword"
                          placeholder="***********"
                          onChange={(e) => setCurrentPassword(e.target.value)} 
                          required
                        />
                        <div className="invalid-feedback">
                          Please enter your current password.
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 row ">
                      <div className="mb-3 col-md-4 "></div>
                      <div className="mb-3 col-md-4">
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
                    </div>

                    <div className="mb-3 row ">
                      <div className="mb-3 col-md-4 "></div>

                      <div className="mb-3 col-md-4">
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
                    </div>

                    <button
                      className="btn btn-warning btn-lg btn-block "
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