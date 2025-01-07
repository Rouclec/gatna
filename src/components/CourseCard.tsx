import React, { FC } from 'react'
import CircularProgressBar from './CircularProgressBar'
import VideoCameraPlay from '@/public/assets/icons/video-camera-play.svg'
import CircleClock from '@/public/assets/icons/circle-clock.svg'
import Document from '@/public/assets/icons/document.svg'
import { gilroyBold, gilroyRegular, gilroySemiBold } from '../pages'
import { Course } from '../interfaces'

interface Props {
  course: Course
  index: number
  isSelected: boolean
  onClick: () => void
}

const colors = {
  low: {
    stroke: '#ED4D4D',
    background: '#ED4D4D30'
  },
  medium: {
    stroke: '#D89A00',
    background: '#D89A0030'
  },
  high: {
    stroke: '#00890E',
    background: '#00890E30'
  }
}

const CourseCard: FC<Props> = ({ course, index, onClick, isSelected }) => {
  const percentage = Math.round((+0 * 100) / +(course?.length ?? 1))

  return (
    <div
      className={`w-full h-fit my-auto rounded-[20px] p-4 md:p-5 flex flex-col sm:flex-row justify-between items-center ${
        isSelected
          ? 'bg-gradient-to-r from-[#462FCF14] to-[#462FCF14] border-2 border-blue'
          : 'bg-neutral-1A40'
      } cursor-pointer`}
      onClick={onClick}
    >
      <div className='flex flex-col sm:flex-row flex-grow gap-2 items-center sm:items-start'>
        <div className='flex flex-col flex-grow gap-2'>
          <div>
            <p
              className={`text-ellipsis overflow-hidden line-clamp-1 ${gilroyBold.className} text-lg md:text-xl`}
            >
              {index.toString().padStart(2, '0')}. {course.title}
            </p>
            <p
              className={`text-sm text-ellipsis overflow-hidden line-clamp-1 ${gilroyRegular.className}`}
            >
              {course.description}
            </p>
          </div>
          <div className='flex items-center flex-wrap gap-2'>
            {!!course.link && (
              <div className='px-3 py-2 flex gap-2 rounded-full items-center bg-grey-bg'>
                <Document className='w-4 h-4' />
                <p className={`${gilroySemiBold.className} text-xs`}>PDF</p>
              </div>
            )}
            {!!course.length && (
              <div
                className={`px-3 py-2 flex gap-2 rounded-full items-center ${
                  isSelected ? 'bg-blue' : 'bg-grey-bg'
                }`}
              >
                <VideoCameraPlay className='w-4 h-4' />
                <p className={`${gilroySemiBold.className} text-xs`}>Video</p>
              </div>
            )}
            {!!course.length && (
              <div className='px-3 py-2 flex gap-2 rounded-full items-center bg-grey-bg'>
                <CircleClock className='w-4 h-4' />
                <p className={`${gilroySemiBold.className} text-xs`}>
                  {Math.floor(+course.length / 60)} : {+course.length % 60} mins
                </p>
              </div>
            )}
            <div className='px-3 py-2 flex gap-2 rounded-full items-center bg-grey-bg'>
              <p className={`${gilroySemiBold.className} text-xs text-grey-60`}>
                {course.package?.name}
              </p>
            </div>
          </div>
        </div>
        {/* Show progress bar below text on xs screens and alongside on sm and up */}
        {!course.length && (
          <div className='sm:ml-4 mt-4 sm:mt-0'>
            <CircularProgressBar
              percentage={percentage}
              radius={28}
              strokeWidth={4}
              strokeColor={
                percentage < 40
                  ? colors.low.stroke
                  : percentage < 80
                  ? colors.medium.stroke
                  : colors.high.stroke
              }
              pathColor={
                percentage < 40
                  ? colors.low.background
                  : percentage < 80
                  ? colors.medium.background
                  : colors.high.background
              }
              backgroundColor={
                percentage < 40
                  ? colors.low.background
                  : percentage < 80
                  ? colors.medium.background
                  : colors.high.background
              }
              padding={5}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseCard
