import React from "react";
import { Link } from "react-router";
import { RegularNavLinks } from "~/links/navbar.links";

function Navbar() {
  return (
    <div className="bg-white mx-25 mt-5 shadow-sm rounded-xl flex justify-between items-center p-4 z-50">
      <div>
        <h1 className="text-3xl font-bold text-blue-600">TalentHub</h1>
      </div>
      <div>
        {RegularNavLinks.map((link) => (
          <Link
            to={link.url}
            key={link.name}
            className="mx-4 text-[#5D6D7E] font-medium"
          >
            {link.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center">
        <div className="text-[#5D6D7E] px-4 py-1 rounded-lg cursor-pointer mt-2">
          Sign Up
        </div>
        <div className=" bg-[#1E73BE] text-white px-4 py-1 rounded-lg cursor-pointer mt-2">
          Login
        </div>
      </div>
    </div>
  );
}

export default Navbar;
