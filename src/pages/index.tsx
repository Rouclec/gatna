import localFont from 'next/font/local'
import profile1 from '@/public/assets/images/profile1.png'
import profile2 from '@/public/assets/images/profile2.png'
import profile3 from '@/public/assets/images/profile3.png'
import profile4 from '@/public/assets/images/profile4.png'
import Plus from '@/public/assets/icons/plus.svg'
import SpiralArrow from '@/public/assets/icons/spiral-arrow.svg'
import WhatsApp from '@/public/assets/icons/whatsapp.svg'
import Telegram from '@/public/assets/icons/telegram-blue.svg'
import landingimage from '@/public/assets/images/landing-page-image.png'
import { CourseDetails, Navbar } from '../components'

import Image from 'next/image'
import { MapProvider } from '../providers/map-provider'
import { MapComponent } from '../components/Map'
import { Send } from 'react-iconly'
import { useState } from 'react'
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})
export const gilroyRegular = localFont({
  src: './fonts/Gilroy-Regular.woff',
  variable: '--font-gilroy-regular',
  weight: '400'
})
export const gilroyMedium = localFont({
  src: './fonts/Gilroy-Medium.woff',
  variable: '--font-gilroy-medium',
  weight: '500'
})
export const gilroySemiBold = localFont({
  src: './fonts/Gilroy-SemiBold.woff',
  variable: '--font-gilroy-semibold',
  weight: '600'
})
export const gilroyBold = localFont({
  src: './fonts/Gilroy-Bold.woff',
  variable: '--font-gilroy-bold',
  weight: '700'
})
export const gilroyBlack = localFont({
  src: './fonts/Gilroy-Black.woff',
  variable: '--font-gilroy-black',
  weight: '900'
})

export const gilroyHeavy = localFont({
  src: './fonts/Gilroy-Heavy.woff',
  variable: '--font-gilroy-heavy',
  weight: '1200'
})

const profiles = [
  {
    icon: (
      <Image
        src={profile1}
        alt='profile1'
        className='w-full h-full rounded-full'
      />
    )
  },
  {
    icon: (
      <Image
        src={profile2}
        alt='profile2'
        className='w-full h-full rounded-full'
      />
    )
  },
  {
    icon: (
      <Image
        src={profile3}
        alt='profile3'
        className='w-full h-full rounded-full'
      />
    )
  },
  {
    icon: (
      <Image
        src={profile4}
        alt='profile4'
        className='w-full h-full rounded-full'
      />
    )
  },
  {
    icon: <Plus primaryColor='#ffffff' className='w-7 h-7' />
  }
]

const courses = [
  {
    course: {
      videoURL: '123456',
      id: '1',
      title: 'Apprenez les bases du trading.',
      description:
        'Comprendre comment fonctionne le monde de la crypto monnaie, est une formation nécessaire dans ce plan.',
      videos: '9',
      pdf: '12345',
      duration: '41',
      tag: 'Gatna I',
      watermark: 'Gatna 1',
      price: '250'
    }
  },
  {
    course: {
      videoURL: '123456',
      id: '2',
      title: 'Analyse pyschologique du trader',
      description:
        'Comprendre comment fonctionne le monde de la crypto monnaie, est une formation nécessaire dans ce plan.',
      videos: '9',
      pdf: '213510',
      duration: '41',
      tag: 'Gatna II',
      watermark: 'Gatna 2',
      price: '500'
    }
  },
  {
    course: {
      videoURL: '123456',
      id: '3',
      title: 'Apprenez les bases du trading.',
      description:
        'Comprendre comment fonctionne le monde de la crypto monnaie, est une formation nécessaire dans ce plan.',
      videos: '9',
      duration: '41',
      tag: 'Gatna III',
      watermark: 'Gatna 3',
      price: '10000'
    }
  },
  {
    course: {
      videoURL: '123456',
      id: '4',
      title: 'Analyse psychologique du trader',
      description:
        'Comprendre comment fonctionne le monde de la crypto monnaie, est une formation nécessaire dans ce plan.',
      videos: '9',
      duration: '41',
      tag: 'Gatna IV',
      watermark: 'Gatna 4',
      price: '2500'
    }
  },
  {
    course: {
      videoURL: '123456',
      id: '5',
      title: 'Analyse psychologique du trader',
      description:
        'Comprendre comment fonctionne le monde de la crypto monnaie, est une formation nécessaire dans ce plan.',
      videos: '9',
      duration: '41',
      pdf: '123456',
      tag: 'Gatna V',
      watermark: 'Gatna 5',
      price: '3000'
    }
  }
]

