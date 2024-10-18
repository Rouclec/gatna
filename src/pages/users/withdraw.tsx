import MainNav from "@/src/components/MainNav";
import Sidebar from "@/src/components/Sidebar";
import Footer from "@/src/components/Footer";
import { gilroyBold, gilroyRegular, gilroySemiBold } from "..";

import { Hide, Send, Show } from "react-iconly";
import Crypto from "@/public/assets/icons/crypto.svg";

import { ChangeEvent, useState } from "react";

function Withdraw() {
  const [walletValue, setWalletValue] = useState("");
  const [walletDisplayValue, setWalletDisplayValue] = useState("");
  const [isWalletFocused, setIsWalletFocused] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showPassword, setshowPassword] = useState(false);

  const handleWalletInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWalletValue(e.target.value);
  };

  const handleWalletBlur = () => {
    setIsWalletFocused(false);
    if (walletValue.length > 10) {
      const firstFive = walletValue.substring(0, 8);
      const lastFive = walletValue.substring(walletValue.length - 8);
      setWalletDisplayValue(`${firstFive}....${lastFive}`);
    } else {
      setWalletDisplayValue(walletValue);
    }
  };

  const handleWalletFocus = () => {
    setIsWalletFocused(true);
  };

  return (
    <Sidebar>
      <div className="ml-10 mr-28 overflow-x-hidden overflow-y-hidden">
        <MainNav />
        <main className="mt-48 ml-3 pb-20 flex gap-5">
          <div className="p-7 flex flex-col border-grey-D933 bg-grey-920D rounded-2xl border-[1px] w-[545px] h-[521px] justify-between">
            <div className="flex flex-col gap-4">
              <div>
                <p className={`${gilroyBold.className} text-2xl text-white`}>
                  Withdraw
                </p>
                <p className={`${gilroyRegular.className} text-lg text-white`}>
                  Send a withdrawal request
                </p>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-3">
                  <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1 relative items-start justify-center">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Your balance
                    </p>
                    <input
                      className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className} pr-8`}
                    />
                    <div className="w-[22px] h-[22px] items-center justify-center top[50%] absolute right-5">
                      <Crypto className="w-full h-full" />
                    </div>
                  </div>
                  <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1 relative items-start justify-center">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Enter your pin
                    </p>
                    <input
                      className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                      type={showPin ? "numeric" : "password"}
                      placeholder="********"
                    />
                    <div
                      className="absolute right-5 h-[22px] cursor-pointer"
                      onClick={() => setShowPin((prev) => !prev)}
                    >
                      {showPin ? <Hide /> : <Show />}
                    </div>
                  </div>
                  <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Wallet USDT
                    </p>
                    <input
                      className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      onChange={(e) => handleWalletInputChange(e)}
                      onBlur={handleWalletBlur}
                      onFocus={handleWalletFocus}
                      value={isWalletFocused ? walletValue : walletDisplayValue}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Withdrawal amount
                    </p>
                    <input
                      className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                    />
                  </div>
                  <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1 relative items-start justify-center">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Enter your password
                    </p>
                    <input
                      className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                      type={showPassword ? "text" : "password"}
                      placeholder="***********"
                    />
                    <div
                      className="absolute right-5 h-[22px] cursor-pointer"
                      onClick={() => setshowPassword((prev) => !prev)}
                    >
                      {showPassword ? <Hide /> : <Show />}
                    </div>
                  </div>
                  <div className="flex gap-1 items-center justify-between relative">
                    <div className="bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Get OTP
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type="numeric"
                        placeholder="_ _ _ _ _ _"
                        maxLength={6}
                      />
                    </div>
                    <div className="absolute right-6">
                      <div className="w-[74px] h-7 flex rounded-full items-center justify-center bg-blue cursor-pointer">
                        <p
                          className={`${gilroySemiBold.className} text-xs text-white`}
                        >
                          Get code
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                className="checkbox-custom cursor-pointer h-8 w-8"
              />
              <p
                className={`${gilroyRegular.className} text-neutral-10`}
              >{`I accept the terms & conditions`}</p>
            </div>
            <div className="bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer">
              <p className={`${gilroyBold.className} text-lg`}>Save settings</p>
              <Send size={20} primaryColor="#fff" />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </Sidebar>
  );
}

export default Withdraw;
