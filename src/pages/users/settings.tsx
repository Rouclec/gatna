import Sidebar from "@/src/components/Sidebar";
import { gilroyBold, gilroyRegular, gilroySemiBold } from "..";

import { Hide, Send, Show } from "react-iconly";

import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";

import { ChangeEvent, useState } from "react";
import ImageUploadButton from "@/src/components/ImageUploadButton";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

function Settings() {
  const countries = getCountries();
  const [country, setCountry] = useState<string>("Cameroon");

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
      <div className="mr-6 ml-4 md:ml-10 md:mr-28 overflow-x-hidden overflow-y-hidden">
        <main className="mt-8 ml-3 pb-20 gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-7 flex flex-col col-span-1 md:col-span-2 border-grey-D933 bg-grey-920D rounded-2xl border-[1px] h-fit md:h-[598px] gap-12 justify-between">
            <div className="flex flex-col gap-4">
              <div>
                <p className={`${gilroyBold.className} text-2xl text-white`}>
                  Parametres
                </p>
                <p className={`${gilroyRegular.className} text-lg text-white`}>
                  Modifez vos donnees
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-3 order-2 sm:order-1">
                  <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Nom
                    </p>
                    <input
                      className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                    />
                  </div>
                  <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Addresse email
                    </p>
                    <input
                      className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                    />
                  </div>
                  <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Wallet USDT
                    </p>
                    <input
                      className={`w-full h-full bg-transparent text-neutral-10  outline-none focus:ring-0 ${gilroyBold.className}`}
                      onChange={(e) => handleWalletInputChange(e)}
                      onBlur={handleWalletBlur}
                      onFocus={handleWalletFocus}
                      value={isWalletFocused ? walletValue : walletDisplayValue}
                    />
                  </div>
                  <ImageUploadButton
                    title="Profile image"
                    placeholder="Upload profile pic"
                  />
                </div>
                <div className="flex flex-col gap-3 order-1 sm:order-2">
                  <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Prenoms
                    </p>
                    <input
                      className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                    />
                  </div>
                  <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Telephone
                    </p>
                    <div className="flex items-center gap-2">
                      <select
                        value={country}
                        onChange={(event) => {
                          console.log(event.target.value);
                          setCountry(event.target.value);
                        }}
                        className={`w-16 h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      >
                        <option value="">+{getCountryCallingCode("CM")}</option>
                        {countries.map((countryCode) => (
                          <option
                            key={countryCode}
                            value={`+${getCountryCallingCode(countryCode)}`}
                          >
                            +{getCountryCallingCode(countryCode)}
                          </option>
                        ))}
                      </select>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        placeholder="54 100 0003"
                      />
                    </div>
                  </div>
                  <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Country
                    </p>
                    <select
                      value={country}
                      onChange={(event) => {
                        console.log(event.target.value);
                        setCountry(event.target.value);
                      }}
                      className={`w-full h-full p-0 bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                    >
                      <option value="">{en["CM"]}</option>
                      {countries.map((countryCode) => (
                        <option
                          key={countryCode}
                          value={`+${getCountryCallingCode(countryCode)}`}
                        >
                          {en[countryCode]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer">
              <p className={`${gilroyBold.className} text-lg`}>Save settings</p>
              <Send size={20} primaryColor="#fff" />
            </div>
          </div>
          <div className="p-7 flex flex-col col-span-1 border-grey-D933 bg-grey-920D rounded-2xl border-[1px] h-fit md:h-[598px] gap-12 justify-between">
            <div className="flex flex-col gap-4">
              <div>
                <p className={`${gilroyBold.className} text-2xl text-white`}>
                  Create PIN
                </p>
                <p className={`${gilroyRegular.className} text-lg text-white`}>
                  Create a withdrawal pin
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-1 items-center justify-between relative">
                    <div className="bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Pin code
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type={showPin ? "numeric" : "password"}
                        placeholder="********"
                      />
                    </div>
                    <div
                      className="absolute right-4 cursor-pointer"
                      onClick={() => setShowPin((prev) => !prev)}
                    >
                      {showPin ? <Hide /> : <Show />}
                    </div>
                  </div>
                  <div className="flex gap-1 items-center justify-between relative">
                    <div className="bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Repeat pin
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type={showPin ? "numeric" : "password"}
                        placeholder="********"
                      />
                    </div>
                    <div
                      className="absolute right-4 cursor-pointer"
                      onClick={() => setShowPin((prev) => !prev)}
                    >
                      {showPin ? <Hide /> : <Show />}
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
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type="numeric"
                        placeholder="_ _ _ _ _ _"
                        maxLength={6}
                      />
                    </div>
                    <div className="absolute right-2">
                      <div className="w-[74px] h-7 flex rounded-full items-center justify-center bg-primary-400 cursor-pointer">
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
            <div className="bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer">
              <p className={`${gilroyBold.className} text-lg`}>Save settings</p>
              <Send size={20} primaryColor="#fff" />
            </div>
          </div>
          <div className="p-7 flex flex-col col-span-1 border-grey-D933 bg-grey-920D rounded-2xl border-[1px] h-fit md:h-[598px] gap-12 justify-between">
            <div className="flex flex-col gap-4">
              <div>
                <p className={`${gilroyBold.className} text-2xl text-white`}>
                  Change password
                </p>
                <p className={`${gilroyRegular.className} text-lg text-white`}>
                  Modify your password
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-1 items-center justify-between relative">
                    <div className="bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Old password
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                      />
                    </div>
                    <div
                      className="absolute right-4 cursor-pointer"
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
                        New password
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                      />
                    </div>
                    <div
                      className="absolute right-4 cursor-pointer"
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
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type="numeric"
                        placeholder="_ _ _ _ _ _"
                        maxLength={6}
                      />
                    </div>
                    <div className="absolute right-2">
                      <div className="w-[74px] h-7 flex rounded-full items-center justify-center bg-primary-400 cursor-pointer">
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
            <div className="bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer">
              <p className={`${gilroyBold.className} text-lg`}>Save settings</p>
              <Send size={20} primaryColor="#fff" />
            </div>
          </div>
        </main>
      </div>
    </Sidebar>
  );
}

export default Settings;


export async function getServerSideProps (context: GetServerSidePropsContext) {
  const session = await getSession(context)

  // Check if the user is authenticated
  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    }
  }


  // If there is a user
  return {
    props: { session }
  }
}