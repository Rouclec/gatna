import Sidebar from '@/src/components/Sidebar'
import React from 'react'

import Users from '@/public/assets/icons/users.svg'
import AddUser from '@/public/assets/icons/add-user.svg'
import Airplay from '@/public/assets/icons/airplay.svg'
import CalenderDone from '@/public/assets/icons/calendar-done.svg'
import BankCard from '@/public/assets/icons/bank-card.svg'
import Plus from '@/public/assets/icons/plus.svg'
import DocumentVerified from '@/public/assets/icons/document-verified.svg'
import Filter from '@/public/assets/icons/filter.svg'
import Loading from '@/public/assets/icons/loading.svg'
import Completed from '@/public/assets/icons/complete.svg'
import Failed from '@/public/assets/icons/failed.svg'
import Copy from '@/public/assets/icons/copy.svg'

import { gilroyBold, gilroyMedium } from '@/src/pages/index'
import AdminInfoCard from '@/src/components/AdminInfoCard'
import { ChevronDown, ChevronUp, EditSquare } from 'react-iconly'
import moment from 'moment'
import CircularProgressBar from '@/src/components/CircularProgressBar'
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'

const colors = {
  high: {
    stroke: '#ED4D4D',
    background: '#ED4D4D30'
  },
  medium: {
    stroke: '#D89A00',
    background: '#D89A0030'
  },
  low: {
    stroke: '#00890E',
    background: '#00890E30'
  }
}

const cards = [
  {
    title: 'Total users.',
    quantity: 312,
    icon: <Users className='w-10' />
  },
  {
    title: 'Total subscribers.',
    quantity: 54,
    icon: <AddUser className='w-10' />
  },
  {
    title: 'Total videos.',
    quantity: 45,
    icon: <Airplay className='w-10' />
  },
  {
    title: 'Pending requests.',
    quantity: 65,
    icon: <CalenderDone className='w-10' />
  },
  {
    title: 'Total sales',
    quantity: `$23.00k`,
    icon: <BankCard className='w-10' />
  }
]

const data = [
  {
    id: '#GOAI13',
    date: '2024-05-23',
    first_name: 'Diana',
    last_name: 'Miller',
    email: 'whiteryan@warren.org',
    amount: '$250.00',
    course: 'Planning and development surveyor',
    method: 'cash',
    expiry_date: '2024-03-20',
    transcation_id: '3c96eb40-b851-47d0-a4c5-9d507adccb62',
    status: 'completed'
  },
  {
    id: '#AOITHW',
    date: '2024-06-21',
    first_name: 'Dennis',
    last_name: 'Good',
    email: 'fwilkinson@colon-bishop.info',
    amount: '$250.00',
    course: 'Actuary',
    method: 'cash',
    expiry_date: '2024-06-26',
    transcation_id: '0eb9a0ab-07be-47c7-8126-ea29a814eda9',
    status: 'pending'
  },
  {
    id: '#AIB918',
    date: '2024-10-18',
    first_name: 'Elizabeth',
    last_name: 'Marshall',
    amount: '$250.00',
    email: 'lgibbs@vaughn.biz',
    course: 'Information systems manager',
    method: 'mobile pay',
    expiry_date: '2024-11-30',
    transcation_id: '521bfaae-95b8-4f0d-ba9c-21dc981d010a',
    status: 'failed'
  },
  {
    id: '#19DHAG',
    date: '2024-10-15',
    first_name: 'Eric',
    last_name: 'Contreras',
    amount: '$250.00',
    email: 'lisamason@yahoo.com',
    course: 'Hospital doctor',
    method: 'mobile pay',
    expiry_date: '2024-12-10',
    transcation_id: 'bbffd019-e78d-4198-bca5-10b23b7cbff5',
    status: 'failed'
  },
  {
    id: '#ABJ917',
    date: '2024-9-12',
    first_name: 'Cathy',
    amount: '$250.00',
    last_name: 'Velasquez',
    email: 'bobbycampos@ramirez-may.org',
    course: 'Theatre director',
    method: 'mobile pay',
    expiry_date: '2024-10-04',
    transcation_id: '756e9f32-809e-489f-9450-36b7706b904c',
    status: 'completed'
  },
  {
    id: '#BY918S',
    date: '2024-9-23',
    first_name: 'Jenna',
    last_name: 'Duncan',
    amount: '$250.00',
    email: 'gonzalezmonica@stewart.com',
    course: 'Physiological scientist',
    method: 'cash',
    expiry_date: '2024-12-18',
    transcation_id: 'ad25da56-b6b3-40b4-8f83-5188aae47854',
    status: 'completed'
  },
  {
    id: '#BH9A19',
    date: '2024-10-12',
    first_name: 'Nancy',
    amount: '$250.00',
    last_name: 'Howard',
    email: 'keith09@hotmail.com',
    course: 'Designer, blown glass/stained glass',
    method: 'mobile pay',
    expiry_date: '2025-02-09',
    transcation_id: 'c64441e9-f50b-4190-ba2f-87fa3f8d678e',
    status: 'pending'
  }
]

