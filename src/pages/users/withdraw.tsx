import Sidebar from '@/src/components/Sidebar'
import { gilroyBold, gilroyRegular, gilroySemiBold } from '..'

import { Hide, Send, Show } from 'react-iconly'
import Crypto from '@/public/assets/icons/crypto.svg'

import { ChangeEvent, useEffect, useState } from 'react'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { useGetUser } from '@/src/hooks/user'
import { Modal } from '@/src/components'
import { ClipLoader } from 'react-spinners'
import { useGetUserOTP } from '@/src/hooks/auth'
import { useInitiateWithdrawal } from '@/src/hooks/payment'

function Withdraw () {
  const [walletValue, setWalletValue] = useState('')
  const [withdrawalAmount, setWithdaralAmount] = useState<number>()
  const [otp, setOtp] = useState<string>()
  const [pin, setPin] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [walletDisplayValue, setWalletDisplayValue] = useState('')
  const [isWalletFocused, setIsWalletFocused] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [showPassword, setshowPassword] = useState(false)
  const [serverError, setServerError] = useState<string>()
  const [error, setError] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)

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

  const { data: userData, isFetched } = useGetUser()

  const { mutateAsync: getUserOTP } = useGetUserOTP(
    () => {},
    error => {
      console.error({ error })
    }
  )

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setError(false)
    setTermsAccepted(checked)
  }

  const handleSendRequest = async () => {
    if (!termsAccepted) {
      return setError(true)
    }
    try {
      setIsRequesting(true)
      await initiateWithdrawal({
        walletId: walletValue,
        amount: withdrawalAmount ?? 0,
        pin: pin ?? '',
        password: password ?? '',
        otp: otp ?? ''
      })
    } catch (error) {
      console.error({ error })
    } finally {
      setIsRequesting(false)
    }
  }

  useEffect(() => {
    if (isFetched && userData && userData?.walletId) {
      const wallet = userData?.walletId
      if (wallet.length > 10) {
        const firstFive = wallet.substring(0, 8)
        const lastFive = wallet.substring(wallet.length - 8)
        setWalletDisplayValue(`${firstFive}....${lastFive}`)
      } else {
        setWalletDisplayValue(wallet)
      }
    }
  }, [userData, isFetched])

  const { mutateAsync: initiateWithdrawal } = useInitiateWithdrawal(
    () => {
      window.location.reload()
    },
    error => {
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

  return (
    <Sidebar>
      <div className='ml-4 md:ml-10 mr-6 md:mr-28 overflow-x-hidden overflow-y-hidden'>
        <main className='mt-8 ml-3 pb-20 flex gap-5'>
          <div className='p-7 flex flex-col border-grey-D933 bg-grey-920D rounded-2xl border-[1px] w-[545px] min-h-[521px] justify-between'>
            <div className='flex flex-col gap-4'>
              <div>
                <p className={`${gilroyBold.className} text-2xl text-white`}>
                  Withdraw
                </p>
                <p className={`${gilroyRegular.className} text-lg text-white`}>
                  Send a withdrawal request
                </p>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <div className='flex flex-col gap-3'>
                  <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1 relative items-start justify-center'>
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Your balance
                    </p>
                    <input
                      className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} pr-8`}
                      disabled
                      value={(userData?.walletBalance ?? 0) + ' USD'}
                    />
                    <div className='w-[22px] h-[22px] items-center justify-center top[50%] absolute right-5'>
                      <Crypto className='w-full h-full' />
                    </div>
                  </div>
                  <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1 relative items-start justify-center'>
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Enter your pin
                    </p>
                    <input
                      className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                      type={showPin ? 'numeric' : 'password'}
                      placeholder='********'
                      maxLength={6}
                      onChange={e => setPin(e.target.value)}
                    />
                    <div
                      className='absolute right-5 h-[22px] cursor-pointer'
                      onClick={() => setShowPin(prev => !prev)}
                    >
                      {showPin ? <Hide /> : <Show />}
                    </div>
                  </div>
                  <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Wallet USDT
                    </p>
                    <input
                      className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className}`}
                      onChange={e => handleWalletInputChange(e)}
                      onBlur={handleWalletBlur}
                      onFocus={handleWalletFocus}
                      value={isWalletFocused ? walletValue : walletDisplayValue}
                    />
                  </div>
                </div>
                <div className='flex flex-col gap-3'>
                  <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1'>
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Withdrawal amount
                    </p>
                    <input
                      className={`w-full h-full bg-transparent text-input outline-none focus:ring-0 ${gilroyBold.className}`}
                      value={withdrawalAmount}
                      inputMode='numeric'
                      onChange={e => setWithdaralAmount(+e.target.value)}
                    />
                  </div>
                  <div className='bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1 relative items-start justify-center'>
                    <p
                      className={`${gilroyRegular.className} text-neutral-50 text-sm`}
                    >
                      Enter your password
                    </p>
                    <input
                      className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                      type={showPassword ? 'text' : 'password'}
                      onChange={e => setPassword(e.target.value)}
                      placeholder='***********'
                    />
                    <div
                      className='absolute right-5 h-[22px] cursor-pointer'
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
                        className={`w-full h-full bg-transparent text-input text-neutral-10 outline-none focus:ring-0 ${gilroyBold.className} placeholder:${gilroyBold.className} placeholder:text-neutral-50`}
                        type='numeric'
                        placeholder='_ _ _ _ _ _'
                        maxLength={6}
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                      />
                    </div>
                    <div className='absolute right-6'>
                      <button
                        className={`w-[84px] h-7 gap-[10px] flex rounded-full items-center justify-center bg-primary-400 cursor-pointer ${
                          isRequesting && 'opacity-60'
                        }`}
                        disabled={isRequesting}
                        onClick={() => {
                          try {
                            setIsRequesting(true)
                            getUserOTP()
                          } catch (error) {
                            console.error({ error })
                          } finally {
                            setIsRequesting(false)
                          }
                        }}
                      >
                        <p
                          className={`${gilroySemiBold.className} text-xs text-white`}
                        >
                          Get code
                        </p>
                        {isRequesting && <ClipLoader size={10} color='#fff' />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-4 my-2'>
              <input
                type='checkbox'
                className='checkbox-custom cursor-pointer h-8 w-8'
                onChange={handleCheckboxChange}
              />
              <p
                className={`${gilroyRegular.className} text-sm md:text-base text-neutral-10`}
              >{`I accept the terms & conditions`}</p>
            </div>
            {error && (
              <p className='text-red-500 text-sm'>{`Please accept terms and conditions`}</p>
            )}
            <button
              className={`bg-gradient flex items-center gap-[10px] px-8 py-5 w-fit rounded-[10px] cursor-pointer ${
                isRequesting && 'opacity-60'
              }`}
              disabled={isRequesting}
              onClick={handleSendRequest}
            >
              <p className={`${gilroyBold.className} text-lg`}>Send request</p>
              {isRequesting ? (
                <ClipLoader size={20} color='#fff' />
              ) : (
                <Send size={20} primaryColor='#fff' />
              )}
            </button>
          </div>
        </main>
      </div>
      {!!serverError && (
        <Modal
          type='error'
          heading='Error initiating withdrawal'
          body={`<p>${serverError}</p><p>You will need to get another OTP code to try again.</p>`}
          onClose={() => setServerError(undefined)}
        />
      )}
    </Sidebar>
  )
}

export default Withdraw

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
