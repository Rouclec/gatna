// components/ReferralLink.tsx

import { FC, useState } from 'react'
import { FaCopy } from 'react-icons/fa' // Install react-icons if not already installed

interface Props {
  referralLink: string | undefined | null
}

const ReferralLink: FC<Props> = ({ referralLink }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink ?? '')
      setIsCopied(true)

      // Reset copy state after a delay
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  if (!referralLink) return <></>
  return (
    <div className='flex items-center space-x-4  p-4 rounded-md shadow-md'>
      {/* Display the referral link */}
      <div className='flex-grow text-sm text-gray-700'>
        <span className='font-semibold text-white'>Your Referral Link:</span>{' '}
        <br />
        <span className='text-[#3182ce]'>{referralLink}</span>
      </div>
      {/* Copy Icon */}
      <button
        onClick={handleCopy}
        className='flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none'
      >
        <FaCopy />
        <span>{isCopied ? 'Copied!' : 'Copy'}</span>
      </button>
    </div>
  )
}

export default ReferralLink
