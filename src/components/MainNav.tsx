import React from "react";
import Image from "next/image";

import profile1 from "@/public/assets/images/profile1.png";
import CheckMark from "@/public/assets/icons/checkmark.svg";
import Gift from "@/public/assets/icons/gift.svg";
import Crypto from "@/public/assets/icons/crypto.svg";

import { gilroyBold, gilroyMedium, gilroySemiBold } from "@/src/pages/index";
import { Calendar } from "react-iconly";
import moment from "moment";

const MainNav = () => {
  return (
    <div className="fixed h-[120px] pb-6 border-b-[1px] left-[148px] right-[117px] border-neutral-1A items-end flex z-50 bg-background">
      <div className="flex items-center gap-[10px]">
        <div className="w-[60px] h-[60px] rounded-full bg-grey-9333 items-center justify-center flex">
          <Image
            src={profile1}
            className="w-12 h-12 rounded-full"
            alt="profile"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className={`${gilroyBold.className} text-2xl text-white`}>
              Yongong Briand
            </p>
            <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-whatsapp">
              <CheckMark className="w-3 h-3" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div
              className="gap-1 px-[10px] py-[9px] rounded-full bg-primary-400 flex itemsc-e
                "
            >
              <Gift className="w-[14px] h-[14px]" />
              <p className={`${gilroySemiBold.className} text-xs`}>Gatna 4</p>
            </div>
            <div className="flex gap-1 items-center px-[10px] py-1 justify-center rounded-full bg-grey-bg">
              <Calendar
                style={{
                  height: 14,
                  width: 14,
                  marginBottom: 1,
                }}
              />
              <div className="h-6 items-center justify-center flex">
                <p
                  className={`${gilroyMedium.className} text-xs leading-normal`}
                >
                  {moment().format("DD-MM-YYYY")}
                </p>
              </div>
            </div>
            <div className="flex gap-1 items-center px-[10px] py-[6px] rounded-full bg-dark-14 border-2 border-green">
              <Crypto className="w-[14px] h-[14px]" />
              <p className={`${gilroyBold.className} text-xs text-green`}>
                $10 USDT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
