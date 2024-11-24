import React from 'react'
import Image from 'next/image'

import profile1 from '@/public/assets/images/profile1.png'
import CheckMark from '@/public/assets/icons/checkmark.svg'
import Gift from '@/public/assets/icons/gift.svg'
import Crypto from '@/public/assets/icons/crypto.svg'

import { gilroyBold, gilroyMedium, gilroySemiBold } from '@/src/pages/index'
import { Calendar } from 'react-iconly'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useGetUserPackage } from '../hooks/package'

const MainNav = () => {
  const router = useRouter()
  const session = useSession()

  const { data } = useGetUserPackage()

  return (
    <div className='lg:container lg:mx-auto fixed h-20 sm:h-[120px] pb-2 sm:pb-6 border-b-[1px] left-0 pl-20 md:pl-0 right-2 md:left-[120px] md:right-20 border-neutral-1A items-end flex z-10 bg-background'>
      <div className='flex items-center gap-1 sm:gap-4'>
        <div className='w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full bg-grey-9333 items-center justify-center flex'>
          <Image
            src={profile1}
            className='w-10 h-10 sm:w-12 sm:h-12 rounded-full'
            alt='profile'
          />
        </div>
        <div className='flex flex-col gap-1 sm:gap-2'>
          <div className='flex items-center gap-1 sm:gap-2'>
            <p
              className={`${gilroyBold.className} text-lg sm:text-2xl text-white`}
            >
              {session.data?.user.name ?? 'gatna.io'}
            </p>
            <div className='flex items-center justify-center w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full bg-whatsapp'>
              <CheckMark className='w-3 h-3' />
            </div>
          </div>
          <div className='flex items-center justify-center gap-2 sm:gap-3'>
            <div className='flex items-center gap-1 px-2 py-1 sm:px-[10px] sm:py-[9px] rounded-full bg-primary-400'>
              <Gift className='w-3 h-3 sm:w-[14px] sm:h-[14px]' />
              <p
                className={`${gilroySemiBold.className} text-[8px] mt-[2px] sm:text-xs truncate`}
              >
                {data?.package?.name ?? ''}
              </p>
            </div>
            <div className='flex gap-1 items-center px-2 sm:px-[10px] py-1 rounded-full bg-grey-bg'>
              <Calendar
                style={{
                  height: 12,
                  width: 12,
                  marginBottom: 1
                }}
              />
              <div className='h-6 items-center justify-center flex'>
                <p
                  className={`${gilroyMedium.className} text-[8px] mt-[2px] sm:text-xs truncate leading-normal`}
                >
                  {moment(data?.expiration).format('DD-MM-YYYY')}
                </p>
              </div>
            </div>
            <div
              className='flex gap-1 items-center px-2 sm:px-[10px] py-[5px] sm:py-[6px] rounded-full bg-dark-14 border border-green cursor-pointer'
              onClick={() => router.push('/users/withdraw')}
            >
              <Crypto className='w-3 h-3 sm:w-[14px] sm:h-[14px]' />
              <p
                className={`${gilroyBold.className} mt-1 text-[8px] sm:text-xs truncate text-green`}
              >
                ${data?.user?.walletBalance ?? 0} USDT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainNav
