import React from 'react'

import Email from '@/public/assets/icons/email.svg'
import NotebookCheck from '@/public/assets/icons/notebook-check.svg'
import Bell from '@/public/assets/icons/bell.svg'
import { gilroyBold, gilroyRegular } from '../pages'

const AdminNav = () => {
  return (
    <div className=' lg:container lg:mx-auto fixed h-20 sm:h-[120px] pb-2 sm:pb-6 border-b-[1px] left-[72px] right-2 sm:left-[148px] sm:right-20 border-neutral-1A items-end flex z-50 bg-background'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex flex-col gap-1 sm:gap-2'>
          <p
            className={`${gilroyRegular.className} text-white text-sm sm:text-base`}
          >
            Welcome
          </p>
          <p
            className={`${gilroyBold.className} text-lg sm:text-2xl text-white`}
          >
            gatna.io
          </p>
        </div>
        <div className='flex w-fit items-center gap-2 sm:gap-[10px]'>
          <div className='relative w-10 h-10 sm:w-11 sm:h-11 rounded-full items-center justify-center flex bg-grey-bg'>
            <NotebookCheck className='w-4 sm:w-5' />
            <div className='absolute w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full flex items-center justify-center bg-primary-400 -top-[1px] -right-2'>
              <p
                className={`${gilroyBold.className} text-[7px] sm:text-[8px] text-white`}
              >
                12
              </p>
            </div>
          </div>
          <div className='relative w-10 h-10 sm:w-11 sm:h-11 rounded-full items-center justify-center flex bg-grey-bg'>
            <Email className='w-4 sm:w-5' />
            <div className='absolute w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full flex items-center justify-center bg-primary-400 -top-[1px] -right-2'>
              <p
                className={`${gilroyBold.className} text-[7px] sm:text-[8px] text-white`}
              >
                4
              </p>
            </div>
          </div>
          <div className='relative w-10 h-10 sm:w-11 sm:h-11 rounded-full items-center justify-center flex bg-grey-bg'>
            <Bell className='w-4 sm:w-5' />
            <div className='absolute w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full flex items-center justify-center bg-primary-400 -top-[1px] -right-2'>
              <p
                className={`${gilroyBold.className} text-[7px] sm:text-[8px] text-white`}
              >
                2
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminNav
