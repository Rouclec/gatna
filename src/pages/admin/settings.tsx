import Sidebar from '@/src/components/Sidebar'
import { gilroyBold, gilroyRegular, gilroySemiBold } from '..'

import { Hide, Send, Show } from 'react-iconly'

import {
  getCountries,
  getCountryCallingCode
} from 'react-phone-number-input/input'
import { ClipLoader, FadeLoader } from 'react-spinners'
// import en from 'react-phone-number-input/locale/en.json'

import { ChangeEvent, useEffect, useState } from 'react'
// import ImageUploadButton from '@/src/components/ImageUploadButton'
import Pencil from '@/public/assets/icons/pencil.svg'
import { GetServerSidePropsContext } from 'next'
import { getSession, useSession } from 'next-auth/react'
import {
  // useCreateAccount,
  useGetAccountOTP,
  useGetUserAccount,
  useUpdateAccount
} from '@/src/hooks/account'
import {
  useCreateSocials,
  useGetUserSocials,
  useUpdateSocials
} from '@/src/hooks/socials'
import { useGetUserOTP, useUpdatePassword } from '@/src/hooks/auth'
import {
  useCreateVideoServer,
  useGetVideoServer,
  useUpdateVideoServer
} from '@/src/hooks/videoserver'
import {
  // useCreateCoinpayment,
  useGetCoinpayment,
  useGetCoinpaymentOTP,
  useUpdateCoinpayment
} from '@/src/hooks/coinpayment'

function Settings () {
  const session = useSession()
  const countries = getCountries()
  const [country, setCountry] = useState<string>('Cameroon')
  const [isAccountLoading, setIsAccountLoading] = useState(false)
  const [isSocialsLoading, setIsSocialsLoading] = useState(false)
  const [isSecurityLoading, setIsSecurityLoading] = useState(false)
  const [isVideoServerLoading, setIsVideoServerLoading] = useState(false)
  const [isCoinPaymentLoading, setIsCounPaymentLoding] = useState(false)

  const [walletValue, setWalletValue] = useState('')
  const [walletDisplayValue, setWalletDisplayValue] = useState('')
  const [isWalletFocused, setIsWalletFocused] = useState(false)

  //   const [showPin, setShowPin] = useState(false)
  //   const [showPin, setShowPin] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [editAccount, setEditAccount] = useState(false)
  const [editSocials, setEditSocials] = useState(false)
  const [editSecurity, setEditSecurity] = useState(false)
  const [editCoinpayment, setEditCoinpayment] = useState(false)
  const [editVideoServer, setEditVideoServer] = useState(false)

  const [account, setAccount] = useState<{
    companyName?: string
    minimumWithdrawalAmount?: number
    email?: string
    countryCode?: string
    telephone?: string
    walletId?: string
  }>()

  const [socials, setSocials] = useState<{
    facebook?: string
    instagram?: string
    countryCode?: string
    whatsapp?: string
  }>()

  const [security, setSecurity] = useState<{
    oldPassword?: string
    newPassword?: string
    confirmNewPassword?: string
  }>()

  const [coinpayment, setCoinpayment] = useState<{
    ipnSecret?: string
    secretKey?: string
    privateKey?: string
    otp?: string
  }>()

  const [videoServer, setVideoServer] = useState<{
    privateKey?: string
    secretKey?: string
  }>()

  const handleWalletInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWalletValue(e.target.value)
    setAccount(prev => ({
      ...prev,
      walletId: e.target.value
    }))
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

  const handleAccountSave = async () => {
    try {
      setIsAccountLoading(true)
      // if (userAccount?._id) {
      await updateAccount(account!)
      // } else {
      //   await createAccount(account!)
      // }
    } catch (error) {
      console.error({ error }, 'creating account')
    } finally {
      setIsAccountLoading(false)
    }
  }
  const handleSocialsSave = async () => {
    try {
      setIsSocialsLoading(true)
      if (userSocials?._id) {
        await updateSocials(socials!)
      } else {
        await createSocials(socials!)
      }
    } catch (error) {
      console.error({ error }, 'creating socials')
    } finally {
      setIsSocialsLoading(false)
    }
  }
  const handleSecuritySave = async () => {
    try {
      setIsSecurityLoading(true)
      await updatePassword(security!)
    } catch (error) {
      console.error({ error }, 'updating password')
    } finally {
      setIsSecurityLoading(false)
    }
  }
  const handleCoinpaymentSave = async () => {
    try {
      // setIsCounPaymentLoding(true)
      // if (coinPaymentData?._id) {
      await updateCoinPayment(coinpayment!)
      // } else {
      //   await createCoinpayment(coinpayment!)
      // }
    } catch (error) {
      console.error({ error }, 'creating coinpayment')
    } finally {
      setIsCounPaymentLoding(false)
    }
  }
  const handleVideoServerSave = async () => {
    try {
      setIsVideoServerLoading(true)
      if (videoServerData?._id) {
        await updateVideoServer({
          ...videoServer!,
          privateKey: ''
        })
      } else {
        await createVideoServer({
          ...videoServer!,
          privateKey: ''
        })
      }
    } catch (error) {
      console.error({ error }, 'creating video server')
    } finally {
      setIsVideoServerLoading(false)
    }
  }

  const { isFetched: isGetUserAccountFetched, data: userAccount } =
    useGetUserAccount()

  // const { mutateAsync: createAccount } = useCreateAccount(() => {
  //   setEditAccount(false)
  // })
  const { mutateAsync: updateAccount } = useUpdateAccount(() => {
    setEditAccount(false)
    window.location.reload()
  })

  const { isFetched: isGetUserSocialsFetched, data: userSocials } =
    useGetUserSocials()

  const { mutateAsync: createSocials } = useCreateSocials(() => {
    setEditSocials(false)
    window.location.reload()
  })
  const { mutateAsync: updateSocials } = useUpdateSocials(() => {
    setEditSocials(false)
    window.location.reload()
  })
  const { mutateAsync: updatePassword } = useUpdatePassword(() => {
    setEditSecurity(false)
    setSecurity(undefined)
    window.location.reload()
  })

  const { isFetched: isGetVideoServerFetched, data: videoServerData } =
    useGetVideoServer()

  const { mutateAsync: createVideoServer } = useCreateVideoServer(() => {
    {
      setEditVideoServer(false)
      window.location.reload()
    }
  })
  const { mutateAsync: updateVideoServer } = useUpdateVideoServer(() => {
    setEditVideoServer(false)
    window.location.reload()
  })

  const { isFetched: isGetCoinpaymentFetched, data: coinPaymentData } =
    useGetCoinpayment()

  // const { mutateAsync: createCoinpayment } = useCreateCoinpayment(() => {
  //   setEditCoinpayment(false)
  // })
  const { mutateAsync: updateCoinPayment } = useUpdateCoinpayment(() => {
    setEditCoinpayment(false)
    window.location.reload()
  })

  const { mutateAsync: getAccountOTP } = useGetAccountOTP()

  const { mutateAsync: getUserOTP } = useGetUserOTP()

  const { mutateAsync: getCointPaymentOTP } = useGetCoinpaymentOTP()

  useEffect(() => {
    if ((userAccount?.walletId ?? '').length > 10) {
      const firstFive = (userAccount?.walletId ?? '').substring(0, 8)
      const lastFive = (userAccount?.walletId ?? '').substring(
        (userAccount?.walletId ?? '').length - 8
      )
      setWalletDisplayValue(`${firstFive}....${lastFive}`)
    } else {
      setWalletDisplayValue(userAccount?.walletId ?? '')
    }

    if (userAccount) {
      setAccount(userAccount)
    }
    if (userSocials) {
      setSocials(userSocials)
    }
    if (coinPaymentData) {
      setCoinpayment(coinPaymentData)
    }
    if (videoServerData) {
      setVideoServer(videoServerData)
    }
  }, [userAccount, userSocials, coinPaymentData, videoServerData])

  return (
    <Sidebar>
      <div className='ml-10 mr-28 overflow-x-hidden overflow-y-hidden relative'>
        {!(
          isGetUserAccountFetched &&
          isGetCoinpaymentFetched &&
          isGetUserSocialsFetched &&
          isGetVideoServerFetched
        ) && (
          <div className='absolute inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm z-[9999] flex items-start pt-[30vh] justify-center'>
            <FadeLoader />
          </div>
        )}
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
                  {!editAccount && (
                    <div
                      className='w-11 h-11 rounded-lg border bg-[#1D1B27] flex items-center justify-center cursor-pointer border-opacity-20 border-white'
                      onClick={() => setEditAccount(true)}
                    >
                      <Pencil />
                    </div>
                  )}
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
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => {
                          setAccount(prev => ({
                            ...prev,
                            companyName: e.target.value
                          }))
                        }}
                        disabled={!editAccount}
                        defaultValue={userAccount?.companyName}
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Addresse email
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        disabled={!editAccount}
                        onChange={e => {
                          setAccount(prev => ({
                            ...prev,
                            email: e.target.value
                          }))
                        }}
                        defaultValue={
                          userAccount?.email ?? session?.data?.user?.email ?? ''
                        }
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Wallet USDT
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => handleWalletInputChange(e)}
                        onBlur={handleWalletBlur}
                        onFocus={handleWalletFocus}
                        value={
                          isWalletFocused ? walletValue : walletDisplayValue
                        }
                        disabled={!editAccount}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col gap-3'>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm truncate`}
                      >
                        Minimum withdrawal amount (in USDT)
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        disabled={!editAccount}
                        onChange={e => {
                          setAccount(prev => ({
                            ...prev,
                            minimumWithdrawalAmount: +e.target.value
                          }))
                        }}
                        defaultValue={userAccount?.minimumWithdrawalAmount}
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
                            setCountry(event.target.value)
                            setAccount(prev => ({
                              ...prev,
                              countryCode: event.target.value
                            }))
                          }}
                          defaultValue={userAccount?.countryCode}
                          className={`w-16 h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                          disabled={!editAccount}
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
                          className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                          placeholder='54 100 0003'
                          disabled={!editAccount}
                          onChange={e => {
                            setAccount(prev => ({
                              ...prev,
                              telephone: e.target.value
                            }))
                          }}
                          defaultValue={userAccount?.telephone}
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
                          className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type='numeric'
                          placeholder='_ _ _ _ _ _'
                          maxLength={6}
                          disabled={!editAccount}
                          onChange={e => {
                            setAccount(prev => ({
                              ...prev,
                              otp: e.target.value
                            }))
                          }}
                        />
                      </div>
                      <div className='absolute right-1'>
                        <button
                          className={`w-[84px] h-7 gap-[10px] flex rounded-full items-center justify-center bg-primary-400 cursor-pointer ${
                            isAccountLoading && 'opacity-60'
                          }`}
                          disabled={isAccountLoading}
                          onClick={() => {
                            try {
                              setIsAccountLoading(true)
                              getAccountOTP()
                            } catch (error) {
                              console.error({ error })
                            } finally {
                              setIsAccountLoading(false)
                            }
                          }}
                        >
                          <p
                            className={`${gilroySemiBold.className} text-xs text-white`}
                          >
                            Get code
                          </p>
                          {isAccountLoading && (
                            <ClipLoader size={10} color='#fff' />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {editAccount && (
                <button
                  className={`${
                    isAccountLoading && 'opacity-60'
                  } bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer`}
                  onClick={handleAccountSave}
                  disabled={isAccountLoading}
                >
                  <p className={`${gilroyBold.className} text-lg`}>
                    Save settings
                  </p>
                  {isAccountLoading ? (
                    <ClipLoader size={20} color='#fff' />
                  ) : (
                    <Send size={20} primaryColor='#fff' />
                  )}
                </button>
              )}
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
                  {!editSocials && (
                    <div
                      className='w-11 h-11 rounded-lg border bg-[#1D1B27] flex items-center justify-center cursor-pointer border-opacity-20 border-white'
                      onClick={() => setEditSocials(true)}
                    >
                      <Pencil />
                    </div>
                  )}
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
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        disabled={!editSocials}
                        onChange={e => {
                          setSocials(prev => ({
                            ...prev,
                            facebook: e.target.value
                          }))
                        }}
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Instagram
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        disabled={!editSocials}
                        onChange={e => {
                          setSocials(prev => ({
                            ...prev,
                            instagram: e.target.value
                          }))
                        }}
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
                            setCountry(event.target.value)
                          }}
                          className={`w-fit h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                          disabled={!editSocials}
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
                          className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                          placeholder='54 100 0003'
                          disabled={!editSocials}
                          onChange={e => {
                            setSocials(prev => ({
                              ...prev,
                              whatsapp: e.target.value
                            }))
                          }}
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
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        disabled={!editSocials}
                        onChange={e => {
                          setSocials(prev => ({
                            ...prev,
                            tiktok: e.target.value
                          }))
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {editSocials && (
                <button
                  className={`${
                    isSocialsLoading && 'opacity-60'
                  } bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer`}
                  onClick={handleSocialsSave}
                  disabled={isSocialsLoading}
                >
                  <p className={`${gilroyBold.className} text-lg`}>
                    Save settings
                  </p>
                  {isSocialsLoading ? (
                    <ClipLoader size={20} color='#fff' />
                  ) : (
                    <Send size={20} primaryColor='#fff' />
                  )}
                </button>
              )}
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
                  {!editSecurity && (
                    <div
                      className='w-11 h-11 rounded-lg border bg-[#1D1B27] flex items-center justify-center cursor-pointer border-opacity-20 border-white'
                      onClick={() => setEditSecurity(true)}
                    >
                      <Pencil />
                    </div>
                  )}
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
                          className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type={showOldPassword ? 'text' : 'password'}
                          placeholder='********'
                          disabled={!editSecurity}
                          onChange={e => {
                            setSecurity(prev => ({
                              ...prev,
                              oldPassword: e.target.value
                            }))
                          }}
                        />
                      </div>
                      <div
                        className='absolute right-4 cursor-pointer'
                        onClick={() => setShowOldPassword(prev => !prev)}
                      >
                        {showOldPassword ? <Hide /> : <Show />}
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
                          className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder='********'
                          disabled={!editSecurity}
                          onChange={e => {
                            setSecurity(prev => ({
                              ...prev,
                              newPassword: e.target.value
                            }))
                          }}
                        />
                      </div>
                      <div
                        className='absolute right-4 cursor-pointer'
                        onClick={() => setShowNewPassword(prev => !prev)}
                      >
                        {showNewPassword ? <Hide /> : <Show />}
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
                          className={`w-full h-full bg-transparent  text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type={showConfirmNewPassword ? 'text' : 'password'}
                          placeholder='********'
                          disabled={!editSecurity}
                          onChange={e => {
                            setSecurity(prev => ({
                              ...prev,
                              confirmNewPassword: e.target.value
                            }))
                          }}
                        />
                      </div>
                      <div
                        className='absolute right-4 cursor-pointer'
                        onClick={() => setShowConfirmNewPassword(prev => !prev)}
                      >
                        {showConfirmNewPassword ? <Hide /> : <Show />}
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
                          className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type='numeric'
                          placeholder='_ _ _ _ _ _'
                          maxLength={6}
                          disabled={!editSecurity}
                          onChange={e => {
                            setSecurity(prev => ({
                              ...prev,
                              otp: e.target.value
                            }))
                          }}
                        />
                      </div>
                      <div className='absolute right-1'>
                        <button
                          className={`w-[84px] h-7 gap-[10px] flex rounded-full items-center justify-center bg-primary-400 cursor-pointer ${
                            isSecurityLoading && 'opacity-60'
                          }`}
                          disabled={isSecurityLoading}
                          onClick={() => {
                            try {
                              setIsSecurityLoading(true)
                              getUserOTP()
                            } catch (error) {
                              console.error({ error })
                            } finally {
                              setIsSecurityLoading(false)
                            }
                          }}
                        >
                          <p
                            className={`${gilroySemiBold.className} text-xs text-white`}
                          >
                            Get code
                          </p>
                          {isSecurityLoading && (
                            <ClipLoader size={10} color='#fff' />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {editSecurity && (
                <button
                  className={`${
                    isSecurityLoading && 'opacity-60'
                  } bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer`}
                  onClick={handleSecuritySave}
                  disabled={isSecurityLoading}
                >
                  <p className={`${gilroyBold.className} text-lg`}>
                    Save settings
                  </p>
                  {isSecurityLoading ? (
                    <ClipLoader size={20} color='#fff' />
                  ) : (
                    <Send size={20} primaryColor='#fff' />
                  )}
                </button>
              )}
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
                  {!editCoinpayment && (
                    <div
                      className='w-11 h-11 rounded-lg border bg-[#1D1B27] flex items-center justify-center cursor-pointer border-opacity-20 border-white'
                      onClick={() => setEditCoinpayment(true)}
                    >
                      <Pencil />
                    </div>
                  )}
                </div>
                <div className='grid grid-cols-2 gap-5'>
                  <div className='flex flex-col gap-3'>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        IPN secret
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => {
                          setCoinpayment(prev => ({
                            ...prev,
                            ipnSecret: e.target.value
                          }))
                        }}
                        disabled={!editCoinpayment}
                        defaultValue={coinPaymentData?.ipnSecret}
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Private Key
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => {
                          setCoinpayment(prev => ({
                            ...prev,
                            privateKey: e.target.value
                          }))
                        }}
                        disabled={!editCoinpayment}
                        defaultValue={coinPaymentData?.privateKey}
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
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => {
                          setCoinpayment(prev => ({
                            ...prev,
                            secretKey: e.target.value
                          }))
                        }}
                        disabled={!editCoinpayment}
                        defaultValue={coinPaymentData?.secretKey}
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
                          className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                          type='numeric'
                          placeholder='_ _ _ _ _ _'
                          maxLength={6}
                          disabled={!editCoinpayment}
                          onChange={e => {
                            setCoinpayment(prev => ({
                              ...prev,
                              otp: e.target.value
                            }))
                          }}
                        />
                      </div>
                      <div className='absolute right-1'>
                        <button
                          className={`w-[84px] h-7 gap-[10px] flex rounded-full items-center justify-center bg-primary-400 cursor-pointer ${
                            isCoinPaymentLoading && 'opacity-60'
                          }`}
                          disabled={isCoinPaymentLoading}
                          onClick={() => {
                            try {
                              setIsCounPaymentLoding(true)
                              getCointPaymentOTP()
                            } catch (error) {
                              console.error({ error })
                            } finally {
                              setIsCounPaymentLoding(false)
                            }
                          }}
                        >
                          <p
                            className={`${gilroySemiBold.className} text-xs text-white`}
                          >
                            Get code
                          </p>
                          {isCoinPaymentLoading && (
                            <ClipLoader size={10} color='#fff' />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {editCoinpayment && (
                <button
                  className={`${
                    isCoinPaymentLoading && 'opacity-60'
                  } bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer`}
                  onClick={handleCoinpaymentSave}
                  disabled={isCoinPaymentLoading}
                >
                  <p className={`${gilroyBold.className} text-lg`}>
                    Save settings
                  </p>
                  {isCoinPaymentLoading ? (
                    <ClipLoader size={20} color='#fff' />
                  ) : (
                    <Send size={20} primaryColor='#fff' />
                  )}
                </button>
              )}
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
                  {!editVideoServer && (
                    <div
                      className='w-11 h-11 rounded-lg border bg-[#1D1B27] flex items-center justify-center cursor-pointer border-opacity-20 border-white'
                      onClick={() => setEditVideoServer(true)}
                    >
                      <Pencil />
                    </div>
                  )}
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
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => {
                          setVideoServer(prev => ({
                            ...prev,
                            publicKey: e.target.value
                          }))
                        }}
                        disabled={!editVideoServer}
                        defaultValue={videoServerData?.publicKey}
                      />
                    </div>
                    <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Secret Key
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                        onChange={e => {
                          setVideoServer(prev => ({
                            ...prev,
                            secretKey: e.target.value
                          }))
                        }}
                        disabled={!editVideoServer}
                        defaultValue={videoServerData?.secretKey}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {editVideoServer && (
                <button
                  className={`${
                    isVideoServerLoading && 'opacity-60'
                  } bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer`}
                  onClick={handleVideoServerSave}
                  disabled={isVideoServerLoading}
                >
                  <p className={`${gilroyBold.className} text-lg`}>
                    Save settings
                  </p>
                  {isVideoServerLoading ? (
                    <ClipLoader size={20} color='#fff' />
                  ) : (
                    <Send size={20} primaryColor='#fff' />
                  )}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </Sidebar>
  )
}

export default Settings

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

  // Check if the user has the admin role
  if (session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/403',
        permanent: false
      }
    }
  }

  // If the user is an admin, proceed to render the page
  return {
    props: { session }
  }
}
