import React, { useEffect, useState } from 'react'
import { gilroyBold, gilroyRegular } from '.'
import { Modal, Navbar } from '../components'
import { useRouter } from 'next/router'
import { PaymentResponse, useInitiatePayment } from '../hooks/payment'
import { ClipLoader } from 'react-spinners'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input'

function SignUp () {
  const router = useRouter()
  const countries = getCountries()
  const [country, setCountry] = useState<string>('Cameroon')

  const [countryCode, setCountryCode] = useState<string>('+237')

  const [isLoading, setIsLoading] = useState(false)
  const [packageId, setPackageId] = useState<string>()
  const [serverError, setServerError] = useState<string>()

  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse>()
  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    country_code: '+237',
    password: '',
    confirm_password: '',
    termsAccepted: false
  })

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirm_password: '',
    general: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setFormData(prev => ({
      ...prev,
      termsAccepted: checked
    }))
  }

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      confirm_password: '',
      general: ''
    }
    let isValid = true

    // Validate email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.'
      isValid = false
    }

    // Validate password
    if (formData.password.length > 0 && formData.password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters long.'
      isValid = false
    }

    // Validate confirm password
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match.'
      isValid = false
    }

    // Check if terms and conditions are accepted
    if (!formData.termsAccepted) {
      newErrors.general = 'You must accept the terms and conditions.'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)
      const bodyData = {
        ...formData,
        countryCode
      }

      console.log({ bodyData })
      // Call your API route that handles signup with NextAuth
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      })

      if (response.ok) {
        const data = await response.json()

        console.log({ data })
        console.log({ packageId })

        if (!!packageId) {
          await mutateAsync({
            userId: data.data._id,
            packageId
          })
        } else {
          router.replace('/signin')
        }
      } else {
        const data = await response.json()
        setErrors(prev => ({
          ...prev,
          general: data?.message || 'There was an error creating the account.'
        }))
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: 'An unexpected error occurred. Please try again later.'
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const { mutateAsync } = useInitiatePayment(
    data => {
      setShowModal(true)
      setPaymentResponse(data)
      // window.location.reload()
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const packageIdString = localStorage.getItem('@buying-course')
      if (packageIdString) {
        setPackageId(JSON.parse(packageIdString))
      }
    }
  }, [])

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
            <form
              onSubmit={handleSubmit}
              className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3'
            >
              <div className='flex flex-col gap-3'>
                <input
                  type='text'
                  name='first_name'
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder='First name'
                  className='h-[60px] w-full text-input focus:outline-none bg-neutral-1A rounded-xl px-4 bg-opacity-40 placeholder:text-base text-neutral-10 placeholder:text-neutral-B2'
                />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email address'
                  className='h-[60px] w-full text-input focus:outline-none bg-neutral-1A rounded-xl px-4 bg-opacity-40 placeholder:text-base text-neutral-10 placeholder:text-neutral-B2'
                />
                {errors.email && (
                  <p className='text-red-500 text-sm'>{errors.email}</p>
                )}
                {/* {!packageId && (
                  <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Password'
                    className='h-[60px] w-full text-input bg-neutral-1A rounded-xl px-4 bg-opacity-40 placeholder:text-base text-neutral-10 placeholder:text-neutral-B2'
                  />
                )} */}
                {/* {errors.password && (
                  <p className='text-red-500 text-sm'>{errors.password}</p>
                )} */}
              </div>
              <div className='flex flex-col gap-3'>
                <input
                  type='text'
                  name='last_name'
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder='Last name'
                  className='h-[60px] w-full focus:outline-none text-input bg-neutral-1A rounded-xl px-4 bg-opacity-40 placeholder:text-base text-neutral-10 placeholder:text-neutral-B2'
                />
                {/* <input
                  type='text'
                  name='phone_number'
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder='Phone number'
                  className='h-[60px] w-full text-input bg-neutral-1A rounded-xl px-4 bg-opacity-40 placeholder:text-base text-neutral-10 placeholder:text-neutral-B2'
                /> */}
                <div className='flex items-center gap-2 h-[60px] w-full text-input bg-neutral-1A rounded-xl px-4 bg-opacity-40 placeholder:text-base text-neutral-10 placeholder:text-neutral-B2'>
                  <select
                    value={country}
                    onChange={event => {
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
                    className={` w-full focus:outline-none text-input bg-transparent placeholder:text-base text-neutral-10 placeholder:text-neutral-B2`}
                    placeholder='Phone'
                    name='phone_number'
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                </div>
                {/* {!packageId && (
                  <input
                    type='password'
                    name='confirm_password'
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder='Confirm password'
                    className='h-[60px] w-full text-input bg-neutral-1A rounded-xl px-4 bg-opacity-40 placeholder:text-base text-neutral-10 placeholder:text-neutral-B2'
                  />
                )} */}
                {/* {errors.confirm_password && (
                  <p className='text-red-500 text-sm'>
                    {errors.confirm_password}
                  </p>
                )} */}
              </div>
            </form>
            <div className='flex items-center gap-4'>
              <input
                type='checkbox'
                checked={formData.termsAccepted}
                onChange={handleCheckboxChange}
                className='checkbox-custom cursor-pointer h-8 w-8'
              />
              <p className={`${gilroyRegular.className} text-neutral-B2`}>
                Accept terms & Conditions
              </p>
            </div>
            {errors.general && (
              <p className='text-red-500 text-sm'>{errors.general}</p>
            )}
          </div>
          <div
            onClick={handleSubmit}
            className='bg-gradient px-8 py-5 w-fit rounded-[10px] cursor-pointer flex gap-[10px] items-center'
          >
            <p className={`${gilroyBold.className} text-lg`}>Create account</p>
            {isLoading && <ClipLoader size={20} color='#fff' />}
          </div>
        </div>
      </div>
      {!!errors?.general && (
        <Modal
          type='error'
          heading='Signup error'
          body={errors?.general}
          onClose={() =>
            setErrors(prev => ({
              ...prev,
              general: ''
            }))
          }
        />
      )}
      {!!serverError && (
        <Modal
          type='error'
          heading='Error initiating payment'
          body={serverError}
          onClose={() => setServerError(undefined)}
        />
      )}
      {showModal && (
        <Modal
          type='info'
          heading='Complete payment'
          body='You will be redirected to another page to complete your payment'
          onConfirm={() => {
            window.open(paymentResponse?.checkout_url, '_blank')
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}

export default SignUp
