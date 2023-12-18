// import "./profile.css";
import React, { useState } from "react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
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
      <div className="py-5 container bg-info rounded-3 shadow-sm">
        <div class="bd-example-snippet bd-code-snippet">
          <div class="bd-example m-0 border-0">
            <nav>
              <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                <button
                  class={`nav-link ${activeTab === "profile" ? "active" : ""} `}
                  id="nav-home-tab"
                  onClick={() => handleTabClick("profile")}
                >
                  Profile
                </button>

                <button
                  class={`nav-link ${activeTab === "password" ? "active" : ""}`}
                  id="nav-password-tab"
                  onClick={() => handleTabClick("password")}
                >
                  Manage Password
                </button>
              </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
              <div
                class={`tab-pane fade ${
                  activeTab === "profile" ? "show active" : ""
                }`}
                id="nav-profile"
                role="tabpanel"
                aria-labelledby="nav-profile-tab"
              >
                <div className="order-md-1 text-start">
                  <h1 className="mb-3 text-white">Profile</h1>
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
                        {/* <div className="invalid-feedback">
                    Please enter a valid email address for shipping updates.
                  </div> */}
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
                    <div className="row">
                      <div className="col-md-5 mb-3">
                        <label htmlFor="country">Country</label>
                        <select
                          className="custom-select d-block w-100"
                          id="country"
                          required
                        >
                          <option value>Choose...</option>
                          <option>United States</option>
                        </select>
                        <div className="invalid-feedback">
                          Please select a valid country.
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="state">State</label>
                        <select
                          className="custom-select d-block w-100"
                          id="state"
                          required
                        >
                          <option value>Choose...</option>
                          <option>California</option>
                        </select>
                        <div className="invalid-feedback">
                          Please provide a valid state.
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label htmlFor="zip">Zip</label>
                        <input
                          type="text"
                          className="form-control"
                          id="zip"
                          placeholder
                          required
                        />
                        <div className="invalid-feedback">
                          Zip code required.
                        </div>
                      </div>
                    </div>
                    <hr className="mb-4" />
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="same-address"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="same-address"
                      >
                        Shipping address is the same as my billing address
                      </label>
                    </div>
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="save-info"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="save-info"
                      >
                        Save this information for next time
                      </label>
                    </div>
                    <hr className="mb-4" />
                    <h4 className="mb-3">Payment</h4>
                    <div className="d-block my-3">
                      <div className="custom-control custom-radio">
                        <input
                          id="credit"
                          name="paymentMethod"
                          type="radio"
                          className="custom-control-input"
                          defaultChecked
                          required
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="credit"
                        >
                          Credit card
                        </label>
                      </div>
                      <div className="custom-control custom-radio">
                        <input
                          id="debit"
                          name="paymentMethod"
                          type="radio"
                          className="custom-control-input"
                          required
                        />
                        <label className="custom-control-label" htmlFor="debit">
                          Debit card
                        </label>
                      </div>
                      <div className="custom-control custom-radio">
                        <input
                          id="paypal"
                          name="paymentMethod"
                          type="radio"
                          className="custom-control-input"
                          required
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="paypal"
                        >
                          Paypal
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="cc-name">Name on card</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-name"
                          placeholder
                          required
                        />
                        <small className="text-muted">
                          Full name as displayed on card
                        </small>
                        <div className="invalid-feedback">
                          Name on card is required
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="cc-number">Credit card number</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-number"
                          placeholder
                          required
                        />
                        <div className="invalid-feedback">
                          Credit card number is required
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <label htmlFor="cc-expiration">Expiration</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-expiration"
                          placeholder
                          required
                        />
                        <div className="invalid-feedback">
                          Expiration date required
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label htmlFor="cc-expiration">CVV</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cc-cvv"
                          placeholder
                          required
                        />
                        <div className="invalid-feedback">
                          Security code required
                        </div>
                      </div>
                    </div>
                    <hr className="mb-4" />
                    <button
                      className="btn btn-warning btn-lg btn-block "
                      type="submit"
                    >
                      Update
                    </button>
                  </form>
                </div>
              </div>
              <div
                class={`tab-pane fade ${
                  activeTab === "password" ? "show active" : ""
                }`}
                id="nav-password"
                role="tabpanel"
                aria-labelledby="nav-password-tab"
              >
                {/* Profile tab content */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bootstrap core JavaScript
          ================================================== */}
      {/* Placed at the end of the document so the pages load faster */}
    </div>
  );
}
