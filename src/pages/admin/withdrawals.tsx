import Sidebar from '@/src/components/Sidebar'
import React, { useEffect, useState } from 'react'

import DocumentVerified from '@/public/assets/icons/document-verified.svg'
import Filter from '@/public/assets/icons/filter.svg'
import Loading from '@/public/assets/icons/loading.svg'
import Completed from '@/public/assets/icons/complete.svg'
import Failed from '@/public/assets/icons/failed.svg'

import { gilroyBold, gilroyMedium, gilroyRegular } from '@/src/pages/index'
import { ChevronDown, ChevronUp } from 'react-iconly'
import moment from 'moment'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import {
  useGetAdminWithdrawals,
  useUpdateWithdrawal,
  Withdrawal
} from '@/src/hooks/withdrawals'
import { FadeLoader } from 'react-spinners'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { Modal } from '@/src/components'

const CURRENCY_SYMBOL = {
  'USDT.TRC20': '$',
  EUR: '€',
  GBP: '£',
  XAF: 'XAF'
} as const // `as const` ensures the keys and values are readonly

function getCurrencySymbol (currency: string | undefined): string {
  if (!currency) return CURRENCY_SYMBOL.XAF
  if (currency in CURRENCY_SYMBOL) {
    return CURRENCY_SYMBOL[currency as keyof typeof CURRENCY_SYMBOL]
  }
  return currency
}

function PendingActivation () {
  const [isCopied, setIsCopied] = useState(-1)
  const [status, setStatus] = useState<'completed' | 'canceled'>()
  const [item, setItem] = useState<Withdrawal>()
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<string>()
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<Withdrawal[]>(
    []
  )

  const { data: withdrawals, isFetched } = useGetAdminWithdrawals()
  const { mutateAsync } = useUpdateWithdrawal(
    () => {
      window.location.reload()
    },
    error => {
      if (!!error?.response?.data?.message) {
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

  useEffect(() => {
    if (isFetched && withdrawals) {
      setFilteredWithdrawals(withdrawals)
    }
  }, [isFetched, withdrawals])

  const handleUpdateWithdrawal = async () => {
    try {
      setIsLoading(true)
      await mutateAsync({
        id: item!._id!,
        status: status!
      })
    } catch (error) {
      console.error(error)
    } finally {
      setItem(undefined)
      setStatus(undefined)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isCopied != -1) {
      timer = setTimeout(() => {
        setIsCopied(-1)
      }, 2000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isCopied])

  useEffect(() => {
    if (!filter) {
      setFilteredWithdrawals(withdrawals ?? [])
    } else {
      const lowercasedValue = filter.toLowerCase()
      const filtered =
        withdrawals?.filter(({ user }) => {
          const searchableObject = user
          delete searchableObject.referredBy
          return Object.values(searchableObject).some(field => {
            return (
              typeof field === 'string' &&
              field.toLowerCase().includes(lowercasedValue)
            )
          })
        }) ?? []

      setFilteredWithdrawals(filtered)
    }
  }, [filter, withdrawals])

  return (
    <Sidebar>
      {!isFetched && (
        <div className='absolute inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm z-[9999] flex items-start pt-[30vh] justify-center'>
          <FadeLoader />
        </div>
      )}
      <div className='ml-12 mr-20 mt-8 flex flex-col gap-8'>
        <div className='w-full p-8 rounded-3xl bg-grey-bg overflow-x-auto'>
          <div className='w-full flex items-center justify-between'>
            <div className='flex items-center gap-[10px]'>
              <DocumentVerified className='w-[52px]' />
              <div>
                <p className={`${gilroyBold.className} text-2xl text-white`}>
                  Pending withdrawals
                </p>
                <p
                  className={`${gilroyRegular.className} text-base text-grey-60`}
                >
                  List
                </p>
              </div>
            </div>
            <div className='flex items-center justify-between w-52 px-5 py-4 bg-neutral-C4 bg-opacity-10 rounded-[10px]'>
              <input
                className={`focus:ring-0 text-input focus:outline-none text-neutral-10 bg-transparent w-full ${gilroyMedium.className}`}
                placeholder='Search'
                onChange={e => setFilter(e.target.value)}
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
                      Date
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
                      Wallet ID
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
                      Status
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
              {filteredWithdrawals?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <input className='checkbox-custom' type='checkbox' />
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {moment(item.createdAt).format('DD-MM-YYYY')}
                      </p>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item.user.firstName}
                      </p>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item.user.lastName}
                      </p>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item.user.email}
                      </p>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {getCurrencySymbol(item.currency)}
                        {item.amount}
                      </p>
                    </td>
                    <td
                      className='px-3 py-5 whitespace-nowrap overflow-hidden'
                      onClick={async () => {
                        await navigator.clipboard.writeText(item.walletId ?? '')
                        setIsCopied(index)
                      }}
                    >
                      <div className='gap-4 relative'>
                        <p className='whitespace-nowrap overflow-hidden text-ellipsis max-w-28 underline text-success cursor-pointer'>
                          {item.walletId}
                        </p>
                        {isCopied === index && (
                          <p
                            className={`text-grey-500 absolute text-center no-underline transition-opacity duration-3000 ease-out opacity-100`}
                            style={{ opacity: isCopied === index ? 1 : 0 }}
                          >
                            Copied
                          </p>
                        )}
                      </div>
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
                        <p>
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </p>
                      </div>
                    </td>
                    <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                      <div className='flex items-center gap-3'>
                        <button
                          className={`w-8 h-8 rounded-md flex items-center justify-center ${
                            item.status !== 'pending'
                              ? 'opacity-60 cursor-not-allowed'
                              : 'cursor-pointer'
                          }`}
                          style={{
                            backgroundColor: '#14A42B33'
                          }}
                          disabled={item.status !== 'pending'}
                          onClick={() => {
                            setItem(item)
                            setStatus('completed')
                          }}
                        >
                          <FaCheckCircle color='#14A42B' />
                        </button>
                        <button
                          className={`w-8 h-8 rounded-md flex items-center justify-center ${
                            item.status !== 'pending'
                              ? 'opacity-60 cursor-not-allowed'
                              : 'cursor-pointer'
                          }`}
                          style={{
                            backgroundColor: '#D1416333'
                          }}
                          disabled={item.status !== 'pending'}
                          onClick={() => {
                            setItem(item)
                            setStatus('canceled')
                          }}
                        >
                          <FaTimesCircle color='#D14163' />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {item && status === 'completed' && (
        <Modal
          type='success'
          heading='Confirm payment'
          body={`Are you sure you want to validate this payment of ${getCurrencySymbol(
            item?.currency
          )}${item?.amount}?`}
          confirmTxt='Yes'
          onConfirm={handleUpdateWithdrawal}
          onCancel={() => {
            setItem(undefined)
            setStatus(undefined)
          }}
          isLoading={isLoading}
        />
      )}
      {item && status === 'canceled' && (
        <Modal
          type='error'
          heading='Reject payment'
          body={`Are you sure you want to reject this payment of ${getCurrencySymbol(
            item?.currency
          )}${item?.amount}?`}
          confirmTxt='Yes'
          onConfirm={handleUpdateWithdrawal}
          onCancel={() => {
            setItem(undefined)
            setStatus(undefined)
          }}
          isLoading={isLoading}
        />
      )}
      {error && (
        <Modal type='error' heading='Error updating payment' body={error} />
      )}
    </Sidebar>
  )
}

export default PendingActivation

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
