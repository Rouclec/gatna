import React, { FC } from "react";
import CircularProgressBar from "./CircularProgressBar";
import CheckMark from "@/public/assets/icons/checkmark.svg";
import VideoCameraPlay from "@/public/assets/icons/video-camera-play.svg";
import CircleClock from "@/public/assets/icons/circle-clock.svg";
import Document from "@/public/assets/icons/document.svg";
import { gilroyBold, gilroyRegular, gilroySemiBold } from "../pages";
import { Course } from "../interfaces";

interface Props {
  course: Course;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const colors = {
  low: {
    stroke: "#ED4D4D",
    background: "#ED4D4D30",
  },
  medium: {
    stroke: "#D89A00",
    background: "#D89A0030",
  },
  high: {
    stroke: "#00890E",
    background: "#00890E30",
  },
};

const CourseCard: FC<Props> = ({ course, index, onClick, isSelected }) => {
  const percentage = Math.round(
    (+(course.minutesWatched ?? 0) * 100) / +(course.duration ?? 1)
  );

  return (
    <div
      className={`w-full h-[112px] rounded-[20px] px-6 py-5 ${
        isSelected
          ? "bg-gradient-to-r from-[#462FCF14] to-[#462FCF14] border-2 border-blue"
          : "bg-neutral-1A40"
      } flex items-center cursor-pointer`}
      onClick={onClick}
    >
      <div className="grid gap-2">
        <div>
          <p
            className={`text-ellipsis overflow-hidden line-clamp-1 ${gilroyBold.className}`}
          >
            {index.toString().padStart(2, "0")}. {course.title}
          </p>
          <p
            className={`text-sm text-ellipsis overflow-hidden line-clamp-1 ${gilroyRegular.className} text-xs`}
          >
            {course.description}
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          {!!course.pdf && (
            <div className="px-3 py-[10px] flex gap-2 rounded-full items-center bg-grey-bg">
              <Document className={"w-4 h-4"} />
              <p className={`${gilroySemiBold.className} text-xs`}>PDF</p>
            </div>
          )}
          {!!course.duration && (
            <div
              className={`px-3 py-[10px] flex gap-2 rounded-full items-center ${
                isSelected ? "bg-blue" : " bg-grey-bg"
              }`}
            >
              <VideoCameraPlay className={"w-4 h-4"} />
              <p className={`${gilroySemiBold.className} text-xs`}>Video</p>
            </div>
          )}
          {!!course.duration && (
            <div className="px-3 py-[10px] flex gap-2 rounded-full items-center bg-grey-bg">
              <CircleClock className={"w-4 h-4"} />
              <p className={`${gilroySemiBold.className} text-xs`}>
                {Math.floor(+course.duration / 60)} : {+course.duration % 60}{" "}
                mins
              </p>
            </div>
          )}
          {isSelected && (
            <div className="flex items-center justify-center w-[24px] h-[24px] rounded-full bg-whatsapp">
              <CheckMark className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
      {!course.pdf && (
        <CircularProgressBar
          percentage={percentage}
          radius={28}
          strokeWidth={4}
          strokeColor={percentage < 40 ? colors.low.stroke : percentage < 80 ? colors.medium.stroke : colors.high.stroke }
          pathColor={percentage < 40 ? colors.low.background : percentage < 80 ? colors.medium.background : colors.high.background }
          backgroundColor={percentage < 40 ? colors.low.background : percentage < 80 ? colors.medium.background : colors.high.background }
          padding={5}
        />
      )}
    </div>
  );
};

export default CourseCard;
