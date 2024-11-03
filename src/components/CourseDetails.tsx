import React, { FC } from 'react'
import Pin from '@/public/assets/icons/pin.svg'
import { gilroyBlack, gilroyBold, gilroyHeavy, gilroyRegular } from '../pages'
import { Paper, TimeSquare, Video } from 'react-iconly'

interface Props {
  course: {
    videoURL: string
    id: string | number
    title: string
    description: string
    videos: string | number
    pdf?: string
    duration: string | number
    tag: string
    price: number | string
    watermark: string
  }
  inverted?: boolean
  pinColor: string
}

const CourseDetails: FC<Props> = ({ course, inverted, pinColor }) => {
  return (
    <div
      // className={`flex flex-col items-center justify-center relative ${
      //   inverted ? 'gap-14' : 'gap-24'
      // } grid gri grid-cols-2`}
      className={`flex flex-col md:flex-row items-center justify-self-center relative gap-7`}
      // style={{
      //   backgroundColor: pinColor
      // }}
    >
      {inverted ? (
        // Inverted Layout: Texts - Video - Watermark
        <div className='grid gap-4'>
          <div className='relative flex items-center justify-center'>
            <p
              className={`block lg:hidden ${gilroyHeavy.className} text-6xl mx:text-8xl text-center leading-none text-white text-opacity-[2%] whitespace-nowrap`}
            >
              {course.watermark}
            </p>
          </div>
          <div className='pl-0 mx:px-16 lg:px-28 flex flex-col md:flex-row gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 lg:gap-16'>
              <div className='flex flex-col gap-16 col-span-1'>
                <div className='flex flex-col gap-3 items-center md:items-end'>
                  <div className='flex bg-dark-4D p-4 w-fit items-center rounded-[10px]'>
                    <Pin className='w-6 h-6' fill={pinColor} />
                    <p className={`${gilroyRegular.className} text-lg`}>
                      {course.tag} /{' '}
                      <span className={`${gilroyBold.className}`}>
                        ${course.price}
                      </span>
                    </p>
                  </div>
                  <p
                    className={`leading-[52px] text-3xl md:text-[40px] ${gilroyBlack.className} text-center md:text-right`}
                  >
                    {course.title}
                  </p>
                  <p
                    className={`${gilroyRegular.className} text-lg text-center md:text-right`}
                  >
                    {course.description}
                  </p>
                  <div className='grid grid-cols-2 md:grid-cols-3 items-center gap-3'>
                    {!course.pdf && <div className='hidden md:block'/>}
                    <div className='flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3'>
                      <Video size={24} style={{ opacity: 0.4 }} />
                      <p
                        className={`${gilroyRegular.className} text-neutral-50`}
                      >
                        {course.videos} videos
                      </p>
                    </div>
                    {course.pdf && (
                      <div className='flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3'>
                        <Paper size={24} style={{ opacity: 0.4 }} />
                        <p
                          className={`${gilroyRegular.className} text-neutral-50`}
                        >
                          PDF
                        </p>
                      </div>
                    )}
                    <div className='flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3'>
                      <TimeSquare size={24} style={{ opacity: 0.4 }} />
                      <p
                        className={`${gilroyRegular.className} text-neutral-50`}
                      >
                        {course.duration} hours
                      </p>
                    </div>
                  </div>
                </div>
                <div className='bg-gradient w-[254px] h-[70px] items-center self-center md:self-end justify-center flex rounded-[10px]'>
                  <p className={`${gilroyBold.className}`}>
                    Acheter ma formation
                  </p>
                </div>
              </div>
              <div
                className={`w-full mx-auto h-full min-h-48 bg-neutral-24 rounded-[40px] col-span-1 items-center justify-center flex ${
                  inverted ? 'mr-10' : 'ml-10'
                }`}
              >
                <p>Video goes here</p>
              </div>
            </div>
            <div className='relative flex items-center justify-center ml-16'>
              <p
                className={`hidden lg:block ${gilroyHeavy.className} text-8xl md:text-9xl leading-none text-white text-opacity-[2%] whitespace-nowrap absolute`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(90deg)'
                }}
              >
                {course.watermark}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Non-Inverted Layout: Watermark - Video - Texts
        <div className='grid gap-4'>
          <div className='relative flex items-center justify-center'>
            <p
              className={`block lg:hidden ${gilroyHeavy.className} text-6xl mx:text-8xl text-center leading-none text-white text-opacity-[2%] whitespace-nowrap`}
            >
              {course.watermark}
            </p>
          </div>
          <div className='pl-0 mx:px-16 lg:px-28 flex flex-col md:flex-row gap-4'>
            <div className='relative flex items-center justify-center mr-16'>
              <p
                className={`hidden lg:block ${gilroyHeavy.className} text-8xl md:text-9xl leading-none text-white text-opacity-[2%] whitespace-nowrap absolute`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(90deg)'
                }}
              >
                {course.watermark}
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 lg:gap-16'>
              <div
                className={`w-full mx-auto h-full min-h-48 bg-neutral-24 rounded-[40px] col-span-1 items-center justify-center flex mr-10`}
              >
                <p>Video goes here</p>
              </div>
              <div className='flex flex-col gap-16 col-span-1'>
                <div className='flex flex-col gap-3 items-center md:items-start'>
                  <div className='flex bg-dark-4D p-4 w-fit items-center rounded-[10px]'>
                    <Pin className='w-6 h-6' fill={pinColor} />
                    <p className={`${gilroyRegular.className} text-lg`}>
                      {course.tag} /{' '}
                      <span className={`${gilroyBold.className}`}>
                        ${course.price}
                      </span>
                    </p>
                  </div>
                  <p
                    className={`leading-[52px] text-3xl md:text-[40px] ${gilroyBlack.className} text-center md:text-left`}
                  >
                    {course.title}
                  </p>
                  <p
                    className={`${gilroyRegular.className} text-lg text-center md:text-left`}
                  >
                    {course.description}
                  </p>
                  <div className='grid grid-cols-2 md:grid-cols-3 items-center gap-3'>
                    <div className='flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3'>
                      <Video size={24} style={{ opacity: 0.4 }} />
                      <p
                        className={`${gilroyRegular.className} text-neutral-50`}
                      >
                        {course.videos} videos
                      </p>
                    </div>
                    {course.pdf && (
                      <div className='flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3'>
                        <Paper size={24} style={{ opacity: 0.4 }} />
                        <p
                          className={`${gilroyRegular.className} text-neutral-50`}
                        >
                          PDF
                        </p>
                      </div>
                    )}
                    <div className='flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3'>
                      <TimeSquare size={24} style={{ opacity: 0.4 }} />
                      <p
                        className={`${gilroyRegular.className} text-neutral-50`}
                      >
                        {course.duration} hours
                      </p>
                    </div>
                  </div>
                </div>
                <div className='bg-gradient w-[254px] h-[70px] items-center self-center md:self-start justify-center flex rounded-[10px]'>
                  <p className={`${gilroyBold.className}`}>
                    Acheter ma formation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseDetails
