import Sidebar from '@/src/components/Sidebar'
import React, { ChangeEvent, FC, useState } from 'react'

import DocumentVerified from '@/public/assets/icons/document-verified.svg'
import Filter from '@/public/assets/icons/filter.svg'
import Completed from '@/public/assets/icons/complete.svg'
import Failed from '@/public/assets/icons/failed.svg'

import { gilroyBold, gilroyMedium, gilroyRegular } from '@/src/pages/index'
import { ChevronDown, ChevronUp, EditSquare } from 'react-iconly'
import CheckMark from '@/public/assets/icons/checkmark.svg'
import ClipboardText from '@/public/assets/icons/clipboard-text.svg'
import DocumentText from '@/public/assets/icons/document-text.svg'
import Reels from '@/public/assets/icons/reels.svg'
import Stopwatch from '@/public/assets/icons/stopwatch.svg'
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'

const courses = [
  {
    id: 'A1B2C3D4E5F6G7H8',
    courseTitle: 'Intro to Cryptocurrency Basics',
    description:
      'Learn the fundamentals of cryptocurrency, blockchain technology, and digital wallets.',
    fileType: 'Video',
    duration: 60,
    status: 'Completed'
  },
  {
    id: 'I9J8K7L6M5N4O3P2',
    courseTitle: 'Blockchain Technology Explained',
    description:
      "A deep dive into how blockchain works and why it's considered revolutionary in finance.",
    fileType: 'PDF',
    status: 'failed'
  },
  {
    id: 'Q1R2S3T4U5V6W7X8',
    courseTitle: 'Advanced Crypto Trading Strategies',
    description:
      'Discover advanced techniques for analyzing and trading cryptocurrencies effectively.',
    fileType: 'Video',
    duration: 120,
    status: 'failed'
  },
  {
    id: 'Y9Z8A7B6C5D4E3F2',
    courseTitle: 'Understanding Decentralized Finance (DeFi)',
    description:
      'An introduction to DeFi, including popular protocols and risk management.',
    fileType: 'Video',
    duration: 90,
    status: 'failed'
  },
  {
    id: 'G1H2I3J4K5L6M7N8',
    courseTitle: 'Crypto Wallet Security Best Practices',
    description:
      'Learn essential security practices for protecting your digital assets.',
    fileType: 'PDF',
    status: 'failed'
  },
  {
    id: 'O9P8Q7R6S5T4U3V2',
    courseTitle: 'Ethereum and Smart Contracts',
    description:
      "A beginner's guide to Ethereum and how smart contracts work within the network.",
    fileType: 'Video',
    duration: 75,
    status: 'failed'
  },
  {
    id: 'W1X2Y3Z4A5B6C7D8',
    courseTitle: 'NFTs: Creating and Collecting Digital Art',
    description:
      'Explore the world of NFTs, from creating digital assets to collecting and investing.',
    fileType: 'Video',
    duration: 50,
    status: 'failed'
  },
  {
    id: 'E9F8G7H6I5J4K3L2',
    courseTitle: 'Mining Cryptocurrency: Getting Started',
    description:
      'An overview of cryptocurrency mining, hardware requirements, and profitability.',
    fileType: 'PDF',
    status: 'failed'
  },
  {
    id: 'M1N2O3P4Q5R6S7T8',
    courseTitle: 'Crypto Taxation and Compliance',
    description:
      'Understand the taxation rules and compliance requirements for crypto transactions.',
    fileType: 'Video',
    duration: 45,
    status: 'failed'
  },
  {
    id: 'U9V8W7X6Y5Z4A3B2',
    courseTitle: 'Exploring Altcoins Beyond Bitcoin',
    description:
      'An in-depth look at altcoins, their uses, and how they differ from Bitcoin.',
    fileType: 'PDF',
    status: 'failed'
  }
]

const courseTypes = ['Gatna 1', 'Gatna 2', 'Gatna 3', 'Gatna 4']

