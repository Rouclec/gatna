import Image from 'next/image'
import React, { FC, useEffect, useRef, useState } from 'react'
// import { Filter, Home } from "react-iconly";
import Home from '@/public/assets/icons/home.svg'
import Profile from '@/public/assets/icons/profile.svg'
import BoardMenu2 from '@/public/assets/icons/board-menu-2.svg'

import logo from '@/public/assets/images/logo.png'
import { gilroyBold, gilroyMedium } from '../pages'
import { useRouter } from 'next/router'
import { CloseSquare } from 'react-iconly'
import Link from 'next/link'

// interface Props {}

const Navbar: FC = () => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className='lg:container mx-auto fixed left-0 right-0 h-[104px] flex items-center justify-between lg:justify-normal md:gap-64 px-6 lg:px-36 border-b-[0.5px] border-grey-bg bg-primary-500 z-40'>
      <Image
        src={logo}
        alt='logo'
        className='w-[170px] h-[62px] cursor-pointer'
      />
      <div className='hidden md:flex items-center justify-between lg:justify-normal lg:gap-32 w-full'>
        <div className='flex items-center gap-9 w-full'>
          <Link
            className='relative items-center bg-neutral-24 flex p-3 rounded-[14px] gap-4 w-[66px] cursor-pointer'
            href={'/#'}
          >
            <div className='w-2 h-2 rounded-full bg-primary-400 absolute -left-3' />
            <div className='w-4 h-4 items-center justify-center'>
              <Home className='w-4 h-4' />
            </div>
            <p className={`${gilroyBold.className} text-neutral-10 text-base`}>
              Home
            </p>
          </Link>
          <Link className='cursor-pointer' href={'/#contact'}>
            <p className={`${gilroyMedium.className} text-neutral-10`}>
              Contact Us
            </p>
          </Link>
          <Link className='cursor-pointer' href={'/#courses'}>
            <p className={`${gilroyMedium.className} text-neutral-10`}>
              Courses
            </p>
          </Link>
        </div>
        <div className='flex items-center justify-end lg:justify-normal gap-8 w-full'>
          <div
            className='flex button-primary px-6 py-4 items-center justify-center gap-2 cursor-pointer'
            onClick={() => router.push('/signin')}
          >
            <Profile className='w-6 h-6' />
            {/* <p className={`${gilroyMedium.className} text-neutral-10`}>Sign in</p> */}
            <p
              className={
                `${gilroyBold.className} text-neutral-10 relative 
                `
                // hover:after:w-[50%]
              }
            >
              Sign in
            </p>
          </div>
          {/* <div
            className={`px-6 items-center flex justify-center py-4 rounded-[10px] bg-gradient cursor-pointer`}
            onClick={() => router.push('/signup')}
          >
            <p className={`${gilroyBold.className} text-sm text-neutral-10`}>
              Create account
            </p>
          </div> */}
        </div>
      </div>
      <div className='cursor-pointer md:hidden' onClick={() => setIsOpen(true)}>
        <BoardMenu2 />
      </div>
      <div
        className={`md:hidden bg-primary-500 shadow-lg border border-grey-bg fixed top-0 right-0 bottom-0 w-[80vw] max-w-96 z-40 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={sidebarRef}
      >
        <div className='w-full h-[104px] items-center flex justify-end px-6'>
          <div className='cursor-pointer' onClick={() => setIsOpen(false)}>
            <CloseSquare size={40} />
          </div>
        </div>
        <div className='h-full w-full flex flex-col p-6 items-end gap-6'>
          <p
            className={`${gilroyBold.className} text-neutral-10 text-base cursor-pointer`}
          >
            Home
          </p>
          <p
            className={`${gilroyBold.className} text-neutral-10 text-base cursor-pointer`}
          >
            About Us
          </p>
          <p
            className={`${gilroyBold.className} text-neutral-10 text-base cursor-pointer`}
          >
            Courses
          </p>
          <div
            className='flex button-primary px-6 py-4 items-center justify-center gap-2 cursor-pointer'
            onClick={() => router.push('/signin')}
          >
            <Profile className='w-6 h-6' />
            {/* <p className={`${gilroyMedium.className} text-neutral-10`}>Sign in</p> */}
            <p
              className={
                `${gilroyBold.className} text-neutral-10 relative 
                `
                // hover:after:w-[50%]
              }
            >
              Sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
