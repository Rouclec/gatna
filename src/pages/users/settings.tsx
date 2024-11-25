import Sidebar from '@/src/components/Sidebar'
import { gilroyBold, gilroyRegular, gilroySemiBold } from '..'

import { Hide, Send, Show } from 'react-iconly'

import {
  getCountries,
  getCountryCallingCode
} from 'react-phone-number-input/input'
import en from 'react-phone-number-input/locale/en.json'

import { ChangeEvent, useEffect, useState } from 'react'
import ImageUploadButton from '@/src/components/ImageUploadButton'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '@/src/util/firebase'
import { useGetUser, useUpdateMe } from '@/src/hooks/user'
import { ClipLoader } from 'react-spinners'
import {
  useGetUserOTP,
  useUpdatePassword,
  useUpdateWithdrawalPin
} from '@/src/hooks/auth'
import { Modal } from '@/src/components'

function Settings () {
  const countries = getCountries()
  const [country, setCountry] = useState<string>('Cameroon')

  const [walletValue, setWalletValue] = useState('')
  const [walletDisplayValue, setWalletDisplayValue] = useState('')
  const [isWalletFocused, setIsWalletFocused] = useState(false)
  const [firstName, setFirstName] = useState<string>()
  const [lastName, setLastName] = useState<string>()
  const [countryCode, setCountryCode] = useState('+237')
  const [phoneNumber, setPhoneNumber] = useState<string>()
  const [profilePicImage, setProfilePicImage] = useState<File>()
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  const [showPin, setShowPin] = useState(false)
  const [showRepeatPin, setShowRepeatPin] = useState(false)
  const [isPinUpdating, setIsPinUpdating] = useState(false)
  const [pinCode, setPinCode] = useState<string>()
  const [repeatPinCode, setRepeatPinCode] = useState<string>()
  const [pinOtp, setPinOtp] = useState<string>()

  const [showPassword, setshowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [oldPassword, setOldPassword] = useState<string>()
  const [newPassword, setNewPassword] = useState<string>()
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>()
  const [passwordOtp, setPasswordOtp] = useState<string>()
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false)

  const [serverError, setServerError] = useState<string>()
  const [errorHeading, setErrorHeading] = useState<string>()

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

  const handleUpload = async (): Promise<string | null> => {
    if (!profilePicImage) return null

    try {
      // Create a storage reference
      const storageRef = ref(storage, `uploads/${profilePicImage.name}`)

      // Start the file upload
      const uploadTask = uploadBytesResumable(storageRef, profilePicImage)

      // Wait for the upload to complete
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log(`Upload is ${progress}% done`)
          },
          error => reject(error),
          () => resolve()
        )
      })

      // Get the download URL
      const url = await getDownloadURL(uploadTask.snapshot.ref)
      return url
    } catch (error) {
      console.error('Upload failed:', error)
      return null
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true)
      const profileUrl = await handleUpload()
      console.log({ profileUrl })
      await updateProfile({
        phoneNumber: phoneNumber ?? userProfile?.phoneNumber ?? '',
        countryCode: countryCode ?? userProfile?.countryCode ?? '',
        firstName: firstName ?? userProfile?.firstName ?? '',
        lastName: lastName ?? userProfile?.lastName ?? '',
        walletId: walletValue ?? userProfile?.walletId ?? '',
        profilePic: profileUrl ?? userProfile?.profilePic ?? ''
      })
    } catch (error) {
      console.error(`Error updating profile: ${error}`)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const { data: userProfile, isFetched } = useGetUser()
  const { mutateAsync: updateProfile } = useUpdateMe(
    () => {
      window.location.reload()
    },
    error => {
      setErrorHeading('Error updating profile')
      if (!!error?.response?.data?.message) {
        if (typeof error?.response?.data.message === 'string') {
          setServerError(error?.response?.data.message)
        } else {
          setServerError('An unknown server error occured')
        }
      } else {
        setServerError('An unknown server error occured')
      }
    }
  )

  const handleUpdatePin = async () => {
    try {
      setIsPinUpdating(true)
      await updatePin({
        pinCode,
        repeatPinCode,
        otp: pinOtp
      })
    } catch (error) {
      console.error(`Error updating pin ${error}`)
    } finally {
      setIsPinUpdating(false)
    }
  }

  const handleUpdatePassword = async () => {
    try {
      setIsPasswordUpdating(true)
      await updatePassword({
        oldPassword,
        newPassword,
        confirmNewPassword,
        otp: passwordOtp
      })
    } catch (error) {
      console.error(`Error updating password ${error}`)
    } finally {
      setIsPasswordUpdating(false)
    }
  }

  const { mutateAsync: getUserOTP } = useGetUserOTP()

  const { mutateAsync: updatePin } = useUpdateWithdrawalPin(
    () => {
      window.location.reload()
    },
    error => {
      setErrorHeading('Error updating pin')
      if (!!error?.response?.data?.message) {
        if (typeof error?.response?.data.message === 'string') {
          setServerError(error?.response?.data.message)
        } else {
          setServerError('An unknown server error occured')
        }
      } else {
        setServerError('An unknown server error occured')
      }
    }
  )
  const { mutateAsync: updatePassword } = useUpdatePassword(
    () => {
      window.location.reload()
    },
    error => {
      setErrorHeading('Error updating password')
      if (!!error?.response?.data?.message) {
        if (typeof error?.response?.data.message === 'string') {
          setServerError(error?.response?.data.message)
        } else {
          setServerError('An unknown server error occured')
        }
      } else {
        setServerError('An unknown server error occured')
      }
    }
  )

  useEffect(() => {
    if (isFetched) {
      setWalletValue(userProfile?.walletId ?? '')

      if ((userProfile?.walletId ?? '').length > 10) {
        const firstFive = userProfile?.walletId?.substring(0, 8)
        const lastFive = userProfile?.walletId?.substring(
          userProfile?.walletId?.length - 8
        )
        setWalletDisplayValue(`${firstFive}....${lastFive}`)
      }
    }
  }, [userProfile, isFetched])

  return (
    <Sidebar>
      <div className='mr-6 ml-4 md:ml-10 md:mr-28 overflow-x-hidden overflow-y-hidden'>
        <main className='mt-8 ml-3 pb-20 gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
          <div className='p-7 flex flex-col col-span-1 md:col-span-2 border-grey-D933 bg-grey-920D rounded-2xl border-[1px] h-fit md:h-[598px] gap-12 justify-between'>
            <div className='flex flex-col gap-4'>
              <div>
                <p className={`${gilroyBold.className} text-2xl text-white`}>
                  Parametres
                </p>
                <p className={`${gilroyRegular.className} text-lg text-white`}>
                  Modifez vos donnees
                </p>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <div className='flex flex-col gap-3 order-2 sm:order-1'>
                  <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Nom
                    </p>
                    <input
                      className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                      onChange={e => setFirstName(e.target.value)}
                      value={firstName}
                      defaultValue={userProfile?.firstName}
                    />
                  </div>
                  {/* <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Addresse email
                    </p>
                    <input
                      className={`w-full h-full text-input bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                    />
                  </div> */}
                  <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Wallet USDT
                    </p>
                    <input
                      className={`w-full h-full bg-transparent text-input text-neutral-10  outline-none focus:ring-0 ${gilroyBold.className}`}
                      onChange={e => handleWalletInputChange(e)}
                      onBlur={handleWalletBlur}
                      onFocus={handleWalletFocus}
                      value={isWalletFocused ? walletValue : walletDisplayValue}
                    />
                  </div>
                  <ImageUploadButton
                    title='Profile image'
                    placeholder='Upload profile pic'
                    setSelectedImage={setProfilePicImage}
                  />
                </div>
                <div className='flex flex-col gap-3 order-1 sm:order-2'>
                  <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Prenoms
                    </p>
                    <input
                      className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                      onChange={e => setLastName(e.target.value)}
                      value={lastName}
                      defaultValue={userProfile?.lastName}
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
                          // console.log(event.target.value)
                          setCountry(event.target.value)
                          setCountryCode(event.target.value)
                        }}
                        className={`w-16 h-full bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                      >
                        <option value=''>+{getCountryCallingCode('CM')}</option>
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
                        onChange={e => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                        defaultValue={userProfile?.phoneNumber}
                      />
                    </div>
                  </div>
                  <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Country
                    </p>
                    <select
                      value={country}
                      onChange={event => {
                        console.log(event.target.value)
                        setCountry(event.target.value)
                      }}
                      className={`w-full h-full p-0 bg-transparent outline-none focus:ring-0 ${gilroyBold.className}`}
                    >
                      <option value=''>{en['CM']}</option>
                      {countries.map(countryCode => (
                        <option
                          key={countryCode}
                          value={`+${getCountryCallingCode(countryCode)}`}
                        >
                          {en[countryCode]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <button
              className={`bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer ${
                isUpdatingProfile && 'opacity-60'
              }`}
              disabled={isUpdatingProfile}
              onClick={handleUpdateProfile}
            >
              <p className={`${gilroyBold.className} text-lg`}>Save settings</p>
              {isUpdatingProfile ? (
                <ClipLoader size={20} color='#fff' />
              ) : (
                <Send size={20} primaryColor='#fff' />
              )}
            </button>
          </div>
          <div className='p-7 flex flex-col col-span-1 border-grey-D933 bg-grey-920D rounded-2xl border-[1px] h-fit md:h-[598px] gap-12 justify-between'>
            <div className='flex flex-col gap-4'>
              <div>
                <p className={`${gilroyBold.className} text-2xl text-white`}>
                  Create PIN
                </p>
                <p className={`${gilroyRegular.className} text-lg text-white`}>
                  Create a withdrawal pin
                </p>
              </div>
              <div className='grid grid-cols-1 gap-5'>
                <div className='flex flex-col gap-3'>
                  <div className='flex gap-1 items-center justify-between relative'>
                    <div className='bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Pin code
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type={showPin ? 'numeric' : 'password'}
                        inputMode='numeric'
                        placeholder='********'
                        value={pinCode}
                        maxLength={6}
                        onChange={e => setPinCode(e.target.value)}
                      />
                    </div>
                    <div
                      className='absolute right-4 cursor-pointer'
                      onClick={() => setShowPin(prev => !prev)}
                    >
                      {showPin ? <Hide /> : <Show />}
                    </div>
                  </div>
                  <div className='flex gap-1 items-center justify-between relative'>
                    <div className='bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Repeat pin
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type={showRepeatPin ? 'numeric' : 'password'}
                        placeholder='********'
                        inputMode='numeric'
                        value={repeatPinCode}
                        maxLength={6}
                        onChange={e => setRepeatPinCode(e.target.value)}
                      />
                    </div>
                    <div
                      className='absolute right-4 cursor-pointer'
                      onClick={() => setShowRepeatPin(prev => !prev)}
                    >
                      {showRepeatPin ? <Hide /> : <Show />}
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
                        className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type='numeric'
                        placeholder='_ _ _ _ _ _'
                        maxLength={6}
                        value={pinOtp}
                        onChange={e => setPinOtp(e.target.value)}
                      />
                    </div>
                    <div className='absolute right-2'>
                      <button
                        className={`w-[84px] h-7 gap-[10px] flex rounded-full items-center justify-center bg-primary-400 cursor-pointer ${
                          isPinUpdating && 'opacity-60'
                        }`}
                        disabled={isPinUpdating}
                        onClick={async () => {
                          try {
                            setIsPinUpdating(true)
                            await getUserOTP()
                          } catch (error) {
                            console.error({ error })
                          } finally {
                            setIsPinUpdating(false)
                          }
                        }}
                      >
                        <p
                          className={`${gilroySemiBold.className} text-xs text-white`}
                        >
                          Get code
                        </p>
                        {isPinUpdating && <ClipLoader size={10} color='#fff' />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className={`bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer ${
                isPinUpdating && 'opacity-60'
              }`}
              disabled={isPinUpdating}
              onClick={handleUpdatePin}
            >
              <p className={`${gilroyBold.className} text-lg`}>Save settings</p>
              {isPinUpdating ? (
                <ClipLoader size={20} color='#fff' />
              ) : (
                <Send size={20} primaryColor='#fff' />
              )}
            </button>
          </div>
          <div className='p-7 flex flex-col col-span-1 border-grey-D933 bg-grey-920D rounded-2xl border-[1px] h-fit md:h-[598px] gap-12 justify-between'>
            <div className='flex flex-col gap-4'>
              <div>
                <p className={`${gilroyBold.className} text-2xl text-white`}>
                  Change password
                </p>
                <p className={`${gilroyRegular.className} text-lg text-white`}>
                  Modify your password
                </p>
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
                        className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='********'
                        onChange={e => setOldPassword(e.target.value)}
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
                        className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder='********'
                        onChange={e => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div
                      className='absolute right-4 cursor-pointer'
                      onClick={() => setShowNewPassword(prev => !prev)}
                    >
                      {showNewPassword ? <Hide /> : <Show />}
                    </div>
                  </div>
                  <div className='flex gap-1 items-center justify-between relative'>
                    <div className='bg-grey-bg w-full rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                      <p
                        className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                      >
                        Confirm new password
                      </p>
                      <input
                        className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        placeholder='********'
                        onChange={e => setConfirmNewPassword(e.target.value)}
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
                        className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type='numeric'
                        placeholder='_ _ _ _ _ _'
                        maxLength={6}
                        value={passwordOtp}
                        onChange={e => setPasswordOtp(e.target.value)}
                      />
                    </div>
                    <div className='absolute right-2'>
                      <button
                        className={`w-[84px] h-7 gap-[10px] flex rounded-full items-center justify-center bg-primary-400 cursor-pointer ${
                          isPasswordUpdating && 'opacity-60'
                        }`}
                        disabled={isPasswordUpdating}
                        onClick={async () => {
                          try {
                            setIsPasswordUpdating(true)
                            await getUserOTP()
                          } catch (error) {
                            console.error({ error })
                          } finally {
                            setIsPasswordUpdating(false)
                          }
                        }}
                      >
                        <p
                          className={`${gilroySemiBold.className} text-xs text-white`}
                        >
                          Get code
                        </p>
                        {isPasswordUpdating && (
                          <ClipLoader size={10} color='#fff' />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className={`bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer ${
                isPasswordUpdating && 'opacity-20'
              }`}
              disabled={isPasswordUpdating}
              onClick={handleUpdatePassword}
            >
              <p className={`${gilroyBold.className} text-lg`}>Save settings</p>
              {isPasswordUpdating ? (
                <ClipLoader size={20} color='#fff' />
              ) : (
                <Send size={20} primaryColor='#fff' />
              )}
            </button>
          </div>
        </main>
      </div>
      {!!serverError && !!errorHeading && (
        <Modal
          type='error'
          heading={errorHeading}
          body={serverError}
          onClose={() => {
            setServerError(undefined)
            setErrorHeading(undefined)
          }}
        />
      )}
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

  // If there is a user
  return {
    props: { session }
  }
}
