import React, { FC } from 'react'
import { gilroyBold, gilroyMedium } from '../pages'
import Facebook from '@/public/assets/icons/facebook.svg'
import Instagram from '@/public/assets/icons/instagram.svg'
import WhatsApp from '@/public/assets/icons/whatsapp.svg'
import { useGetPublicSocials } from '../hooks/socials'
import Link from 'next/link'

const Footer: FC = () => {
  const { data } = useGetPublicSocials()

  return (
    <div className='border-t border-t-white border-opacity-10 py-4 flex flex-col md:flex-row items-left justify-between px-6 lg:px-36 w-full gap-6'>
      <div
        className={`flex flex-col lg:flex-row gap-1 items-left lg:items-center lg:divide-y-0 lg:divide-x text-white ${gilroyMedium.className}`}
      >
        <p className={`px-2 ${gilroyBold.className}`}>Copyright 2024</p>
        <p className='px-2'>All Rights Reserved</p>
        <p className='px-2'>
          Made with love by{' '}
          <span className='text-primary-400'>Brulice services</span>
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <Link
          href={data?.facebook ?? '/'}
          className='h-10 w-10 rounded-full bg-grey-bg flex items-center justify-center'
          target='_blank'
        >
          <Facebook className='w-6 h-6' stroke='#ffffff' />
        </Link>
        <Link
          className='h-10 w-10 rounded-full bg-grey-bg flex items-center justify-center'
          href={
            data?.whatsapp
              ? `https://wa.me/${data?.countryCode?.slice(1) + data?.whatsapp}`
              : '/'
          }
          target='_blank'
        >
          <WhatsApp className='w-6 h-6' stroke='#ffffff' />
        </Link>
        <Link
          className='h-10 w-10 rounded-full bg-grey-bg flex items-center justify-center'
          href={data?.instagram ?? '/'}
          target='_blank'
        >
          <Instagram className='w-6 h-6' stroke='#ffffff' />
        </Link>
      </div>
    </div>
  )
}

export default Footer
