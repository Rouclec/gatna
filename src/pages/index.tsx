import localFont from 'next/font/local'
import profile1 from '@/public/assets/images/profile1.png'
import profile2 from '@/public/assets/images/profile2.png'
import profile3 from '@/public/assets/images/profile3.png'
import profile4 from '@/public/assets/images/profile4.png'
import logo from '@/public/assets/images/logo.png'
import Plus from '@/public/assets/icons/plus.svg'
import SpiralArrow from '@/public/assets/icons/spiral-arrow.svg'
import Location from '@/public/assets/icons/location.svg'
import WhatsApp from '@/public/assets/icons/whatsapp.svg'
import Telegram from '@/public/assets/icons/telegram-blue.svg'
import landingimage from '@/public/assets/images/landing-page-image.png'
import { CourseDetails, Navbar } from '../components'

import Image from 'next/image'
import { MapProvider } from '../providers/map-provider'
import { MapComponent } from '../components/Map'
import { Call, Message, Send } from 'react-iconly'
import { useEffect, useState } from 'react'
import {
  getCountries,
  getCountryCallingCode
} from 'react-phone-number-input/input'
import Footer from '../components/Footer'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useGetCourses } from '../hooks/course'
import { ClipLoader } from 'react-spinners'
import { useContactUs } from '../hooks/useContact'

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

const colors = ['#8250ED', '#F2714E', '#8EAD12', '#EF4439', '#0665BD']
const importantLinks = [
  {
    name: 'Home',
    route: '/'
  },
  {
    name: 'About us',
    route: '/'
  },
  {
    name: 'Terms & conditions',
    route: '/'
  },
  {
    name: 'Privacy policies',
    route: '/'
  }
]

