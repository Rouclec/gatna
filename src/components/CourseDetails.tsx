import React, { FC } from 'react'
import Pin from '@/public/assets/icons/pin.svg'
import { gilroyBlack, gilroyBold, gilroyHeavy, gilroyRegular } from '../pages'
import { Paper, TimeSquare, Video } from 'react-iconly'
import { Course } from '../hooks/course'
import { useGetVideoPlaybackInfo } from '../hooks/video'
import { ClipLoader } from 'react-spinners'
import { useRouter } from 'next/router'

interface Props {
  course: Course
  inverted?: boolean
  pinColor: string
}

const CURRENCY_SYMBOL = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  XAF: 'XAF'
} as const // `as const` ensures the keys and values are readonly

function getCurrencySymbol (currency: string): string {
  if (currency in CURRENCY_SYMBOL) {
    return CURRENCY_SYMBOL[currency as keyof typeof CURRENCY_SYMBOL]
  }
  return currency
}

const CourseDetails: FC<Props> = ({ course, inverted, pinColor }) => {
  const router = useRouter()

  const { data, isLoading } = useGetVideoPlaybackInfo(
    course?.package.previewVideo?.id
  )

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('@buying-course', JSON.stringify(course.package._id))
      router.push('/signup')
    }
  }
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
              {course.package.name}
            </p>
          </div>
          <div className='pl-0 mx:px-16 lg:px-28 flex flex-col md:flex-row gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 lg:gap-16'>
              <div className='flex flex-col gap-16 col-span-1'>
                <div className='flex flex-col gap-3 items-center md:items-end'>
                  <div className='flex bg-dark-4D p-4 w-fit items-center rounded-[10px]'>
                    <Pin className='w-6 h-6' fill={pinColor} />
                    <p className={`${gilroyRegular.className} text-lg`}>
                      {course.package.tag} /{' '}
                      <span className={`${gilroyBold.className}`}>
                        {getCurrencySymbol(course.package.currency)}
                        {course.package.price}
                      </span>
                    </p>
                  </div>
                  <p
                    className={`leading-[52px] text-3xl md:text-[40px] ${gilroyBlack.className} text-center md:text-right`}
                  >
                    {course?.package.previewVideo?.title ?? course?.package.tag}
                  </p>
                  <p
                    className={`${gilroyRegular.className} text-lg text-center md:text-right`}
                  >
                    {course?.package.previewVideo?.description ??
                      course?.package.tag}
                  </p>
                  <div className='grid grid-cols-2 md:grid-cols-3 items-center gap-3'>
                    {!course.pdfs && <div className='hidden md:block' />}
                    <div className='flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3'>
                      <Video size={24} style={{ opacity: 0.4 }} />
                      <p
                        className={`${gilroyRegular.className} text-neutral-50`}
                      >
                        {course?.videos?.length ?? 0} videos
                      </p>
                    </div>
                    {course?.pdfs && (
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
                        {course?.duration && course.duration > 3600
                          ? `${Math.round(
                              (course.duration ?? 0) / (60 * 60)
                            )} hours`
                          : `${Math.round((course.duration ?? 0) / 60)} mins`}
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
                className={`w-fit lg:w-[526px] mx-auto h-full min-h-48 bg-neutral-24 rounded-[40px] col-span-1 items-center justify-center flex ${
                  inverted ? 'mr-10' : 'ml-10'
                }`}
              >
                {isLoading ? (
                  <ClipLoader color='#fff' />
                ) : (
                  <iframe
                    src={`https://player.vdocipher.com/v2/?otp=${data?.otp}&playbackInfo=${data?.playbackInfo}`}
                    style={{
                      border: 0,
                      borderRadius: 32,
                      width: '100%',
                      height: '100%'
                    }}
                    allow='encrypted-media'
                    allowFullScreen
                  />
                )}
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
                {course.package.name}
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
              {course.package.name}
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
                {course.package.name}
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 lg:gap-16'>
              <div
                className={`w-fit lg:w-[526px] mx-auto h-full min-h-48 bg-neutral-24 rounded-[40px] col-span-1 items-center justify-center flex mr-10`}
              >
                {isLoading ? (
                  <ClipLoader color='#fff' />
                ) : (
                  <iframe
                    src={`https://player.vdocipher.com/v2/?otp=${data?.otp}&playbackInfo=${data?.playbackInfo}`}
                    style={{
                      border: 0,
                      borderRadius: 32,
                      width: '100%',
                      height: '100%'
                    }}
                    allow='encrypted-media'
                    allowFullScreen
                  />
                )}
              </div>
              <div className='flex flex-col gap-16 col-span-1'>
                <div className='flex flex-col gap-3 items-center md:items-start'>
                  <div className='flex bg-dark-4D p-4 w-fit items-center rounded-[10px]'>
                    <Pin className='w-6 h-6' fill={pinColor} />
                    <p className={`${gilroyRegular.className} text-lg`}>
                      {course.package.tag} /{' '}
                      <span className={`${gilroyBold.className}`}>
                        {getCurrencySymbol(course.package.currency)}
                        {course.package.price}
                      </span>
                    </p>
                  </div>
                  <p
                    className={`leading-[52px] text-3xl md:text-[40px] ${gilroyBlack.className} text-center md:text-left`}
                  >
                    {course?.package.previewVideo?.title ?? course?.package.tag}
                  </p>
                  <p
                    className={`${gilroyRegular.className} text-lg text-center md:text-left`}
                  >
                    {course?.package.previewVideo?.description ??
                      course?.package.tag}
                  </p>
                  <div className='grid grid-cols-2 md:grid-cols-3 items-center gap-3'>
                    <div className='flex items-center justify-center rounded-lg bg-grey-bg gap-[6px] px-[14px] py-3'>
                      <Video size={24} style={{ opacity: 0.4 }} />
                      <p
                        className={`${gilroyRegular.className} text-neutral-50`}
                      >
                        {course?.videos?.length ?? 0} videos
                      </p>
                    </div>
                    {course.pdfs && (
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
                        {course?.duration && course.duration > 3600
                          ? `${Math.round(
                              (course.duration ?? 0) / (60 * 60)
                            )} hours`
                          : `${Math.round((course.duration ?? 0) / 60)} mins`}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className='bg-gradient w-[254px] h-[70px] items-center self-center md:self-start justify-center flex rounded-[10px] cursor-pointer'
                  onClick={handleClick}
                >
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
