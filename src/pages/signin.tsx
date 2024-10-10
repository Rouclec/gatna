import React, { useState } from "react";
import { gilroyBold, gilroyRegular } from ".";
import { Navbar } from "../components";
import { Hide, Lock, Login, Message, Show } from "react-iconly";
import Link from "next/link";
import { useRouter } from "next/router";

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  return (
    <div className="grid">
      <Navbar />
      <div className="w-screen h-screen mt-[32px] flex items-center justify-center">
        <div className="w-[430px] p-9 flex flex-col bg-dark-33 rounded-[40px] gap-10">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <p className="font-readex font-bold text-4xl text-neutral-10">
                Account login
              </p>
              <p
                className={`${gilroyRegular.className} text-lg text-neutral-B2`}
              >
                Welcome back!
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-3">
              <div className="flex flex-col gap-3">
                <div className="relative flex items-center">
                  <input
                    placeholder="First name"
                    className={`h-[60px] w-full bg-neutral-1A  opacity-40 rounded-xl px-4 pl-20 placeholder:${gilroyRegular.className} placeholder:text-base placeholder:text-neutral-B2`}
                  />
                  <div className="flex items-center gap-2 absolute left-6 self-center">
                    <Message primaryColor="#FFFFFF33" />
                    <div className="w-[6px] h-[6px] rounded-full bg-grey-60 opacity-10" />
                  </div>
                </div>
                <div className="relative flex items-center">
                  <input
                    placeholder="Password"
                    className={`h-[60px] w-full bg-neutral-1A opacity-40 rounded-xl px-4 pl-20 placeholder:${gilroyRegular.className} placeholder:text-base placeholder:text-neutral-B2`}
                    type={showPassword ? "text" : "password"}
                  />
                  <div className="flex items-center gap-2 absolute left-6 self-center">
                    <Lock primaryColor="#FFFFFF33" />
                    <div className="w-[6px] h-[6px] rounded-full bg-grey-60 opacity-10" />
                  </div>
                  <div
                    className="cursor-pointer absolute right-6"
                    onClick={() => setShowPassword((prevState) => !prevState)}
                  >
                    {showPassword ? (
                      <Hide size={22} primaryColor="#8749D4" />
                    ) : (
                      <Show size={22} primaryColor="#8749D4" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1">
              <p className={`${gilroyRegular.className} text-neutral-B2`}>
                Forgort passowrd
              </p>
              <p className={`${gilroyRegular.className} text-neutral-B2`}>?</p>
              <Link
                href={"/"}
                className={`${gilroyBold.className} text-primary-450`}
              >
                Reset here
              </Link>
            </div>
          </div>
          <div
            className="bg-gradient px-8 py-4 flex items-center justify-center gap-3 rounded-[10px] cursor-pointer"
            onClick={() => router.replace("/users/home")}
          >
            <p className={`${gilroyBold.className} text-lg`}>Login</p>
            <Login primaryColor="#FFFFFF66" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
