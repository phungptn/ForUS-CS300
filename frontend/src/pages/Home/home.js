import React from "react";

export default function Home() {

    return (
        <div>
            <h1>Home</h1>
            <button
            className="btn btn-primary w-100 py-2"
            type="submit"
            onClick={() => {
            //   clear cookies
            document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/login";
            }}
          >
            Sign out
          </button>
        </div>
    );
}