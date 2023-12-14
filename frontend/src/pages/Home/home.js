import React from "react";
import { instance } from "../../api/config";

export default function Home() {

    return (
        <div>
            <h1>Home</h1>
            <button
            className="btn btn-primary w-100 py-2"
            type="submit"
            onClick={() => {
              instance.post("/users/logout");
              window.location.href = "/login";
            }}
          >
            Sign out
          </button>
        </div>
    );
}