function Index () {
  function calculateProgress (startDate: string, endDate: string): number {
    const start = new Date(startDate) // e.g. '2024-10-18'
    const end = new Date(endDate) // e.g. '2024-10-22'
    const today = new Date()

    // If the current date is after the end date, return 100%
    if (today >= end) {
      return 100
    }

    // Calculate the total number of days between the start and end date
    const totalTime = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) // Convert milliseconds to days

    // Calculate the number of days passed since the start date
    const timePassed =
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) // Convert milliseconds to days

    // Calculate the percentage of time passed
    const percentage = (timePassed / totalTime) * 100

    // Ensure percentage does not go below 0% or above 100%, and return it as a number
    return parseFloat(Math.min(Math.max(percentage, 0), 100).toFixed(2))
  }

  return (
    <Sidebar>
      <div className='ml-12 mr-20 mt-8 flex flex-col gap-8'>
        <div className='grid mx-auto md:mx-0 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center gap-8'>
          {cards.map((card, index) => {
            return <AdminInfoCard item={card} key={card.title} index={index} />
          })}
        </div>
        <div className='w-full p-8 rounded-3xl bg-grey-bg overflow-x-auto'>
          <div className='w-full flex items-center justify-between'>
            <div className='flex items-center gap-[10px]'>
              <DocumentVerified className='w-[52px]' />
              <p className={`${gilroyBold.className} text-2xl text-white`}>
                Users list
              </p>
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
                className={`focus:ring-0 focus:outline-none text-neutral-10 bg-transparent w-full ${gilroyMedium.className}`}
                placeholder='Search'
              />
              <div className='flex-shrink-0 w-5'>
                <Filter className='w-full' />
              </div>
            </div>
            <div className='button-primary px-4 py-3 gap-4'>
              <Plus className={'w-5'} />
              <p className={`${gilroyBold.className} text-sm text-white`}>
                Add new
              </p>
            </div>
          </div>
          <table className='min-w-full w-full table-auto mt-7'>
            <thead className='bg-neutral-CF bg-opacity-10 rounded-lg'>
              <tr>
                <th className='text-left px-3 py-5 whitespace-nowrap rounded-l-lg'>
                  <div className='flex gap-1 items-center'>
                    <p
                      className={`${gilroyBold.className} text-sm text-neutral-50`}
                    >
                      SL
                    </p>
                  </div>
                </th>
                <th className='text-left px-3 py-5 whitespace-nowrap'>
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
                      Buy date
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
                      First name
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
                      Last name
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
                      Email
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
                      Course
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
                      Amount
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
                      Method
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
                      Expiry date
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
                      Transaction ID
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
              {data.map((item, index) => {
                const progress = calculateProgress(item.date, item.expiry_date)
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
                        {moment(item.date).format('DD-MM-YYYY')}
                      </p>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item.first_name}
                      </p>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item.last_name}
                      </p>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item.email}
                      </p>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item.course.charAt(0).toUpperCase() +
                          item.course.slice(1)}
                      </p>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item.amount}
                      </p>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item.method.charAt(0).toUpperCase() +
                          item.method.slice(1)}
                      </p>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <div className='flex items-center justify-between'>
                        <p
                          className={`${gilroyMedium.className} text-sm text-neutral-10`}
                        >
                          {moment(item.expiry_date).format('DD-MM-YYYY')}
                        </p>
                        <div className='w-5 h-5 flex-shrink-0 flex items-center justify-center'>
                          <CircularProgressBar
                            radius={14}
                            strokeWidth={3}
                            percentage={progress}
                            pathColor='#FFFFFF33'
                            strokeColor={
                              progress < 40
                                ? colors.low.stroke
                                : progress < 80
                                ? colors.medium.stroke
                                : colors.high.stroke
                            }
                          />
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28 underline text-success cursor-pointer'>
                      {item.transcation_id}
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center`}
                          style={{
                            backgroundColor:
                              item.status === 'pending'
                                ? '#E8B04433'
                                : item.status === 'completed'
                                ? '#14A42B33'
                                : '#D1416333'
                          }}
                        >
                          {item.status === 'pending' ? (
                            <Loading className='w-3' />
                          ) : item.status === 'completed' ? (
                            <Completed className='w-3' />
                          ) : (
                            <Failed className='w-3' />
                          )}
                        </div>
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center ${
                            item.status === 'completed'
                              ? 'cursor-pointer'
                              : 'cursor-not-allowed'
                          }`}
                          style={{
                            backgroundColor:
                              item.status === 'completed'
                                ? '#3FA247'
                                : '#A6A6A61A'
                          }}
                        >
                          <Copy
                            stroke={
                              item.status === 'completed'
                                ? '#ffffff'
                                : '#606060'
                            }
                            className={'w-4 h-4'}
                          />
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
    </Sidebar>
  )
}

export default Index

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
