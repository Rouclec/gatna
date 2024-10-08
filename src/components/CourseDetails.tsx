import React, { FC } from "react";
import Pin from "@/public/assets/icons/pin.svg";
import { gilroyBlack, gilroyBold, gilroyRegular } from "../pages";
import { Paper, TimeSquare, Video } from "react-iconly";

interface Props {
  course: {
    videoURL: string;
    id: string | number;
    title: string;
    description: string;
    videos: string | number;
    pdf?: string;
    duration: string | number;
    tag: string;
    price: number | string;
    watermark: string;
  };
  inverted?: boolean;
  pinColor: string;
}

const CourseDetails: FC<Props> = ({ course, inverted, pinColor }) => {
  return (
    <div
      className={`h-screen flex flex-col items-center justify-center relative ${
        inverted ? "gap-14" : "gap-24"
      } grid grid-cols-2`}
    >
      {inverted && (
        <div className="flex flex-col h-[445px] justify-between col-span-1">
          <div className="flex flex-col gap-3 items-end">
            <div className="flex bg-dark-4D p-4 w-fit items-center rounded-[10px]">
              <Pin className="w-6 h-6" fill={pinColor} />
              <p className={`${gilroyRegular.className} text-lg`}>
                {course.tag} /{" "}
                <span className={`${gilroyBold.className}`}>
                  ${course.price}
                </span>
              </p>
            </div>
            <p
              className={`leading-[52px] text-[40px] ${gilroyBlack.className} text-right`}
            >
              {course.title}
            </p>
            <p className={`${gilroyRegular.className} text-lg text-right`}>
              {course.description}
            </p>
            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3">
                <Video size={24} style={{ opacity: 0.4 }} />
                <p className={`${gilroyRegular.className} text-neutral-50`}>
                  {course.videos} videos
                </p>
              </div>
              {course.pdf && (
                <div className="flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3">
                  <Paper size={24} style={{ opacity: 0.4 }} />
                  <p className={`${gilroyRegular.className} text-neutral-50`}>
                    PDF
                  </p>
                </div>
              )}
              <div className="flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3">
                <TimeSquare size={24} style={{ opacity: 0.4 }} />
                <p className={`${gilroyRegular.className} text-neutral-50`}>
                  {course.duration} hours
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient w-[254px] h-[70px] items-center self-end justify-center flex rounded-[10px]">
            <p className={`${gilroyBold.className}`}>Acheter ma formation</p>
          </div>
        </div>
      )}

      <div
        className={`w-[526px] h-[445px] bg-neutral-24 rounded-[40px] col-span-1 items-center justify-center flex ${
          inverted ? "mr-10" : "ml-10"
        }`}
      >
        <p>Video goes here</p>
      </div>
      {!inverted && (
        <div className="flex flex-col h-[445px] justify-between col-span-1">
          <div className="flex flex-col gap-3">
            <div className="flex bg-dark-4D p-4 w-fit items-center rounded-[10px]">
              <Pin className="w-6 h-6" fill={pinColor} />
              <p className={`${gilroyRegular.className} text-lg`}>
                {course.tag} /{" "}
                <span className={`${gilroyBold.className}`}>
                  ${course.price}
                </span>
              </p>
            </div>
            <p
              className={`leading-[52px] text-[40px] ${gilroyBlack.className}`}
            >
              {course.title}
            </p>
            <p className={`${gilroyRegular.className} text-lg`}>
              {course.description}
            </p>
            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3">
                <Video size={24} style={{ opacity: 0.4 }} />
                <p className={`${gilroyRegular.className} text-neutral-50`}>
                  {course.videos} videos
                </p>
              </div>
              {course.pdf && (
                <div className="flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3">
                  <Paper size={24} style={{ opacity: 0.4 }} />
                  <p className={`${gilroyRegular.className} text-neutral-50`}>
                    PDF
                  </p>
                </div>
              )}
              <div className="flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3">
                <TimeSquare size={24} style={{ opacity: 0.4 }} />
                <p className={`${gilroyRegular.className} text-neutral-50`}>
                  {course.duration} hours
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient w-[254px] h-[70px] items-center justify-center flex rounded-[10px]">
            <p className={`${gilroyBold.className}`}>Acheter ma formation</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
