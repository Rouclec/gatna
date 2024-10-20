import React from "react";

import Email from "@/public/assets/icons/email.svg";
import NotebookCheck from "@/public/assets/icons/notebook-check.svg";
import Bell from "@/public/assets/icons/bell.svg";
import { gilroyBold, gilroyRegular } from "../pages";


const AdminNav = () => {
  return (
    <div className="fixed h-[120px] pb-6 border-b-[1px] left-[148px] right-20 border-neutral-1A items-end flex z-50 bg-background">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className={`${gilroyRegular.className} text-white text-base`}>
            Welcome
          </p>
          <p className={`${gilroyBold.className} text-2xl text-white`}>
            gatna.io
          </p>
        </div>
        <div className="flex w-fit items-center gap-[10px]">
          <div className="relative w-11 h-11 rounded-full items-center justify-center flex bg-grey-bg">
            <NotebookCheck className="w-5" />
            <div className="absolute w-[18px] h-[18px] rounded-full flex items-center justify-center bg-primary-400 -top-[1px] -right-2">
              <p className={`${gilroyBold.className} text-[8px] text-white`}>
                12
              </p>
            </div>
          </div>
          <div className="relative w-11 h-11 rounded-full items-center justify-center flex bg-grey-bg">
            <Email className="w-5" />
            <div className="absolute w-[18px] h-[18px] rounded-full flex items-center justify-center bg-primary-400 -top-[1px] -right-2">
              <p className={`${gilroyBold.className} text-[8px] text-white`}>
                4
              </p>
            </div>
          </div>
          <div className="relative w-11 h-11 rounded-full items-center justify-center flex bg-grey-bg">
            <Bell className="w-5" />
            <div className="absolute w-[18px] h-[18px] rounded-full flex items-center justify-center bg-primary-400 -top-[1px] -right-2">
              <p className={`${gilroyBold.className} text-[8px] text-white`}>
                2
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