interface InputProps {
  leftIcon?: React.ReactNode
  options?: { label: string; value: string | number }[]
  placeholder: string
  inputMode?:
    | 'text'
    | 'none'
    | 'search'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | undefined
  value: string | number | undefined
  onChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => void
}
const Input: FC<InputProps> = ({
  placeholder,
  options,
  value,
  inputMode = 'text',
  leftIcon,
  onChange
}) => {
  return (
    <div className='flex w-full h-16 rounded-lg bg-black bg-opacity-15 border-[1px] border-grey-bg p-2 pr-4 gap-2 items-center'>
      {leftIcon}
      {options ? (
        <select
          className='flex-grow h-full bg-transparent focus:outline-none'
          onChange={onChange}
          value={value}
        >
          <option
            value=''
            className={`${gilroyRegular.className} text-red-700 text-opacity-50 text-xs`}
            disabled
          >
            {placeholder}
          </option>
          {options.map((item, index) => (
            <option value={item.value} key={index}>
              {item.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className='flex-grow h-full bg-transparent focus:outline-none'
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          inputMode={inputMode}
        />
      )}
    </div>
  )
}

function CreateCourse () {
  const [selectedType, setSelectedType] = useState(0)
  const [courseType, setCourseType] = useState<string>()
  const [durtion, setDurtion] = useState<number>()
  const [courseTitle, setCourseTitle] = useState<string>()
  const [videoID, setVideoID] = useState<string>()
  const [description, setDescripton] = useState<string>()
  return (
    <Sidebar>
      <div className='container ml-12 mr-20 mt-8 grid grid-cols-11 gap-3 items-center justify-center'>
        <div className='flex flex-col h-full gap-8 col-span-11 lg:col-span-4'>
          <div className='w-full p-8 h-full rounded-3xl bg-grey-bg overflow-x-auto flex flex-col gap-12'>
            <div className='w-full flex items-center justify-between'>
              <div className='flex items-center gap-[10px]'>
                <DocumentVerified className='w-[52px]' />
                <div>
                  <p className={`${gilroyBold.className} text-2xl text-white`}>
                    Create course
                  </p>
                  <p
                    className={`${gilroyRegular.className} text-base text-grey-60`}
                  >
                    Fill the form to add a video to a course
                  </p>
                </div>
              </div>
            </div>
            <div className='w-full rounded-2xl bg-black bg-opacity-25 flex items-center justify-evenly gap-2 px-3 py-5'>
              {courseTypes.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`${
                      selectedType === index ? 'button-primary' : 'button-dark'
                    } cursor-pointer py-4 px-6 relative`}
                    onClick={() => setSelectedType(index)}
                  >
                    <p className={`${gilroyBold.className} text-xs text-white`}>
                      {item}
                    </p>
                    {selectedType === index && (
                      <div className='flex items-center justify-center w-[18px] h-[18px] rounded-full bg-whatsapp absolute -top-1 -right-1'>
                        <CheckMark className='w-3 h-3' />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className='grid gap-16'>
              <div className='grid gap-x-3 gap-y-5'>
                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    options={[
                      {
                        label: 'Video',
                        value: 'video'
                      },
                      {
                        label: 'PDF',
                        value: 'pdf˝'
                      }
                    ]}
                    onChange={e => setCourseType(e.target.value)}
                    placeholder='Video/PDF'
                    value={courseType}
                    leftIcon={<ClipboardText />}
                  />
                  <Input
                    leftIcon={<Stopwatch />}
                    placeholder='Duration'
                    value={durtion}
                    inputMode='numeric'
                    onChange={e => setDurtion(+e.target.value)}
                  />
                  <Input
                    leftIcon={<DocumentText />}
                    placeholder='Course title'
                    value={courseTitle}
                    onChange={e => setCourseTitle(e.target.value)}
                  />
                  <Input
                    leftIcon={<Reels className='w-5 h-5' />}
                    placeholder='Video ID'
                    value={videoID}
                    onChange={e => setVideoID(e.target.value)}
                  />
                </div>
                <div className='w-full h-28 rounded-lg bg-black bg-opacity-15'>
                  <textarea
                    className='w-full h-full bg-transparent focus:outline-none px-5 py-3'
                    placeholder='Description'
                    value={description}
                    onChange={e => setDescripton(e.target.value)}
                  />
                </div>
              </div>
              <button className='w-fit button-primary flex px-8 py-5 items-center justify-center'>
                <p className={`${gilroyBold.className} text-sm`}>Save & Add</p>
              </button>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-8 col-span-11 lg:col-span-7'>
          <div className='w-full p-8 rounded-3xl bg-grey-bg overflow-x-auto max-h-screen overflow-y-auto'>
            <div className='w-full flex items-center justify-between'>
              <div className='flex items-center gap-[10px]'>
                <DocumentVerified className='w-[52px]' />
                <div>
                  <p className={`${gilroyBold.className} text-2xl text-white`}>
                    Video list
                  </p>
                  <p
                    className={`${gilroyRegular.className} text-base text-grey-60`}
                  >
                    List of all courses videos
                  </p>
                </div>
              </div>
              <div className='flex px-3 py-4 items-center gap-4 bg-neutral-C4 bg-opacity-10 rounded-[10px]'>
                <p className={`${gilroyMedium.className} text-sm text-white`}>
                  Show
                </p>
                <div className='w-1 h-3 bg-neutral-50 bg-opacity-50 rounded' />
                <p
                  className={`${gilroyMedium.className} text-sm text-white cursor-pointer`}
                >
                  05
                </p>
                <ChevronDown
                  size={16}
                  primaryColor='#f5f5f5'
                  style={{
                    cursor: 'pointer'
                  }}
                />
              </div>
              <div className='flex items-center justify-between w-52 px-5 py-4 bg-neutral-C4 bg-opacity-10 rounded-[10px]'>
                <input
                  className={`focus:ring-0 focus:outline-none bg-transparent w-full ${gilroyMedium.className}`}
                  placeholder='Search'
                />
                <div className='flex-shrink-0 w-5'>
                  <Filter className='w-full' />
                </div>
              </div>
            </div>
            <table className='min-w-full w-full table-auto mt-7'>
              <thead className='bg-neutral-CF bg-opacity-10 rounded-lg'>
                <tr>
                  <th className='text-left px-3 py-5 whitespace-nowrap rounded-l-lg'>
                    <input className='checkbox-custom' type='checkbox' />
                  </th>
                  <th className='text-left px-3 py-5 whitespace-nowrap rounded-l-lg'>
                    <div className='flex gap-1 items-center'>
                      <p
                        className={`${gilroyBold.className} text-sm text-neutral-50`}
                      >
                        ID
                      </p>
                    </div>
                  </th>
                  <th className='text-left px-3 py-5 whitespace-nowrap'>
                    <div className='flex gap-1 items-center'>
                      <div className='h-6 items-center gap-0 my-auto'>
                        <ChevronUp
                          size={12}
                          primaryColor='#606060'
                          style={{
                            cursor: 'pointer'
                          }}
                        />
                        <ChevronDown
                          size={12}
                          primaryColor='#606060'
                          style={{
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                      <p
                        className={`${gilroyBold.className} text-sm text-neutral-50`}
                      >
                        Course title
                      </p>
                    </div>
                  </th>
                  <th className='text-left px-3 py-5 whitespace-nowrap'>
                    <div className='flex gap-1 items-center'>
                      <div className='h-6 items-center gap-0 my-auto'>
                        <ChevronUp
                          size={12}
                          primaryColor='#606060'
                          style={{
                            cursor: 'pointer'
                          }}
                        />
                        <ChevronDown
                          size={12}
                          primaryColor='#606060'
                          style={{
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                      <p
                        className={`${gilroyBold.className} text-sm text-neutral-50`}
                      >
                        Description
                      </p>
                    </div>
                  </th>
                  <th className='text-left px-3 py-5 whitespace-nowrap'>
                    <div className='flex gap-1 items-center'>
                      <div className='h-6 items-center gap-0 my-auto'>
                        <ChevronUp
                          size={12}
                          primaryColor='#606060'
                          style={{
                            cursor: 'pointer'
                          }}
                        />
                        <ChevronDown
                          size={12}
                          primaryColor='#606060'
                          style={{
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                      <p
                        className={`${gilroyBold.className} text-sm text-neutral-50`}
                      >
                        File type
                      </p>
                    </div>
                  </th>
                  <th className='text-left px-3 py-5 whitespace-nowrap'>
                    <div className='flex gap-1 items-center'>
                      <div className='h-6 items-center gap-0 my-auto'>
                        <ChevronUp
                          size={12}
                          primaryColor='#606060'
                          style={{
                            cursor: 'pointer'
                          }}
                        />
                        <ChevronDown
                          size={12}
                          primaryColor='#606060'
                          style={{
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                      <p
                        className={`${gilroyBold.className} text-sm text-neutral-50`}
                      >
                        Duration
                      </p>
                    </div>
                  </th>
                  <th className='text-left px-3 py-5 whitespace-nowrap rounded-r-lg'>
                    <div className='flex gap-1 items-center'>
                      <div className='h-6 items-center gap-0 my-auto'>
                        <ChevronUp
                          size={12}
                          primaryColor='#606060'
                          style={{
                            cursor: 'pointer'
                          }}
                        />
                        <ChevronDown
                          size={12}
                          primaryColor='#606060'
                          style={{
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                      <p
                        className={`${gilroyBold.className} text-sm text-neutral-50`}
                      >
                        Action
                      </p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                        <input className='checkbox-custom' type='checkbox' />
                      </td>
                      <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                        <p
                          className={`${gilroyMedium.className} text-sm text-neutral-10`}
                        >
                          {item.id}
                        </p>
                      </td>

                      <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                        <p
                          className={`${gilroyMedium.className} text-sm text-neutral-10`}
                        >
                          {item.courseTitle}
                        </p>
                      </td>
                      <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                        <p
                          className={`${gilroyMedium.className} text-sm text-neutral-10`}
                        >
                          {item.description}
                        </p>
                      </td>
                      <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                        <p
                          className={`${gilroyMedium.className} text-sm text-neutral-10`}
                        >
                          {item.fileType}
                        </p>
                      </td>

                      <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                        <p
                          className={`${gilroyMedium.className} text-sm text-neutral-10`}
                        >
                          {item?.duration
                            ? `${Math.floor(item.duration / 60)}:${
                                item.duration % 60
                              }`
                            : 'N/A'}
                        </p>
                      </td>
                      <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                        <div className='flex items-center gap-3'>
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center`}
                            style={{
                              backgroundColor:
                                item.status === 'completed'
                                  ? '#14A42B33'
                                  : '#D1416333'
                            }}
                          >
                            {item.status === 'completed' ? (
                              <Completed className='w-3' />
                            ) : (
                              <Failed className='w-3' />
                            )}
                          </div>
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer bg-info`}
                          >
                            <EditSquare primaryColor='#ffffff' size={12} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}

export default CreateCourse


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

  console.log(session.user.role)

  // Check if the user has the admin role
  if (session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/403',
        permanent: false
      }
    }
  }

  // If the user is an admin, proceed to render the page
  return {
    props: { session }
  }
}