import Sidebar from '@/src/components/Sidebar'
import { gilroyBold, gilroyRegular } from '..'
import { MapProvider } from '@/src/providers/map-provider'
import { MapComponent } from '@/src/components/Map'

import Facebook from '@/public/assets/icons/facebook.svg'
import Instagram from '@/public/assets/icons/instagram.svg'
import WhatsApp from '@/public/assets/icons/whatsapp.svg'
import Telegram from '@/public/assets/icons/telegram-white.svg'
import { Call, Location, Message as MessageIcon, Send } from 'react-iconly'
import Link from 'next/link'

import {
  getCountries,
  getCountryCallingCode
} from 'react-phone-number-input/input'

import { useState } from 'react'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { useGetUser } from '@/src/hooks/user'
import { useContactUs } from '@/src/hooks/useContact'
import { ClipLoader } from 'react-spinners'
import { useGetPublicSocials } from '@/src/hooks/socials'

function Message () {
  const countries = getCountries()
  const [country, setCountry] = useState<string>('Cameroon')
  const [firstName, setFirstName] = useState<string>()
  const [lastName, setLastName] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [countryCode, setCountryCode] = useState<string>()
  const [phoneNumber, setPhoneNumber] = useState<string>()
  const [message, setMessage] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  const { data } = useGetUser()

  const { data: socials } = useGetPublicSocials()

  const handleContactUs = async () => {
    try {
      setIsSendingMessage(true)
      await contactUs({
        name: firstName ?? data?.firstName ?? '',
        surname: lastName ?? data?.lastName ?? '',
        email: email ?? data?.email ?? '',
        phoneNumber:
          (countryCode ?? data?.countryCode ?? '+237') +
          (phoneNumber ?? data?.phoneNumber ?? ''),
        message
      })
    } catch (error) {
      console.error({ error }, 'sending message')
    } finally {
      setIsSendingMessage(false)
    }
  }

  const { mutateAsync: contactUs } = useContactUs()

  return (
    <Sidebar>
      <div className='px-6 sm:px-10 md:px-20 lg:px-28 overflow-x-hidden overflow-y-hidden'>
        <main className='mt-8 pb-20 grid grid-cols-1 md:grid-cols-2 gap-10'>
          <div className='w-full flex flex-col gap-7 order-2 md:order-1'>
            <div className='pb-5 border-b-[1px] border-neutral-1A'>
              <p
                className={`${gilroyBold.className} text-3xl sm:text-[40px] leading-10`}
              >
                Envoyer un message
              </p>
              <p className={`${gilroyRegular.className} text-base sm:text-lg `}>
                Remplissez le formulaire
              </p>
            </div>
            <div className='w-full md:w-[438px]'>
              <MapProvider>
                <MapComponent />
              </MapProvider>
            </div>
            <div className='flex gap-3 items-center'>
              <Link
                href={socials?.facebook ?? '#'}
                className='h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-grey-bg flex items-center justify-center'
              >
                <Facebook className='w-5 h-5 sm:w-6 sm:h-6' stroke='#ffffff' />
              </Link>
              <Link
                href={'#'}
                className='h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-grey-bg flex items-center justify-center'
              >
                <Telegram className='w-5 h-5 sm:w-6 sm:h-6' />
              </Link>
              <Link
                href={socials?.whatsapp ?? '#'}
                className='h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-grey-bg flex items-center justify-center'
              >
                <WhatsApp className='w-5 h-5 sm:w-6 sm:h-6' stroke='#ffffff' />
              </Link>
              <Link
                href={socials?.instagram ?? '#'}
                className='h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-grey-bg flex items-center justify-center'
              >
                <Instagram className='w-5 h-5 sm:w-6 sm:h-6' stroke='#ffffff' />
              </Link>
            </div>
            <div className='grid gap-5'>
              <div className='flex items-start gap-2 sm:gap-[6px]'>
                <Location size={24} primaryColor='#fff' />
                <div className='flex flex-col gap-3'>
                  <p className={`${gilroyBold.className} text-base text-white`}>
                    Douala - Cameroun
                  </p>
                  <div>
                    <p
                      className={`${gilroyRegular.className} text-base text-white`}
                    >
                      Situé au carrefour Douala Bercy
                    </p>
                    <p
                      className={`${gilroyRegular.className} text-base text-white`}
                    >
                      BP : 15170 Akwa Douala
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex items-start gap-2 sm:gap-[6px]'>
                  <div className='flex flex-col gap-3'>
                    <MessageIcon size={24} primaryColor='#fff' />
                    <Call size={24} primaryColor='#fff' />
                  </div>
                  <div className='flex flex-col gap-3'>
                    <Link
                      href={`mailto:info@gatna.io`}
                      className={`${gilroyRegular.className} text-base text-white opacity-90 underline`}
                    >
                      info@gatna.io
                    </Link>
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
          </div>
          <div className='w-full flex flex-col gap-10 mt-4 order-1 md:order-2'>
            <div className='w-full p-4 flex flex-col border-grey-D933 bg-grey-920D rounded-2xl border-[1px] gap-8 sm:gap-16'>
              <div className='flex flex-col gap-3'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-3'>
                    <div className='bg-grey-bg rounded-lg h-[60px] sm:h-[70px] flex flex-col px-5 py-3 sm:py-4 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Nom
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        defaultValue={data?.firstName}
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-[60px] sm:h-[70px] flex flex-col px-5 py-3 sm:py-4 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Addresse email
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        defaultValue={data?.email}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col gap-3'>
                    <div className='bg-grey-bg rounded-lg h-[60px] sm:h-[70px] flex flex-col px-5 py-3 sm:py-4 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Prenoms
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        defaultValue={data?.lastName}
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-[60px] sm:h-[70px] flex flex-col px-5 py-3 sm:py-4 gap-1'>
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
                          className={`w-14 sm:w-16 h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                        >
                          <option value=''>
                            +{getCountryCallingCode('CM')}
                          </option>
                          {countries.map(countryCode => (
                            <option
                              key={countryCode}
                              value={`+${getCountryCallingCode(countryCode)}`}
                            >
                              +{getCountryCallingCode(countryCode)}
                            </option>
                          ))}
                        </select>
                        <input
                          className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                          placeholder='54 100 0003'
                          defaultValue={data?.phoneNumber}
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bg-grey-bg rounded-lg h-[120px] sm:h-[142px] flex flex-col px-5 py-4 gap-1'>
                  <p
                    className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                  >
                    Votre message
                  </p>
                  <textarea
                    className={`w-full h-full text-input bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button
              className={`bg-gradient flex items-center gap-2 sm:gap-[10px] px-6 sm:px-8 py-4 sm:py-5 w-fit rounded-[10px] cursor-pointer ${
                isSendingMessage && 'opacity-60'
              }`}
              disabled={isSendingMessage}
              onClick={handleContactUs}
            >
              <p className={`${gilroyBold.className} text-base sm:text-lg`}>
                Envoyer votre message
              </p>
              {isSendingMessage ? (
                <ClipLoader size={20} color='#fff' />
              ) : (
                <Send size={20} primaryColor='#fff' />
              )}
            </button>
          </div>
        </main>
      </div>
    </Sidebar>
  )
}

export default Message

export async function getServerSideProps (context: GetServerSidePropsContext) {
  const session = await getSession(context)

  // Check if the user is authenticated
  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    }
  }

  // If there is a user
  return {
    props: { session }
  }
}