const colors = ['#8250ED', '#F2714E', '#8EAD12', '#EF4439', '#0665BD']

export default function Home () {
  const countries = getCountries();
  const [country, setCountry] = useState<string>("Cameroon");

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} ${gilroyRegular.variable} ${gilroyMedium.variable} ${gilroyBold.variable} ${gilroyBlack.variable} grid lg:container mx-auto`}
    >
      <Navbar />
      <main className='grid mt-16 lg:mt-[104px] pt-[136px] px-6 lg:px-10'>
        <div className='relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center px-0 lg:px-32 mx-auto'>
          <div className='relative md:order-1 order-2 h-full'>
            <div className='grid gap-6 px-4'>
              <p className='font-readex font-bold text-3xl md:text-5xl w-full'>
                Formation crypto avec gantna.io
              </p>
              <p className={`${gilroyRegular.className} text-lg md:text-2xl`}>
                Achetez vos formations crypto et obtenez un nombre de pièces en
                staking pouvant vous générer jusqu’à 20% de ROI.
              </p>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex h-[60px] w-full  items-center justify-center bg-gradient rounded-[10px]'>
                  <p
                    className={`${gilroyBold.className} text-base text-neutral-10`}
                  >
                    Acheter ma formation
                  </p>
                </div>
                <div className='flex h-[60px] w-full items-center justify-center bg-neutral-24 rounded-[10px]'>
                  <p
                    className={`${gilroyBold.className} text-base text-neutral-10`}
                  >
                    J’ai déjà un compte
                  </p>
                </div>
              </div>
              <div className='relative flex flex-col md:flex-row mt-4 gap-4 items-center w-full'>
                <SpiralArrow className='absolute w-36 h-40 right-full mr-4 -bottom-4' />
                <div className='flex items-center justify-center relative px-2'>
                  {profiles.map((profile, index) => {
                    const zIndex = 4 * index

                    return (
                      <div
                        key={index}
                        className={`w-12 h-12 md:w-14 md:h-14 items-center justify-center rounded-full bg-gradient z-[${zIndex}] flex -ml-4`}
                      >
                        {profile.icon}
                      </div>
                    )
                  })}
                </div>
                <p
                  className={`w-full md:w-[245px] ${gilroyMedium.className} text-neutral-10 text-center md:text-left`}
                >
                  Plus de <span className={`${gilroyBold.className}`}>120</span>{' '}
                  utilisateurs abonnés suivent nos formations
                </p>
              </div>
            </div>
          </div>

          <div className='mx-auto md:order-2 order-1'>
            <div className=''>
              <Image
                src={landingimage}
                alt='landing-image'
                className='w-full max-w-[556px] h-[432px] z-10'
              />
            </div>
          </div>
        </div>
        <div className='grid my-16 lg:my-64 gap-10 lg:gap-48'>
          {courses.map(({ course }, index) => {
            return (
              <div key={course.id}>
                <CourseDetails
                  course={course}
                  inverted={index % 2 !== 0}
                  pinColor={colors[index % 5]}
                />
              </div>
            )
          })}
        </div>
        <div className='flex flex-col gap-14 justify-center'>
          <div className='grid grid-cols-7 gap-4 md:gap-[72px] relative'>
            <div className='col-span-7 grid items-center md:justify-start justify-center md:col-span-3'>
              <p
                className={`${gilroyBlack.className} text-3xl md:text-[40px] text-center md:text-left leading-[50px]`}
              >
                Contactez-nous
              </p>
              <p
                className={`${gilroyRegular.className} text-xl text-center md:text-left`}
              >
                Nous sommes disponible sur ces canaux
              </p>
            </div>
            <div className='col-span-7 md:col-span-4 whitespace-nowrap overflow-hidden text-clip'>
              <p
                className={`${gilroyHeavy.className} hidden md:block text-[200px] absolute leading-[225px] -top-10 overflow-hidden opacity-[2%]`}
              >
                Ecrivez nous
              </p>
            </div>
          </div>
          <div className='grid grid-cols-7 gap-4 md:gap-[72px]'>
            <div className='col-span-7 md:col-span-3 grid gap-12'>
              <div className='grid grid-cols-1  md:grid-cols-2 gap-6'>
                <div className='h-[190px] bg-grey-bg rounded-3xl flex flex-col p-[18px] justify-between'>
                  <div className='flex gap-[6px] items-center'>
                    <div className='w-[44px] h-[44px] rounded-xl bg-neutral-10 items-center justify-center flex'>
                      <Telegram className='w-6 h-6' />
                    </div>
                    <div>
                      <p className={`${gilroyBold.className} text-base`}>
                        Telegram
                      </p>
                      <p className={`${gilroyRegular.className} text-sm`}>
                        +971 50 829 1203
                      </p>
                    </div>
                  </div>
                  <div className='h-12 items-center justify-center flex rounded-lg bg-telegram'>
                    <p className={`${gilroySemiBold.className} text-sm`}>
                      Chat us
                    </p>
                  </div>
                </div>
                <div className='h-[190px] bg-grey-bg rounded-3xl flex flex-col p-[18px] justify-between'>
                  <div className='flex gap-[6px] items-center'>
                    <div className='w-[44px] h-[44px] rounded-xl bg-neutral-10 items-center justify-center flex'>
                      <WhatsApp className='w-6 h-6' stroke='#14A42B' />
                    </div>
                    <div>
                      <p className={`${gilroyBold.className} text-base`}>
                        WhatsApp
                      </p>
                      <p className={`${gilroyRegular.className} text-sm`}>
                        +971 50 829 1203
                      </p>
                    </div>
                  </div>
                  <div className='h-12 items-center justify-center flex rounded-lg bg-whatsapp'>
                    <p className={`${gilroySemiBold.className} text-sm`}>
                      Chat us
                    </p>
                  </div>
                </div>
              </div>
              <MapProvider>
                <MapComponent />
              </MapProvider>
            </div>
            <div className='col-span-7 md:col-span-4'>
              <p
                className={`text-4xl md:hidden text-center text-white text-opacity-[2%] ${gilroyHeavy.className}`}
              >
                Encrivez nous
              </p>
              <div className='w-full flex flex-col gap-10 mt-4'>
                <div className='w-full p-4 flex flex-col border-grey-D933 bg-grey-920D rounded-2xl border-[1px] gap-16'>
                  <div className='flex flex-col gap-3'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='flex flex-col gap-3'>
                        <div className='bg-grey-bg rounded-lg h-[70px] flex flex-col px-5 py-4 gap-1'>
                          <p
                            className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                          >
                            Nom
                          </p>
                          <input
                            className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                          />
                        </div>
                        <div className='bg-grey-bg rounded-lg h-[70px] flex flex-col px-5 py-4 gap-1'>
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
                      <div className='flex flex-col gap-3'>
                        <div className='bg-grey-bg rounded-lg h-[70px] flex flex-col px-5 py-4 gap-1'>
                          <p
                            className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                          >
                            Prenoms
                          </p>
                          <input
                            className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                          />
                        </div>
                        <div className='bg-grey-bg rounded-lg h-[70px] flex flex-col px-5 py-4 gap-1'>
                          <p
                            className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                          >
                            Telephone
                          </p>
                          <div className='flex items-center gap-2'>
                            <select
                              value={country}
                              onChange={event => {
                                console.log(event.target.value)
                                setCountry(event.target.value)
                              }}
                              className={`w-16 h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                            >
                              <option value=''>
                                +{getCountryCallingCode('CM')}
                              </option>
                              {countries.map(countryCode => (
                                <option
                                  key={countryCode}
                                  value={`+${getCountryCallingCode(
                                    countryCode
                                  )}`}
                                >
                                  +{getCountryCallingCode(countryCode)}
                                </option>
                              ))}
                            </select>
                            <input
                              className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                              placeholder='54 100 0003'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='bg-grey-bg rounded-lg h-[142px] flex flex-col p-5 gap-1'>
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
                <div className='bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer'>
                  <p className={`${gilroyBold.className} text-lg`}>
                    Envoyer votre message
                  </p>
                  <Send size={20} primaryColor='#fff' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'></footer>
    </div>
  )
}

