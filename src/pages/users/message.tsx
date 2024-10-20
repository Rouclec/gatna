import Sidebar from "@/src/components/Sidebar";
import { gilroyBold, gilroyRegular } from "..";
import { MapProvider } from "@/src/providers/map-provider";
import { MapComponent } from "@/src/components/Map";

import Facebook from "@/public/assets/icons/facebook.svg";
import Instagram from "@/public/assets/icons/instagram.svg";
import WhatsApp from "@/public/assets/icons/whatsapp.svg";
import Telegram from "@/public/assets/icons/telegram-white.svg";
import { Call, Location, Message as MessageIcon, Send } from "react-iconly";
import Link from "next/link";

import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";

import { useState } from "react";

function Message() {
  const countries = getCountries();
  const [country, setCountry] = useState<string>("Cameroon");

  return (
    <Sidebar>
      <div className="ml-10 mr-28 overflow-x-hidden overflow-y-hidden">
        <main className="mt-8 ml-3 pb-20 grid grid-cols-2 gap-10">
          <div className="w-full flex flex-col gap-7">
            <div className="pb-5 border-b-[1px] border-neutral-1A">
              <p className={`${gilroyBold.className} text-[40px] leading-10`}>
                Envoyer un message
              </p>
              <p className={`${gilroyRegular.className} text-lg `}>
                Remplissez le formulaire
              </p>
            </div>
            <div className="w-[438px]">
              <MapProvider>
                <MapComponent />
              </MapProvider>
            </div>
            <div className="flex gap-3 items-center">
              <div className="h-14 w-14 rounded-full bg-grey-bg flex items-center justify-center">
                <Facebook className="w-6 h-6" stroke="#ffffff" />
              </div>
              <div className="h-14 w-14 rounded-full bg-grey-bg flex items-center justify-center">
                <Telegram className="w-6 h-6" />
              </div>
              <div className="h-14 w-14 rounded-full bg-grey-bg flex items-center justify-center">
                <WhatsApp className="w-6 h-6" stroke="#ffffff" />
              </div>
              <div className="h-14 w-14 rounded-full bg-grey-bg flex items-center justify-center">
                <Instagram className="w-6 h-6" stroke="#ffffff" />
              </div>
            </div>
            <div className="grid gap-5">
              <div className="flex items-start gap-[6px]">
                <Location size={24} primaryColor="#fff" />
                <div className="flex flex-col gap-3">
                  <p className={`${gilroyBold.className} text-base text-white`}>
                    Douala - Cameroun
                  </p>
                  <div>
                    <p
                      className={`${gilroyRegular.className} text-base text-white`}
                    >
                      Situé au carrefour Douala Bercy
                    </p>
                    <p
                      className={`${gilroyRegular.className} text-base text-white`}
                    >
                      BP : 15170 Akwa Douala
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-[6px]">
                  <div className="flex flex-col gap-3">
                    <MessageIcon size={24} primaryColor="#fff" />
                    <Call size={24} primaryColor="#fff" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link
                      href={`mailto:info@gatna.io`}
                      className={`${gilroyRegular.className} text-base text-white opacity-90 underline`}
                    >
                      info@gatna.io
                    </Link>
                    <div>
                      <p
                        className={`${gilroyRegular.className} text-base text-white`}
                      >
                        +237 657 87 87 87
                      </p>
                      <p
                        className={`${gilroyRegular.className} text-base text-white`}
                      >
                        +237 681 61 81 61
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-10 mt-4">
            <div className="w-full p-4 flex flex-col border-grey-D933 bg-grey-920D rounded-2xl border-[1px] gap-16">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="bg-grey-bg rounded-lg h-[70px] flex flex-col px-5 py-4 gap-1">
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Nom
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      />
                    </div>
                    <div className="bg-grey-bg rounded-lg h-[70px] flex flex-col px-5 py-4 gap-1">
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Addresse email
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="bg-grey-bg rounded-lg h-[70px] flex flex-col px-5 py-4 gap-1">
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Prenoms
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      />
                    </div>
                    <div className="bg-grey-bg rounded-lg h-[70px] flex flex-col px-5 py-4 gap-1">
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
                          className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                          placeholder="54 100 0003"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-grey-bg rounded-lg h-[142px] flex flex-col p-5 gap-1">
                  <p
                    className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                  >
                    Votre message
                  </p>
                  <textarea
                    className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer">
              <p className={`${gilroyBold.className} text-lg`}>
                Envoyer votre message
              </p>
              <Send size={20} primaryColor="#fff" />
            </div>
          </div>
        </main>
      </div>
    </Sidebar>
  );
}

export default Message;
