import { FaFacebookF } from "react-icons/fa";
import { TiSocialYoutube } from "react-icons/ti";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const footerLinks = [
  {
    main: "Quick Link",
    links: [
      { name: "About us", url: "/about" },
      { name: "Browse Jobs", url: "/jobs" },
      { name: "Post a Job", url: "/post-job" },
    ],
  },
  {
    main: "Candidate",
    links: [
      { name: "Browse Jobs", url: "/jobs" },
      { name: "Browse Employers", url: "/employers" },
      { name: "Saved Jobs", url: "/saved-jobs" },
    ],
  },
  {
    main: "Employers",
    links: [
      { name: "Post a Job", url: "/post-job" },
      { name: "Browse Candidates", url: "/candidates" },
      { name: "Applications", url: "/applications" },
    ],
  },
  {
    main: "Support",
    links: [
      { name: "FAQs", url: "/faqs" },
      { name: "Privacy Policy", url: "/privacy-policy" },
      { name: "Terms & Conditions", url: "/terms" },
    ],
  },
];

export const socialLinks = [
  {
    icon: FaFacebookF,
    url: "https://www.facebook.com",
  },
  {
    icon: TiSocialYoutube,
    url: "https://www.youtube.com",
  },
  {
    icon: FaInstagram,
    url: "https://www.instagram.com",
  },
  {
    icon: FaXTwitter,
    url: "https://www.x.com",
  },
];