{
  /* <main className="grid mt-[104px] px-40 pt-[136px]">
        <div className="grid grid-cols-2 gap-8 relative">
          <div className="pt-8">
            <div className="grid gap-9">
              <p className="font-readex font-bold text-6xl">
                Formation crypto avec gantna.io
              </p>
              <p className={`${gilroyRegular.className} text-2xl`}>
                {`Achetez vos formations crypto et obtenez un nombre de pièces en
                staking pouvant vous générer jusqu’a 20% de ROI.`}
              </p>
              <div className="flex gap-[18px]">
                <div className="flex h-[70px] w-full items-center justify-center bg-gradient rounded-[10px]">
                  <p
                    className={`${gilroyBold.className} text-base text-neutral-10`}
                  >
                    Acheter ma formation
                  </p>
                </div>
                <div className="flex h-[70px] w-full items-center justify-center bg-neutral-24 rounded-[10px]">
                  <p
                    className={`${gilroyBold.className} text-base text-neutral-10`}
                  >{`J’ai deja un compte`}</p>
                </div>
              </div>
              <div className="relative flex mt-6 gap-7 items-center w-full">
                <SpiralArrow className="w-[400px] h-[180px] absolute -left-[300px] -bottom-[32px]" />
                <div className="flex items-center justify-center relative px-4">
                  {profiles.map((profile, index) => {
                    const zIndex = 4 * index; // Z-index for layering

                    return (
                      <div
                        key={index}
                        className={`w-14 h-14 items-center justify-center rounded-full bg-gradient z-[${zIndex}] flex -ml-7`}
                      >
                        {profile.icon}
                      </div>
                    );
                  })}
                </div>

                <p
                  className={`w-[245px] ${gilroyMedium.className} text-neutral-10`}
                >
                  Plus de <span className={`${gilroyBold.className}`}>120</span>{" "}
                  utilisateurs abonnés suivent nos formations
                </p>
              </div>
            </div>
          </div>
          <div className="items-center justify-center my-4 relative">
            <div className="items-center justify-center realtive">
              <div className="pl-8 absolute">
                <Image
                  src={landingimage}
                  alt="landing-image"
                  className="w-[556px] h-[432px] z-10"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          {courses.map(({ course }, index) => {
            return (
              <div key={course.id}>
                <CourseDetails
                  course={course}
                  inverted={index % 2 !== 0}
                  pinColor={colors[index % 5]}
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-14 h-screen justify-center">
          <div className="grid grid-cols-7 gap-[72px] relative">
            <div className="col-span-3">
              <p
                className={`${gilroyBlack.className} text-[40px] leading-[50px]`}
              >
                Contactez-nous
              </p>
              <p className={`${gilroyRegular.className} text-xl`}>
                Nous sommes disponible sur ces canaux
              </p>
            </div>
            <div className="col-span-4 whitespace-nowrap overflow-hidden text-clip">
              <p
                className={`${gilroyHeavy.className} text-[200px] absolute leading-[225px] -top-10 overflow-hidden opacity-[2%]`}
              >
                Ecrivez nous
              </p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-[72px]">
            <div className="col-span-3 grid gap-12">
              <div className="grid grid-cols-2 gap-6">
                <div className="h-[190px] bg-grey-bg rounded-3xl flex flex-col p-[18px] justify-between">
                  <div className="flex gap-[6px] items-center">
                    <div className="w-[44px] h-[44px] rounded-xl bg-neutral-10 items-center justify-center flex">
                      <Telegram className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`${gilroyBold.className} text-base`}>
                        Telegram
                      </p>
                      <p className={`${gilroyRegular.className} text-sm`}>
                        +971 50 829 1203
                      </p>
                    </div>
                  </div>
                  <div className="h-12 items-center justify-center flex rounded-lg bg-telegram"><p className={`${gilroySemiBold.className} text-sm`}>Chat us</p></div>
                </div>
                <div className="h-[190px] bg-grey-bg rounded-3xl flex flex-col p-[18px] justify-between">
                  <div className="flex gap-[6px] items-center">
                    <div className="w-[44px] h-[44px] rounded-xl bg-neutral-10 items-center justify-center flex">
                      <WhatsApp className="w-6 h-6" stroke="#14A42B" />
                    </div>
                    <div>
                      <p className={`${gilroyBold.className} text-base`}>
                        WhatsApp
                      </p>
                      <p className={`${gilroyRegular.className} text-sm`}>
                        +971 50 829 1203
                      </p>
                    </div>
                  </div>
                  <div className="h-12 items-center justify-center flex rounded-lg bg-whatsapp"><p className={`${gilroySemiBold.className} text-sm`}>Chat us</p></div>
                </div>
              </div>
              <MapProvider>
                <MapComponent />
              </MapProvider>
            </div>
            <div className="col-span-4">
              <p>Second section</p>
            </div>
          </div>
        </div>
      </main> */
}
