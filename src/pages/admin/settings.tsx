import Sidebar from '@/src/components/Sidebar'
import { gilroyBold, gilroyRegular, gilroySemiBold } from '..'

import { Hide, Send, Show } from 'react-iconly'

import {
  getCountries,
  getCountryCallingCode
} from 'react-phone-number-input/input'
// import en from 'react-phone-number-input/locale/en.json'

import { ChangeEvent, useState } from 'react'
// import ImageUploadButton from '@/src/components/ImageUploadButton'
import Pencil from '@/public/assets/icons/pencil.svg'

function Settings () {
  const countries = getCountries()
  const [country, setCountry] = useState<string>('Cameroon')

  const [walletValue, setWalletValue] = useState('')
  const [walletDisplayValue, setWalletDisplayValue] = useState('')
  const [isWalletFocused, setIsWalletFocused] = useState(false)
  //   const [showPin, setShowPin] = useState(false)
  const [showPassword, setshowPassword] = useState(false)

  const handleWalletInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWalletValue(e.target.value)
  }

  const handleWalletBlur = () => {
    setIsWalletFocused(false)
    if (walletValue.length > 10) {
      const firstFive = walletValue.substring(0, 8)
      const lastFive = walletValue.substring(walletValue.length - 8)
      setWalletDisplayValue(`${firstFive}....${lastFive}`)
    } else {
      setWalletDisplayValue(walletValue)
    }
  }

  const handleWalletFocus = () => {
    setIsWalletFocused(true)
  }

  return (
    <Sidebar>
      <div className='ml-10 mr-28 overflow-x-hidden overflow-y-hidden'>
        <main className='grid gap-8 mt-8 ml-3 pb-20'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-5'>
            <div className='p-7 flex flex-col col-span-2 border-grey-D933 bg-grey-920D rounded-2xl border-[1px] w-full h-full justify-between gap-7'>
              <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p
                      className={`${gilroyBold.className} text-2xl text-white`}
                    >
                      Account settings
                    </p>
                    <p
                      className={`${gilroyRegular.className} text-lg text-white`}
                    >
                      Change your info
                    </p>
                  </div>
                  <div className='w-11 h-11 rounded-lg border bg-[#1D1B27] flex items-center justify-center cursor-pointer border-opacity-20 border-white'>
                    <Pencil />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-5'>
                  <div className='flex flex-col gap-3'>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Company name
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Addresse email
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Wallet USDT
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => handleWalletInputChange(e)}
                        onBlur={handleWalletBlur}
                        onFocus={handleWalletFocus}
                        value={
                          isWalletFocused ? walletValue : walletDisplayValue
                        }
                      />
                    </div>
                  </div>
                  <div className='flex flex-col gap-3'>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Minimum withdrawal amount (in USDT)
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
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
                              value={`+${getCountryCallingCode(countryCode)}`}
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
                    <div className='flex gap-1 items-center justify-between relative'>
                      <div className='bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                        <p
                          className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                        >
                          Get OTP
                        </p>
                        <input
                          className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type='numeric'
                          placeholder='_ _ _ _ _ _'
                          maxLength={6}
                        />
                      </div>
                      <div className='absolute right-1'>
                        <div className='w-[74px] h-7 flex rounded-full items-center justify-center bg-primary-400 cursor-pointer'>
                          <p
                            className={`${gilroySemiBold.className} text-xs text-white`}
                          >
                            Get code
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer'>
                <p className={`${gilroyBold.className} text-lg`}>
                  Save settings
                </p>
                <Send size={20} primaryColor='#fff' />
              </div>
            </div>
            <div className='col-span-1 p-7 flex flex-col border-grey-D933 bg-grey-920D rounded-2xl border-[1px] h-full justify-between gap-7'>
              <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p
                      className={`${gilroyBold.className} text-2xl text-white`}
                    >
                      Social links
                    </p>
                    <p
                      className={`${gilroyRegular.className} text-lg text-white`}
                    >
                      Edit links
                    </p>
                  </div>
                  <div className='w-11 h-11 rounded-lg border bg-[#1D1B27] flex items-center justify-center cursor-pointer border-opacity-20 border-white'>
                    <Pencil />
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-5'>
                  <div className='flex flex-col gap-3'>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Facebook
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Instagram
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        WhatsApp
                      </p>
                      <div className='flex items-center gap-2'>
                        <select
                          value={country}
                          onChange={event => {
                            console.log(event.target.value)
                            setCountry(event.target.value)
                          }}
                          className={`w-fit h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
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
                          className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                          placeholder='54 100 0003'
                        />
                      </div>
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        TikTok
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer'>
                <p className={`${gilroyBold.className} text-lg`}>
                  Save settings
                </p>
                <Send size={20} primaryColor='#fff' />
              </div>
            </div>
            <div className='col-span-1 p-7 flex flex-col border-grey-D933 bg-grey-920D rounded-2xl border-[1px] h-full justify-between gap-7'>
              <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p
                      className={`${gilroyBold.className} text-2xl text-white`}
                    >
                      Security
                    </p>
                    <p
                      className={`${gilroyRegular.className} text-lg text-white`}
                    >
                      Change settings
                    </p>
                  </div>
                  <div className='w-11 h-11 rounded-lg border bg-[#1D1B27] flex items-center justify-center cursor-pointer border-opacity-20 border-white'>
                    <Pencil />
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-5'>
                  <div className='flex flex-col gap-3'>
                    <div className='flex gap-1 items-center justify-between relative'>
                      <div className='bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                        <p
                          className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                        >
                          Old password
                        </p>
                        <input
                          className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type={showPassword ? 'text' : 'password'}
                          placeholder='********'
                        />
                      </div>
                      <div
                        className='absolute right-4 cursor-pointer'
                        onClick={() => setshowPassword(prev => !prev)}
                      >
                        {showPassword ? <Hide /> : <Show />}
                      </div>
                    </div>
                    <div className='flex gap-1 items-center justify-between relative'>
                      <div className='bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                        <p
                          className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                        >
                          New password
                        </p>
                        <input
                          className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type={showPassword ? 'text' : 'password'}
                          placeholder='********'
                        />
                      </div>
                      <div
                        className='absolute right-4 cursor-pointer'
                        onClick={() => setshowPassword(prev => !prev)}
                      >
                        {showPassword ? <Hide /> : <Show />}
                      </div>
                    </div>
                    <div className='flex gap-1  items-center justify-between relative'>
                      <div className='bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                        <p
                          className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                        >
                          Confirm new password
                        </p>
                        <input
                          className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type={showPassword ? 'text' : 'password'}
                          placeholder='********'
                        />
                      </div>
                      <div
                        className='absolute right-4 cursor-pointer'
                        onClick={() => setshowPassword(prev => !prev)}
                      >
                        {showPassword ? <Hide /> : <Show />}
                      </div>
                    </div>
                    <div className='flex gap-1 items-center justify-between relative'>
                      <div className='bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                        <p
                          className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                        >
                          Get OTP
                        </p>
                        <input
                          className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type='numeric'
                          placeholder='_ _ _ _ _ _'
                          maxLength={6}
                        />
                      </div>
                      <div className='absolute right-1'>
                        <div className='w-[74px] h-7 flex rounded-full items-center justify-center bg-primary-400 cursor-pointer'>
                          <p
                            className={`${gilroySemiBold.className} text-xs text-white`}
                          >
                            Get code
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer'>
                <p className={`${gilroyBold.className} text-lg`}>
                  Save settings
                </p>
                <Send size={20} primaryColor='#fff' />
              </div>
            </div>
          </div>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-5'>
            <div className='p-7 flex flex-col col-span-2 border-grey-D933 bg-grey-920D rounded-2xl border-[1px] w-full h-full justify-between gap-7'>
              <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p
                      className={`${gilroyBold.className} text-2xl text-white`}
                    >
                      Coinpayments Setup
                    </p>
                    <p
                      className={`${gilroyRegular.className} text-lg text-white`}
                    >
                      API Keys settings
                    </p>
                  </div>
                  <div className='w-11 h-11 rounded-lg border bg-[#1D1B27] flex items-center justify-center cursor-pointer border-opacity-20 border-white'>
                    <Pencil />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-5'>
                  <div className='flex flex-col gap-3'>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Public Key
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => handleWalletInputChange(e)}
                        onBlur={handleWalletBlur}
                        onFocus={handleWalletFocus}
                        value={
                          isWalletFocused ? walletValue : walletDisplayValue
                        }
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Private Key
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => handleWalletInputChange(e)}
                        onBlur={handleWalletBlur}
                        onFocus={handleWalletFocus}
                        value={
                          isWalletFocused ? walletValue : walletDisplayValue
                        }
                      />
                    </div>
                  </div>
                  <div className='flex flex-col gap-3'>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Secret Key
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => handleWalletInputChange(e)}
                        onBlur={handleWalletBlur}
                        onFocus={handleWalletFocus}
                        value={
                          isWalletFocused ? walletValue : walletDisplayValue
                        }
                      />
                    </div>
                    <div className='flex gap-1 items-center justify-between relative'>
                      <div className='bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                        <p
                          className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                        >
                          Get OTP
                        </p>
                        <input
                          className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type='numeric'
                          placeholder='_ _ _ _ _ _'
                          maxLength={6}
                        />
                      </div>
                      <div className='absolute right-1'>
                        <div className='w-[74px] h-7 flex rounded-full items-center justify-center bg-primary-400 cursor-pointer'>
                          <p
                            className={`${gilroySemiBold.className} text-xs text-white`}
                          >
                            Get code
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer'>
                <p className={`${gilroyBold.className} text-lg`}>
                  Save settings
                </p>
                <Send size={20} primaryColor='#fff' />
              </div>
            </div>
            <div className='col-span-2 p-7 flex flex-col border-grey-D933 bg-grey-920D rounded-2xl border-[1px] h-full justify-between gap-7'>
              <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p
                      className={`${gilroyBold.className} text-2xl text-white`}
                    >
                      Video Server
                    </p>
                    <p
                      className={`${gilroyRegular.className} text-lg text-white`}
                    >
                      API Keys settings
                    </p>
                  </div>
                  <div className='w-11 h-11 rounded-lg border bg-[#1D1B27] flex items-center justify-center cursor-pointer border-opacity-20 border-white'>
                    <Pencil />
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-5'>
                  <div className='flex flex-col gap-3'>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Public Key
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => handleWalletInputChange(e)}
                        onBlur={handleWalletBlur}
                        onFocus={handleWalletFocus}
                        value={
                          isWalletFocused ? walletValue : walletDisplayValue
                        }
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Secret Key
                      </p>
                      <input
                        className={`w-full h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => handleWalletInputChange(e)}
                        onBlur={handleWalletBlur}
                        onFocus={handleWalletFocus}
                        value={
                          isWalletFocused ? walletValue : walletDisplayValue
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer'>
                <p className={`${gilroyBold.className} text-lg`}>
                  Save settings
                </p>
                <Send size={20} primaryColor='#fff' />
              </div>
            </div>
          </div>
        </main>
      </div>
    </Sidebar>
  )
}

export default Settings
