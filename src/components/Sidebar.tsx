import React, { FC, useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import logoicon from "@/public/assets/images/logo-icon.png";

import Reels from "@/public/assets/icons/reels.svg";
import Email from "@/public/assets/icons/email.svg";
import Logout from "@/public/assets/icons/logout.svg";
import Settings from "@/public/assets/icons/settings.svg";
import ArrowCircle from "@/public/assets/icons/arrow-circle.svg";
import { gilroyBold, gilroyRegular } from "../pages";

type Props = {
  children: React.ReactNode;
};

const Sidebar: FC<Props> = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  const navItems = useMemo(
    () => [
      {
        name: "Videos",
        route: "/users/home",
        logoActive: <Reels className="w-6 h-6" />,
        logo: <Reels className="w-8 h-8" />,
      },
      {
        name: "Message",
        route: "/users/message",
        logoActive: <Email className="w-6 h-6" />,
        logo: <Email className="w-8 h-8" />,
      },
      {
        name: "gatna.io",
        route: "/",
        logoActive: <ArrowCircle className="w-6 h-6" />,
        logo: <ArrowCircle className="w-8 h-8" />,
      },
    ],
    []
  );

  const settings = useMemo(() => ({
    name: "Settings",
    route: "/users/settings",
    logoActive: <Settings className="w-6 h-6" />,
    logo: <Settings className="w-8 h-8" />,
  }), []);

  const [active, setActive] = useState<{
    name: string;
    route: string;
    logo: React.JSX.Element;
  }>();

  useEffect(() => {
    if (pathname === settings.route) {
      setActive(settings)
    } else {
      setActive(navItems.find((item) => item.route === pathname));
    }
  }, [navItems, pathname, settings]);

  return (
    <div className="flex">
      <div className="fixed z-40 h-screen bg-primary-200 transition-all duration-300 ease-in-out w-[108px]">
        <aside className="fixed flex flex-col items-start top-0 left-0 z-40 h-screen bg-primary-200 w-[108px] p-4 pt-0">
          <div className="h-[152px] w-full flex items-center justify-center">
            <Image src={logoicon} alt="logo" width={60} height={60} />
          </div>
          <div className="h-full px-6 mt-8 self-center flex flex-col items-center justify-between">
            <div>
              <div className="grid w-full gap-6">
                {navItems.map((item, index) => {
                  return (
                    <div
                      key={item.route}
                      className="flex flex-col items-center gap-6"
                    >
                      <div
                        className="flex flex-col gap-[2px] items-center justify-center cursor-pointer"
                        onClick={() => router.push(item.route)}
                      >
                        <div
                          className={`${
                            item.name === active?.name
                              ? "w-[54px] h-[54px] icon-gradient"
                              : "w-8 h-8"
                          } rounded-[10px] flex items-center justify-center`}
                        >
                          {item.name === active?.name
                            ? item.logoActive
                            : item.logo}
                        </div>
                        <p
                          className={`${
                            item.name === active?.name
                              ? gilroyBold.className
                              : gilroyRegular.className
                          } text-sm text-grey-60`}
                        >
                          {item.name}
                        </p>
                      </div>
                      {index + 1 !== navItems.length && (
                        <div className="w-[14px] border-[2px] opacity-20 bg-neutral-21 rounded-sm" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="w-full mt-16 flex flex-col items-center gap-16">
                <div className="w-[14px] border-[2px] opacity-20 bg-neutral-21 rounded-sm" />
                <div
                  className="flex flex-col gap-[2px] items-center justify-center cursor-pointer"
                  onClick={() => {
                    router.push(settings.route);
                    setActive(settings);
                  }}
                >
                  <div
                    className={`${
                      settings.name === active?.name
                        ? "w-[54px] h-[54px] icon-gradient"
                        : "w-8 h-8"
                    } rounded-[10px] flex items-center justify-center`}
                  >
                    {settings.name === active?.name
                      ? settings.logoActive
                      : settings.logo}
                  </div>
                  <p
                    className={`${
                      settings.name === active?.name
                        ? gilroyBold.className
                        : gilroyRegular.className
                    } text-sm text-grey-60`}
                  >
                    {settings.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="self-center flex bg-error w-[60px] h-[54px] rounded-xl items-center justify-center">
              <Logout className="w-6 h-6" />
            </div>
          </div>
        </aside>
      </div>
      <main className="w-screen ml-[108px] min-h-screen">
        <div className="">{children}</div>
      </main>
    </div>
  );
};

export default Sidebar;
