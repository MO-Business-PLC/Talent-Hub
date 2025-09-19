import React from "react";
import { Link } from "react-router";
import { footerLinks, socialLinks } from "~/links/footer.links";
// Removed unused import from root.

function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="flex mx-3 sm:mx-5 justify-center items-center">
      <footer className="bg-background-dark w-full text-white rounded-2xl mt-10 py-6 sm:py-8 lg:py-10">
        {/* TOP AREA */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-20 px-6 sm:px-10 lg:px-12 xl:px-16 mb-6 lg:mb-10">
          {/* Brand / Contact */}
          <div className="flex flex-col gap-3 text-center lg:text-left mx-auto lg:mx-0 max-w-xs sm:max-w-sm">
            <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              TalentHub
            </h2>
            <p className="font-light text-xs sm:text-sm">
              Call now: <span className="font-semibold">+251 943416655</span>
            </p>
            <p className="font-light text-[11px] sm:text-[12px] leading-relaxed">
              Bole, Addis Ababa, Ethiopia
            </p>
          </div>
          {/* Links Grid */}
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-8">
              {footerLinks.map((section) => (
                <div key={section.main}>
                  <h3 className="font-semibold text-sm  md:text-[17px] mb-3 tracking-wide uppercase/5">
                    {section.main}
                  </h3>
                  <ul className="space-y-1">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.url}
                          className="block text-gray text-[13px] sm:text-[14px] md:text-[15px] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-background-dark transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="px-6 sm:px-10 lg:px-12 xl:px-16">
          <hr className="border-white/20" />
        </div>

        {/* Bottom Bar */}
        <div className="px-6 sm:px-10 lg:px-12 xl:px-16 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-[11px] sm:text-xs md:text-sm">
          <p className="text-background-light text-center md:text-left">
            © {year} TalentHub. All rights reserved.
          </p>
          <div
            className="flex justify-center md:justify-end"
            aria-label="Social media links"
          >
            {socialLinks.map((social, index) => (
              <Link
                to={social.url}
                key={index}
                className="text-social mx-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                aria-label={"social link"}
              >
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
