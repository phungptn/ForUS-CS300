import { signup } from "../../../api/signup";

import { setCookie } from "../../../utils/setCookie";
import axios from "axios";
import { Input, Ripple, initMDB } from "mdb-ui-kit";
import "./signup.css";

initMDB({ Input, Ripple });

export default function SignUp() {
  return (
    <div>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="description" content />
      <meta name="author" content />
      <link rel="icon" href="/docs/4.0/assets/img/favicons/favicon.ico" />
      <title>Checkout example for Bootstrap</title>
      <link
        rel="canonical"
        href="https://getbootstrap.com/docs/4.0/examples/checkout/"
      />
      {/* Bootstrap core CSS */}
      <link href="../../dist/css/bootstrap.min.css" rel="stylesheet" />
      {/* Custom styles for this template */}
      <link href="form-validation.css" rel="stylesheet" />
      <div className="py-5 container">
        <div className="order-md-1 text-start">
          <h1 className="mb-3 ">Register Form</h1>
          <form className="needs-validation" noValidate>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName">Full name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder
                  required
                />
                <div className="invalid-feedback">
                  Valid first name is required.
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="lastName">Student ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder
                  required
                />
                <div className="invalid-feedback">
                  Valid last name is required.
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">@</span>
                </div>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="you@example.com"
                  required
                />
                <div className="invalid-feedback">
                  Please enter a valid email address for shipping updates.
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="address">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="**********"
                required
              />
              <div className="invalid-feedback">
                Please enter your shipping address.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="1234 Main St"
                required
              />
              <div className="invalid-feedback">
                Please enter your shipping address.
              </div>
            </div>
            <div class="mb-3">
              <label for="formFile" class="form-label">
                Load your avatar
              </label>
              <input class="form-control" type="file" id="formFile"></input>
            </div>
            <div className="row">
              <div className="col-md-5 mb-3">
                <label htmlFor="role">Role</label>
                <select
                  className="custom-select d-block w-100"
                  id="role"
                  required
                >
                  <option value>Choose...</option>
                  <option>Admin</option>
                  <option>User</option>
                </select>
                <div className="invalid-feedback">
                  Please select a valid country.
                </div>
              </div>
             
            </div>
            <hr className="mb-4" />

            <h4 className="mb-3">More information</h4>
            <div className="mb-3">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                placeholder="Your hobbies, your favorite food, etc."
                required
              />
              <div className="invalid-feedback">
                Please enter your description.
              </div>
            </div>
            <hr className="mb-4" />
            <button className="btn btn-primary btn-lg btn-block" type="submit">
                Register
            </button>
          </form>
        </div>

        <footer className="my-5 pt-5 text-muted text-center text-small">
          <p className="mb-1">© 2017-2018 ForUS</p>
          <ul className="list-inline">
            <li className="list-inline-item">
              <a href="#">Privacy</a>
            </li>
            <li className="list-inline-item">
              <a href="#">Terms</a>
            </li>
            <li className="list-inline-item">
              <a href="#">Support</a>
            </li>
          </ul>
        </footer>
      </div>
      {/* Bootstrap core JavaScript
      ================================================== */}
      {/* Placed at the end of the document so the pages load faster */}
    </div>
  );
}
