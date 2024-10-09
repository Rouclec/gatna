import React, { FC } from "react";
import { gilroyBold, gilroyMedium } from "../pages";
import Facebook from "@/public/assets/icons/facebook.svg";
import Instagram from "@/public/assets/icons/instagram.svg";
import WhatsApp from "@/public/assets/icons/whatsapp.svg";

const Footer: FC = () => {
  return (
    <footer className="h-[75px] border-t-[0.5px] border-neutral-1A flex items-center justify-between pl-[52px] pr-[294px]">
      <p className={`${gilroyMedium.className} text-base text-white`}>
        <span className={`${gilroyBold.className}`}>Copyright 2024</span> |{" "}
        <span>All rights reserved</span> | <span>Made with love by</span> |{" "}
        <span className={`text-primary-400`}>Briluce services</span>
      </p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-grey-bg flex items-center justify-center">
          <Facebook className="w-6 h-6" stroke="#ffffff" />
        </div>
        <div className="h-10 w-10 rounded-full bg-grey-bg flex items-center justify-center">
          <WhatsApp className="w-6 h-6" stroke="#ffffff" />
        </div>
        <div className="h-10 w-10 rounded-full bg-grey-bg flex items-center justify-center">
          <Instagram className="w-6 h-6" stroke="#ffffff" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
