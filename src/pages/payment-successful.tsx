import React from 'react'
import { gilroyBold, gilroyRegular } from '.'
import { Modal, Navbar } from '../components'
import { useRouter } from 'next/router'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input'

function SignUp () {
  const router = useRouter()
  const countries = getCountries()

  return (
    <div className='grid'>
      <Navbar />
      <div className='w-screen min-h-screen my-32 px-4 sm:mt-[32px] sm:mb-0 flex items-center justify-center'>
        <div className='max-w-[484px]  p-6 sm:p-9 flex flex-col bg-dark-33 rounded-[40px] gap-16'>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <p className='font-readex font-bold text-3xl sm:text-4xl text-neutral-10'>
                Create account
              </p>
              <p
                className={`${gilroyRegular.className} text-base sm:text-lg text-neutral-B2`}
              >
                Fill the form below
              </p>
            </div>
            <form className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3'>
              <div className='flex flex-col gap-3'>
                <input
                  type='text'
                  placeholder='First name'
                  className='h-[60px] w-full text-input focus:outline-none bg-neutral-1A rounded-xl px-4 bg-opacity-40 placeholder:text-base text-neutral-10 placeholder:text-neutral-B2'
                />
                <input
                  type='email'
                  placeholder='Email address'
                  className='h-[60px] w-full text-input focus:outline-none bg-neutral-1A rounded-xl px-4 bg-opacity-40 placeholder:text-base text-neutral-10 placeholder:text-neutral-B2'
                />
              </div>
              <div className='flex flex-col gap-3'>
                <input
                  type='text'
                  placeholder='Last name'
                  className='h-[60px] w-full focus:outline-none text-input bg-neutral-1A rounded-xl px-4 bg-opacity-40 placeholder:text-base text-neutral-10 placeholder:text-neutral-B2'
                />
                <div className='flex items-center gap-2 h-[60px] w-full text-input bg-neutral-1A rounded-xl px-4 bg-opacity-40 placeholder:text-base text-neutral-10 placeholder:text-neutral-B2'>
                  <select
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
                    className={` w-full focus:outline-none text-input bg-transparent placeholder:text-base text-neutral-10 placeholder:text-neutral-B2`}
                    placeholder='Phone'
                  />
                </div>
              </div>
            </form>
            <div className='flex items-center gap-4'>
              <input
                type='checkbox'
                className='checkbox-custom cursor-pointer h-8 w-8'
              />
              <p className={`${gilroyRegular.className} text-neutral-B2`}>
                Accept terms & Conditions
              </p>
            </div>
          </div>
          <div className='bg-gradient px-8 py-5 w-fit rounded-[10px] cursor-pointer flex gap-[10px] items-center'>
            <p className={`${gilroyBold.className} text-lg`}>Create account</p>
          </div>
        </div>
      </div>
      <Modal
        type='info'
        heading='Payment Successful'
        body={`<p>Your payment has been received succesfully. <br /> A password and a login link will be sent to your email.<p>`}
        onConfirm={() => {
          router.replace('/')
        }}
      />
    </div>
  )
}

export default SignUp