export default function Home () {
  const countries = getCountries()
  const [country, setCountry] = useState<string>('Cameroon')
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [name, setName] = useState<string>('')
  const [surname, setSurname] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [countryCode, setCountryCode] = useState<string>('+237')
  const [message, setMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const router = useRouter()

  const { query } = router

  console.log({ query })

  const { data: coursesData, isFetched: isCoursesDataFetched } = useGetCourses()

  const handleContactUs = async () => {
    try {
      setIsSendingMessage(true)
      await contactUs({
        name,
        surname,
        email,
        phoneNumber: countryCode + phoneNumber,
        message
      })
    } catch (error) {
      console.error({ error }, 'sending message')
    } finally {
      setIsSendingMessage(false)
    }
  }

  useEffect(() => {
    if (query?.referal) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('@referal', JSON.stringify(query?.referal))
      }
    }
  }, [query])

  const { mutateAsync: contactUs } = useContactUs()

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} ${gilroyRegular.variable} ${gilroyMedium.variable} ${gilroyBold.variable} ${gilroyBlack.variable} grid lg:container mx-auto`}
    >
      <Navbar />
      <main className='grid mt-16 lg:mt-[104px] pt-[136px] px-6 lg:px-10'>
        <section id=''>
          <div className='relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center px-0 lg:px-32 mx-auto'>
            <div className='relative md:order-1 order-2 h-full'>
              <div className='grid gap-6 px-4'>
                <p className='font-readex font-bold text-3xl md:text-5xl w-full'>
                  Formation crypto avec gantna.io
                </p>
                <p className={`${gilroyRegular.className} text-lg md:text-2xl`}>
                  Achetez vos formations crypto et obtenez un nombre de pièces
                  en staking pouvant vous générer jusqu&apos;à 20% de ROI.
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
                      J&apos;ai déjà un compte
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
                    Plus de{' '}
                    <span className={`${gilroyBold.className}`}>120</span>{' '}
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
                  className='w-full max-w-[556px] h-auto lg:h-[432px] z-10'
                />
              </div>
            </div>
          </div>
        </section>
        <section id='courses'>
          <div className='grid my-16 lg:my-64 gap-10 lg:gap-48'>
            {isCoursesDataFetched ? (
              coursesData?.map((course, index) => {
                return (
                  <div key={course?._id}>
                    <CourseDetails
                      course={course}
                      inverted={index % 2 !== 0}
                      pinColor={colors[index % 5]}
                    />
                  </div>
                )
              })
            ) : (
              <div className='mx-auto'>
                <ClipLoader size={32} color='#fff' />
              </div>
            )}
          </div>
        </section>
        <section id='contact'>
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
                    <Link
                      className='h-12 items-center cursor-pointer justify-center flex rounded-lg bg-telegram'
                      href={'https://t.me/971508291203'}
                      target='_blank'
                    >
                      <p className={`${gilroySemiBold.className} text-sm`}>
                        Chat us
                      </p>
                    </Link>
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
                    <Link
                      className='h-12 cursor-pointer items-center justify-center flex rounded-lg bg-whatsapp'
                      href={'https://wa.me/971508291203'}
                      target='_blank'
                    >
                      <p className={`${gilroySemiBold.className} text-sm`}>
                        Chat us
                      </p>
                    </Link>
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
                              className={`w-full h-full text-input bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                              onChange={e => setName(e.target.value)}
                              value={name}
                            />
                          </div>
                          <div className='bg-grey-bg rounded-lg h-[70px] flex flex-col px-5 py-4 gap-1'>
                            <p
                              className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                            >
                              Addresse email
                            </p>
                            <input
                              className={`w-full h-full text-input bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                              onChange={e => setEmail(e.target.value)}
                              value={email}
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
                              className={`w-full h-full text-input bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                              onChange={e => setSurname(e.target.value)}
                              value={surname}
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
                                  setCountry(event.target.value)
                                  setCountryCode(event.target.value)
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
                                className={`w-full h-full text-input bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                                placeholder='54 100 0003'
                                onChange={e => setPhoneNumber(e.target.value)}
                                value={phoneNumber}
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
                          className={`w-full h-full text-input bg-transparent outline-none text-neutral-10 focus:ring-0 ${gilroyBold.className}`}
                          onChange={e => setMessage(e.target.value)}
                          value={message}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className={`bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer ${
                      isSendingMessage && 'opacity-60'
                    }`}
                    disabled={isSendingMessage}
                    onClick={handleContactUs}
                  >
                    <p className={`${gilroyBold.className} text-lg`}>
                      Envoyer votre message
                    </p>
                    {isSendingMessage ? (
                      <ClipLoader size={20} color='#fff' />
                    ) : (
                      <Send size={20} primaryColor='#fff' />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className='grid bg-grey-bg mt-16 lg:mt-60'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 items-center py-6 lg:pt-20 lg:pb-12 w-full px-6 lg:px-36'>
          <div className='col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3'>
            <div className='grid items-start justify-between gap-6'>
              <Image
                src={logo}
                alt='logo'
                className='w-[170px] h-[62px] cursor-pointer'
              />
              <div className='grid items-start gap-3'>
                <div className='flex flex-row gap-2 items-center'>
                  <Location />
                  <p className={`${gilroyBold.className}`}>Douala - Cameroon</p>
                </div>
                <p
                  className={`pl-8 text-opacity-90 ${gilroyRegular.className}`}
                >
                  Situé au carrefour Douala Bercy
                  <br />
                  BP : 15170 Akwa Douala
                </p>
              </div>
            </div>
            <div className='grid gap-6 items-start'>
              <p className={`${gilroyBold.className}`}>Important links</p>
              <div className='grid gap-3'>
                {importantLinks.map((link, index) => {
                  return (
                    <p
                      key={index}
                      className={`cursor-pointer text-opacity-90 ${gilroyRegular.className}`}
                      onClick={() => router.push(link.route)}
                    >
                      <span className='text-primary-400'>-</span> {link.name}
                    </p>
                  )
                })}
              </div>
            </div>
            <div className='flex flex-col gap-6 items-start'>
              <p className={`${gilroyBold.className}`}>Contact us</p>
              <div className='grid gap-3'>
                <div className='flex flex-row gap-2 items-center'>
                  <Message size={20} primaryColor='#8250ED' />
                  <Link
                    href={`mailto:info@gatna.io`}
                    className={`${gilroyRegular.className} text-base text-white opacity-90 underline`}
                  >
                    info@gatna.io
                  </Link>
                </div>
                <div className='flex flex-row gap-2 items-start'>
                  <Call size={20} primaryColor='#8250ED' />
                  <div>
                    <Link
                      href={`tel:+237657878787`}
                      className={`${gilroyRegular.className} text-base cursor-pointer text-white`}
                    >
                      +237 657 87 87 87
                    </Link>
                    <br />
                    <Link
                      href={`tel:+237681618161`}
                      className={`${gilroyRegular.className} text-base cursor-pointer text-white`}
                    >
                      +237 681 61 81 61
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-span-1 flex flex-col gap-6 items-start h-full'>
            <p className={`${gilroyBold.className}`}>Subscribe to Newsletter</p>
            <div className='w-full p-4 rounded-[10px] flex items-center bg-82 bg-opacity-20 gap-3'>
              {/* Icon with no grow or shrink */}
              <div className='flex-none'>
                <Message primaryColor='#fff' size={20} />
              </div>

              {/* Input with flex-grow to take remaining space */}
              <input
                className={`flex-grow max-w-full text-input focus:outline-none text-neutral-10 bg-transparent min-w-2 placeholder:text-white ${gilroyRegular.className}`}
                placeholder='Your Email'
              />

              {/* Button with no grow or shrink */}
              <div className='flex-none'>
                <button className='button-primary flex items-center px-3 py-[10px] rounded-md'>
                  <p
                    className={`${gilroyBold.className} text-[10px] leading-3 text-white`}
                  >
                    Subscribe
                  </p>
                  <Send size={16} primaryColor='#fff' />
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </footer>
    </div>
  )
}
