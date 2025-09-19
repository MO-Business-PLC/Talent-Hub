import React from "react";
import { Link } from "react-router";
import { footerLinks, socialLinks } from "~/links/footer.links";
import { links } from "~/root";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="flex m-5 justify-center items-center">
      <footer className="bg-background-dark w-full text-white rounded-2xl py-3  mt-8">
        {/* TOP */}
        <div className=" flex gap-20 p-10 mb-8">
          {/* TOP LEFT */}
          <div className="flex flex-col gap-3">
            <h2 className="text-5xl font-bold">TalentHub</h2>
            <p className="font-light text-sm">
              Call now:{" "}
              <span className="font-semibold text-sm">+251 943416655</span>
            </p>
            <p className=" font-light text-[12px]">
              Bole, Addis Ababa, Ethiopia
            </p>
          </div>
          <div className="flex justify-around w-full">
            {footerLinks.map((section) => (
              <div key={section.main}>
                <h3 className="font-semibold text-[20px] mb-2">
                  {section.main}
                </h3>
                <ul className="space-y-1">
                  {section.links.map((link) => (
                    <Link
                      to={link.url}
                      key={link.name}
                      className="hover:text-white hover:scale-102 transition-all duration-75 block text-gray text-[16px]"
                    >
                      {link.name}
                    </Link>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM */}
        <hr className="bg-white h-[2px]" />
        <div className="my-3 flex flex-col md:flex-row justify-between items-center text-sm px-10">
          <p className="text-background-light">
            @ {year} TalentHub, All rights Reserved
          </p>
          <div className="flex mt-4 md:mt-0">
            {socialLinks.map((social, index) => (
              <Link to={social.url} key={index} className="text-social mx-2">
                <social.icon size={20} />
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
