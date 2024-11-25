import React, { FC, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import logoicon from '@/public/assets/images/logo-icon.png'
import Reels from '@/public/assets/icons/reels.svg'
import Email from '@/public/assets/icons/email.svg'
import Logout from '@/public/assets/icons/logout.svg'
import Settings from '@/public/assets/icons/settings.svg'
import ArrowCircle from '@/public/assets/icons/arrow-circle.svg'
import BoardMenu2 from '@/public/assets/icons/board-menu-2.svg'
import { gilroyBold, gilroyRegular } from '../pages'
import MainNav from './MainNav'
import AdminNav from './AdminNav'
import Footer from './Footer'
import { signOut } from 'next-auth/react'
import { Category, Wallet } from 'react-iconly'

type Props = {
  children: React.ReactNode
}

const NAV_ITEMS = [
  {
    name: 'Videos',
    route: '/users/home',
    logoActive: <Reels className='w-6 h-6' />,
    logo: <Reels className='w-8 h-8' />
  },
  {
    name: 'Message',
    route: '/users/message',
    logoActive: <Email className='w-6 h-6' />,
    logo: <Email className='w-8 h-8' />
  },
  {
    name: 'Withdraw',
    route: '/users/withdraw',
    logoActive: <Wallet size={24} />,
    logo: <Wallet size={32} />
  }
]

const ADMIN_NAV_ITEMS = [
  {
    name: 'Dashboard',
    route: '/admin',
    logoActive: <Category size={24} />,
    logo: <Category size={32} />
  },
  {
    name: 'Courses',
    route: '/admin/course/create',
    logoActive: <Reels className='w-6 h-6' />,
    logo: <Reels className='w-8 h-8' />
  },
  {
    name: 'Activations',
    route: '/admin/pending-activations',
    logoActive: <ArrowCircle className='w-6 h-6' />,
    logo: <ArrowCircle className='w-8 h-8' />
  },
  {
    name: 'gatna.io',
    route: '/',
    logoActive: <ArrowCircle className='w-6 h-6' />,
    logo: <ArrowCircle className='w-8 h-8' />
  }
]

const SETTINGS = {
  name: 'Settings',
  route: '/users/settings',
  logoActive: <Settings className='w-6 h-6' />,
  logo: <Settings className='w-8 h-8' />
}
const ADMIN_SETTINGS = {
  name: 'Settings',
  route: '/admin/settings',
  logoActive: <Settings className='w-6 h-6' />,
  logo: <Settings className='w-8 h-8' />
}

const Sidebar: FC<Props> = ({ children }) => {
  const router = useRouter()
  const { pathname } = router
  const [activeNav, setActiveNav] = useState(NAV_ITEMS)
  const [activeSettings, setActiveSettings] = useState(SETTINGS)
  const [active, setActive] = useState<{
    name: string
    route: string
    logo: React.JSX.Element
  }>()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pathname.split('/')[1] === 'admin') {
      setActiveNav(ADMIN_NAV_ITEMS)
      setActiveSettings(ADMIN_SETTINGS)
    }

    if (pathname === SETTINGS.route) {
      setActive(SETTINGS)
    } else {
      setActive(activeNav.find(item => item.route === pathname))
    }
  }, [pathname, activeNav])

  useEffect(() => {
    // Function to close sidebar when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false)
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='flex'>
      {/* Sidebar Toggle Button for Small Screens */}
      <div className='md:hidden fixed top-0 left-2 z-50 h-16 sm:h-[120px]'>
        <div
          className={`h-full  ${
            sidebarOpen ? 'hidden' : 'flex'
          } items-center justify-center w-full`}
        >
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <BoardMenu2 />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed z-40 h-screen bg-primary-200 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-[108px]`}
      >
        <aside
          ref={sidebarRef}
          className='flex flex-col items-start top-0 left-0 h-screen bg-primary-200 w-[108px] p-4 pt-0 z-50'
        >
          <div className='h-[152px] w-full flex items-center justify-center'>
            <Image src={logoicon} alt='logo' width={45} height={45} />
          </div>
          <div className='h-full px-6 mt-8 self-center flex flex-col items-center justify-between'>
            <div>
              <div className='grid w-full gap-6'>
                {activeNav.map((item, index) => (
                  <div
                    key={item.route}
                    className='flex flex-col items-center gap-6'
                  >
                    <div
                      className='flex flex-col gap-[2px] items-center justify-center cursor-pointer'
                      onClick={() => {
                        router.push(item.route)
                        setSidebarOpen(false)
                      }}
                    >
                      <div
                        className={`${
                          item.name === active?.name
                            ? 'w-[54px] h-[54px] icon-gradient'
                            : 'w-8 h-8'
                        } rounded-[10px] flex items-center justify-center`}
                      >
                        {item.name === active?.name
                          ? item.logoActive
                          : item.logo}
                      </div>
                      <p
                        className={`${
                          item.name === active?.name
                            ? gilroyBold.className
                            : gilroyRegular.className
                        } text-sm text-grey-60`}
                      >
                        {item.name}
                      </p>
                    </div>
                    {index + 1 !== activeNav.length && (
                      <div className='w-[14px] border-[2px] opacity-20 bg-neutral-21 rounded-sm' />
                    )}
                  </div>
                ))}
              </div>
              <div className='w-full mt-16 flex flex-col items-center gap-16'>
                <div className='w-[14px] border-[2px] opacity-20 bg-neutral-21 rounded-sm' />
                <div
                  className='flex flex-col gap-[2px] items-center justify-center cursor-pointer'
                  onClick={() => {
                    router.push(activeSettings.route)
                    setActive(activeSettings)
                    setSidebarOpen(false)
                  }}
                >
                  <div
                    className={`${
                      SETTINGS.name === active?.name
                        ? 'w-[54px] h-[54px] icon-gradient'
                        : 'w-8 h-8'
                    } rounded-[10px] flex items-center justify-center`}
                  >
                    {activeSettings.name === active?.name
                      ? activeSettings.logoActive
                      : activeSettings.logo}
                  </div>
                  <p
                    className={`${
                      activeSettings.name === active?.name
                        ? gilroyBold.className
                        : gilroyRegular.className
                    } text-sm text-grey-60`}
                  >
                    {activeSettings.name}
                  </p>
                </div>
              </div>
            </div>
            <div
              className='self-center flex bg-error w-[60px] h-[54px] rounded-xl items-center justify-center cursor-pointer'
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <Logout className='w-6 h-6' />
            </div>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className='lg:container lg:mx-auto w-screen min-h-screen'>
        {activeNav === ADMIN_NAV_ITEMS ? <AdminNav /> : <MainNav />}
        <div className='my-24 sm:my-40 md:ml-[108px]'>{children}</div>
        <div className='md:ml-[108px]'>
          <Footer />
        </div>
      </main>
    </div>
  )
}

export default Sidebar
