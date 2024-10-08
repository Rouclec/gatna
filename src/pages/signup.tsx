import React from "react";
import { gilroyBold, gilroyRegular } from ".";
import { Navbar } from "../components";

function SignUp() {
  return (
    <div className="grid">
      <Navbar />
      <div className="w-screen h-screen mt-[32px] flex items-center justify-center">
        <div className="w-[484px] p-9 flex flex-col bg-dark-33 rounded-[40px] gap-16">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <p className="font-readex font-bold text-4xl text-neutral-10">
                Create account
              </p>
              <p
                className={`${gilroyRegular.className} text-lg text-neutral-B2`}
              >
                Fill the form below
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="flex flex-col gap-3">
                <input
                  placeholder="First name"
                  className={`h-[60px] w-full bg-neutral-1A rounded-xl px-4 opacity-40 placeholder:${gilroyRegular.className} placeholder:text-base placeholder:text-neutral-B2`}
                />
                <input
                  placeholder="Email address"
                  className={`h-[60px] w-full bg-neutral-1A rounded-xl px-4 opacity-40 placeholder:${gilroyRegular.className} placeholder:text-base placeholder:text-neutral-B2`}
                />
                <input
                  placeholder="Password"
                  className={`h-[60px] w-full bg-neutral-1A rounded-xl px-4 opacity-40 placeholder:${gilroyRegular.className} placeholder:text-base placeholder:text-neutral-B2`}
                />
              </div>
              <div className="flex flex-col gap-3">
                <input
                  placeholder="Last name"
                  className={`h-[60px] w-full bg-neutral-1A rounded-xl px-4 opacity-40 placeholder:${gilroyRegular.className} placeholder:text-base placeholder:text-neutral-B2`}
                />
                <input
                  placeholder="Phone number"
                  className={`h-[60px] w-full bg-neutral-1A rounded-xl px-4 opacity-40 placeholder:${gilroyRegular.className} placeholder:text-base placeholder:text-neutral-B2`}
                />
                <input
                  placeholder="Confirm password"
                  className={`h-[60px] w-full bg-neutral-1A rounded-xl px-4 opacity-40 placeholder:${gilroyRegular.className} placeholder:text-base placeholder:text-neutral-B2`}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                className="checkbox-custom cursor-pointer h-8 w-8"
              />
              <p className={`${gilroyRegular.className} text-neutral-B2`}>{`Accept terms & Conditions`}</p>
            </div>
          </div>
          <div className="bg-gradient px-8 py-5 w-fit rounded-[10px] cursor-pointer">
            <p className={`${gilroyBold.className} text-lg`}>Create account</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
