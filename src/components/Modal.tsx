import React from 'react'
import { CloseSquare } from 'react-iconly'

interface ModalProps {
  type: 'success' | 'error' | 'info' // Modal type determines styles
  heading: string // Heading text
  body: string // Body text
  onClose?: () => void // Function to close the modal
  onConfirm?: () => void // Optional confirm action
  onCancel?: () => void // Optional cancel action
}

const Modal: React.FC<ModalProps> = ({
  type,
  heading,
  body,
  onClose,
  onConfirm,
  onCancel
}) => {
  // Define styles based on modal type
  const typeStyles = {
    success: {
      headingColor: 'text-green',
      borderColor: 'border-green'
    },
    error: {
      headingColor: 'text-red-600',
      borderColor: 'border-red-600'
    },
    info: {
      headingColor: 'text-primary-300',
      borderColor: 'border-primary-300'
    }
  }

  const styles = typeStyles[type]

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md'>
      <div
        className={`bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md border-l-4 ${styles.borderColor}`}
      >
        <div className='flex justify-between items-center'>
          <h2 className={`text-xl font-bold ${styles.headingColor}`}>
            {heading}
          </h2>
          {!onConfirm && !onCancel && onClose && (
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 focus:outline-none'
            >
              <CloseSquare set='bold' size={24} />
            </button>
          )}
        </div>
        <p className='text-gray-700 mt-4'>{body}</p>

        {/* Render action buttons if onConfirm or onCancel is provided */}
        {(onConfirm || onCancel) && (
          <div className='flex justify-center mt-6 space-x-4'>
            {onCancel && (
              <button
                onClick={onCancel}
                className='px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none'
              >
                Cancel
              </button>
            )}
            {onConfirm && (
              <button
                onClick={onConfirm}
                className='px-4 py-2 bg-primary-300 text-white rounded hover:bg-blue-700 focus:outline-none'
              >
                OK
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
