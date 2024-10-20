import React, { FC } from "react";
import { gilroyBold, gilroySemiBold } from "../pages";

interface Props {
  item: {
    title: string;
    quantity: string | number;
    icon: React.ReactNode;
  };
  index: number;
}

const AdminInfoCard: FC<Props> = ({ item, index }) => {
  return (
    <div
      className={`w-56 group grid bg-gradient-to-r ${
        index % 5 === 0
          ? "to-[#8AC340] from-[#50AA46]"
          : index % 5 === 1
          ? "to-[#024BA0] from-[#406DC3]"
          : index % 5 === 2
          ? "to-[#213189] from-[#213189]"
          : index % 5 === 3
          ? "to-[#F2714E] from-[#F2714E]"
          : "to-[#0665BD] from-[#008918]"
      } px-6 py-4 rounded-[20px] gap-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] shadow-sm cursor-pointer`}
    >
      <div>
        <p className={`${gilroySemiBold.className} text-sm text-white`}>
          {item.title}
        </p>
        {/* Short line below title */}
        <div className="h-1 w-9 rounded-lg  bg-white bg-opacity-20 mt-2 transition-all duration-300 group-hover:w-full  group-hover:h-[1px]" />
      </div>

      <div className="flex items-center justify-between w-full">
        {/* Quantity changes font on hover */}
        <p className={`text-[32px] leading-[38px] font-euclid text-white ${gilroyBold.className} transition-all duration-300 group-hover:font-plus`}>
          {item.quantity}
        </p>
        {/* Icon rotates on hover using group-hover */}
        <div className="transition-transform duration-300 group-hover:rotate-60">
          {item.icon}
        </div>
      </div>
    </div>
  );
};

export default AdminInfoCard;
