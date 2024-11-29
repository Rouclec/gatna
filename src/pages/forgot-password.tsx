import React, { FormEvent, useState } from 'react'
import { gilroyBold, gilroyRegular, gilroySemiBold } from '.'
import { Modal, Navbar } from '../components'
import { Login, Message } from 'react-iconly'
import { ClipLoader } from 'react-spinners'
import { useForgotPassword, useGetForgotPasswordOTP } from '../hooks/auth'
import { useRouter } from 'next/router'

function Signin () {
  const [email, setEmail] = useState<string>()
  const [message, setMessage] = useState<string>()
  const [errorHeading, setErrorHeading] = useState<string>('Error sending OTP')
  const [error, setError] = useState<string>()
  const [pinOtp, setPinOtp] = useState<string>()
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)

      await resetPassword({
        email: email as string,
        otp: pinOtp as string
      })

      setLoading(false)
    } catch (error) {
      console.error({ error })
    } finally {
      setLoading(false)
    }
  }

  const { mutateAsync: getUserOTP } = useGetForgotPasswordOTP()

  const { mutateAsync: resetPassword } = useForgotPassword(
    () => {
      setMessage(`A new password has been sent to your email`)
    },
    error => {
      if (!!error?.response?.data?.message) {
        setErrorHeading('Error reseting password')
        if (typeof error?.response?.data.message === 'string') {
          setError(error?.response?.data.message)
        } else {
          setError('An unknown server error occured')
        }
      } else {
        setError('An unknown server error occured')
      }
    }
  )

  return (
    <div className='grid'>
      <Navbar />
      <div className='w-screen h-screen mt-[32px] flex items-center justify-center px-4'>
        <div className='w-[430px] p-9 flex flex-col bg-dark-33 rounded-[40px] gap-10'>
          <form onSubmit={handleResetPassword}>
            <div className='flex flex-col gap-6 mb-4'>
              <div className='grid gap-2'>
                <p className='font-readex font-bold text-3xl sm:text-4xl text-neutral-10'>
                  Forgot password
                </p>
                <p
                  className={`${gilroyRegular.className} text-lg text-neutral-B2`}
                >
                  Reset your password
                </p>
              </div>
              <div className='grid grid-cols-1 gap-4 mt-3'>
                <div className='flex flex-col gap-3'>
                  <div className='relative flex items-center'>
                    <input
                      type='email'
                      placeholder='Email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={`h-[60px] w-full text-input bg-neutral-1A bg-opacity-40 text-neutral-10 rounded-xl px-4 pl-20 placeholder:${gilroyRegular.className} placeholder:text-base placeholder:text-neutral-B2`}
                      required
                    />
                    <div className='flex items-center gap-2 absolute left-6 self-center'>
                      <Message primaryColor='#FFFFFF33' />
                      <div className='w-[6px] h-[6px] rounded-full bg-grey-60 opacity-10' />
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
                        required
                      />
                    </div>
                    <div className='absolute right-2'>
                      <button
                        className={`w-[84px] h-7 gap-[10px] flex rounded-full items-center justify-center bg-primary-400 cursor-pointer ${
                          loading && 'opacity-60'
                        }`}
                        disabled={loading}
                        onClick={async () => {
                          try {
                            setLoading(true)
                            if (!email) {
                              setError('Please enter your email')
                            } else {
                              await getUserOTP(email as string)
                            }
                          } catch (error) {
                            console.error({ error })
                            setError('An unknown error occured')
                          } finally {
                            setLoading(false)
                          }
                        }}
                      >
                        <p
                          className={`${gilroySemiBold.className} text-xs text-white`}
                        >
                          Get code
                        </p>
                        {loading && <ClipLoader size={10} color='#fff' />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              type='submit'
              className={`bg-gradient px-8 py-5 w-fit rounded-[10px] cursor-pointer flex gap-[10px] items-center ${
                loading && 'opacity-60'
              }`}
              disabled={loading}
            >
              <p className={`${gilroyBold.className} text-lg`}>
                Reset password
              </p>
              {loading ? (
                <ClipLoader size={20} color='#fff' />
              ) : (
                <Login primaryColor='#FFFFFF66' />
              )}
            </button>
          </form>
        </div>
      </div>
      {!!message && (
        <Modal
          type='info'
          heading='Password reset'
          body={message}
          onClose={() => {
            setMessage(undefined)
            // window.location.reload()
            router.push('/')
          }}
        />
      )}
      {!!error && (
        <Modal
          type='error'
          heading={errorHeading}
          body={error}
          onClose={() => {
            setError(undefined)
          }}
        />
      )}
    </div>
  )
}

export default Signin
