import Sidebar from '@/src/components/Sidebar'
import React, { ChangeEvent, FC, useEffect, useState } from 'react'

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
// import Stopwatch from '@/public/assets/icons/stopwatch.svg'
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import {
  Course,
  CreateCourseRequest,
  useDeleteCourse,
  useGetCoursesAdmin,
  useSaveCourse,
  useUpdateCourse
} from '@/src/hooks/course'
import { storage } from '@/src/util/firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { ClipLoader, FadeLoader } from 'react-spinners'
import { useGetPackages } from '@/src/hooks/package'
import { Modal } from '@/src/components'
import { FaTrash } from 'react-icons/fa'

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
export const Input: FC<InputProps> = ({
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
          className='flex-grow h-full text-input text-neutral-10 bg-transparent focus:outline-none'
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
  // const [durtion, setDurtion] = useState<number>()
  const [courseTitle, setCourseTitle] = useState<string>()
  const [videoID, setVideoID] = useState<string>()
  const [description, setDescripton] = useState<string>()
  const [published, setPublished] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course>()
  const [downloadURL, setDownloadURL] = useState<string>()
  const [deletingItem, setDeletingItem] = useState<{
    id: string
    title: string
  }>()

  const [file, setFile] = useState<File | null>(null)
  // const [progress, setProgress] = useState(0);
  // const [downloadURL, setDownloadURL] = useState('')
  const [loading, setLoading] = useState(false)

  const [serverError, setServerError] = useState<string>()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = (): Promise<string> => {
    if (!file) return Promise.resolve('')

    // setDownloadURL('')
    setServerError(undefined)

    return new Promise((resolve, reject) => {
      // Create a storage reference
      const storageRef = ref(storage, `uploads/${file.name}`)

      // Start the file upload
      const uploadTask = uploadBytesResumable(storageRef, file)

      // Monitor upload progress
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
        },
        error => {
          setServerError(error.message)
          reject(error) // Reject the promise on error
        },
        async () => {
          try {
            // Get the download URL after the upload completes
            const url = await getDownloadURL(uploadTask.snapshot.ref)
            // setDownloadURL(url)
            resolve(url) // Resolve the promise with the download URL
          } catch (error) {
            setServerError('Error uploading file')
            reject(error) // Reject the promise if getting the URL fails
          }
        }
      )
    })
  }

  const { data: packages, isFetching: isPackagesFetching } = useGetPackages({})
  const { data: coursesData, isFetching: isCoursesFetching } =
    useGetCoursesAdmin()

  const handleCreate = async () => {
    try {
      let course: CreateCourseRequest

      setLoading(true)
      if (courseType === 'pdf') {
        let url: string | undefined
        url = await handleUpload()
        if (!url) {
          url = downloadURL
        }
        if (!url) {
          setServerError('Please select a valid PDF file')
          return
        }
        course = {
          id: selectedCourse?._id,
          package: packages![selectedType]._id,
          videoID: null,
          title: courseTitle!,
          description: description!,
          pdf: url ?? '',
          published
        }
      } else {
        if (!videoID) {
          setServerError('Please enter a video ID')
          return
        }
        course = {
          id: selectedCourse?._id,
          package: packages![selectedType]._id,
          videoID: videoID!,
          title: courseTitle!,
          description: description!,
          pdf: null,
          published
        }
      }

      if (!!course?.id) {
        await updateCourse(course)
      } else {
        await mutateAsync(course)
      }
    } catch (error) {
      console.error(`Error uploading course: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const { mutateAsync } = useSaveCourse(
    () => {
      window.location.reload()
    },
    error => {
      if (!!error?.response?.data?.message) {
        if (typeof error?.response?.data.message === 'string') {
          setServerError(error?.response?.data.message)
        } else {
          setServerError('An unknown server error occured')
        }
      } else {
        setServerError('An unknown server error occured')
      }
    }
  )

  const { mutateAsync: updateCourse } = useUpdateCourse(
    () => {
      window.location.reload()
    },
    error => {
      if (!!error?.response?.data?.message) {
        if (typeof error?.response?.data.message === 'string') {
          setServerError(error?.response?.data.message)
        } else {
          setServerError('An unknown server error occured')
        }
      } else {
        setServerError('An unknown server error occured')
      }
    }
  )

  const { mutateAsync: deleteCourse } = useDeleteCourse(
    () => {
      setDeletingItem(undefined)
      window.location.reload()
    },
    error => {
      if (!!error?.response?.data?.message) {
        if (typeof error?.response?.data.message === 'string') {
          setServerError(error?.response?.data.message)
        } else {
          setServerError('An unknown server error occured')
        }
      } else {
        setServerError('An unknown server error occured')
      }
    }
  )

  useEffect(() => {
    setCourseType(
      selectedCourse?.video?.fileType ?? selectedCourse?.pdf?.fileType
    )
    setCourseTitle(selectedCourse?.video?.title ?? selectedCourse?.pdf?.title)
    if (selectedCourse?.video) {
      setVideoID(selectedCourse?.video.id)
    } else {
      setDownloadURL(selectedCourse?.pdf.link)
    }
    setDescripton(
      selectedCourse?.video?.description ?? selectedCourse?.pdf?.description
    )
    setPublished(!!selectedCourse?.published)
  }, [selectedCourse])

  return (
    <Sidebar>
      {(isPackagesFetching || isCoursesFetching) && (
        <div className='absolute inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm z-[9999] flex items-start pt-[30vh] justify-center'>
          <FadeLoader />
        </div>
      )}
      <div className='container lg:max-w-[1720px] mx-auto ml-12 mr-20 mt-8 grid grid-cols-11 gap-3 items-center justify-center'>
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
              {packages?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`${
                      selectedType === index ? 'button-primary' : 'button-dark'
                    } cursor-pointer py-4 px-6 relative`}
                    onClick={() => setSelectedType(index)}
                  >
                    <p className={`${gilroyBold.className} text-xs text-white`}>
                      {item.name}
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
                <div className='w-full rounded-lg bg-black bg-opacity-15'>
                  <Input
                    leftIcon={<DocumentText />}
                    placeholder='Course title'
                    value={courseTitle}
                    onChange={e => setCourseTitle(e.target.value)}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    options={[
                      {
                        label: 'Video',
                        value: 'video'
                      },
                      {
                        label: 'PDF',
                        value: 'pdf'
                      }
                    ]}
                    onChange={e => setCourseType(e.target.value)}
                    placeholder='Video/PDF'
                    value={courseType}
                    leftIcon={<ClipboardText />}
                  />
                  {/* <Input
                    leftIcon={<Stopwatch />}
                    placeholder='Duration'
                    value={durtion}
                    inputMode='numeric'
                    onChange={e => setDurtion(+e.target.value)}
                  /> */}
                  {courseType === 'pdf' ? (
                    <div>
                      <div className='w-full h-16 flex items-center'>
                        <input
                          type='file'
                          id='fileInput'
                          accept='application/pdf'
                          onChange={handleFileChange}
                          className='hidden'
                        />
                        {/* Custom button */}
                        <label
                          htmlFor='fileInput'
                          className='button-dark cursor-pointer flex items-center justify-center px-4 py-2 rounded-lg text-white'
                        >
                          {file ? 'Change File' : 'Select File'}
                        </label>
                      </div>

                      {file && (
                        <p className='text-sm trim overflow-hidden line-clamp-1'>
                          {file.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <Input
                      leftIcon={<Reels className='w-4' />}
                      placeholder='Video ID'
                      value={videoID}
                      onChange={e => setVideoID(e.target.value)}
                    />
                  )}
                </div>
                <div className='w-full h-28 rounded-lg bg-black bg-opacity-15'>
                  <textarea
                    className='w-full h-full text-input bg-transparent focus:outline-none px-5 py-3'
                    placeholder='Description'
                    value={description}
                    onChange={e => setDescripton(e.target.value)}
                  />
                </div>
                <div className='w-full flex gap-12 items-center ml-1'>
                  <div className='flex items-center gap-2'>
                    <input
                      className='radio-custom'
                      type='radio'
                      name='publishStatus'
                      checked={published}
                      onChange={() => setPublished(true)}
                    />
                    <label>Publish</label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <input
                      className='radio-custom'
                      type='radio'
                      name='publishStatus'
                      checked={!published}
                      onChange={() => setPublished(false)}
                    />
                    <label>Unpublish</label>
                  </div>
                </div>
              </div>
              <button
                className={`w-fit button-primary flex px-8 py-5 items-center gap-[10px] justify-center ${
                  loading && 'opacity-60'
                }`}
                onClick={handleCreate}
                disabled={loading}
              >
                <p className={`${gilroyBold.className} text-sm`}>Save & Add</p>
                {loading && <ClipLoader size={20} color='#fff' />}
              </button>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-8 col-span-11 lg:col-span-7 min-h-full'>
          <div className='w-full h-full p-8 rounded-3xl bg-grey-bg overflow-x-auto max-h-screen overflow-y-auto'>
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
            <table className='min-w-full h-full w-full table-auto mt-7'>
              <thead className='bg-neutral-CF bg-opacity-10 rounded-lg'>
                <tr>
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
                {coursesData?.length
                  ? coursesData
                      .filter(
                        item =>
                          !!packages &&
                          item?.package._id === packages[selectedType]._id
                      )
                      ?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                              <p
                                className={`${gilroyMedium.className} text-sm text-neutral-10`}
                              >
                                {item._id}
                              </p>
                            </td>

                            <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                              <p
                                className={`${gilroyMedium.className} text-sm text-neutral-10`}
                              >
                                {item?.video?.title ?? item?.pdf?.title ?? ''}
                              </p>
                            </td>
                            <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                              <p
                                className={`${gilroyMedium.className} text-sm text-neutral-10`}
                              >
                                {item?.video?.description ??
                                  item?.pdf?.description ??
                                  ''}
                              </p>
                            </td>
                            <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                              <p
                                className={`${gilroyMedium.className} text-sm text-neutral-10`}
                              >
                                {(item?.video?.fileType ?? item?.pdf?.fileType)
                                  .charAt(0)
                                  .toUpperCase() +
                                  (
                                    item?.video?.fileType ?? item?.pdf?.fileType
                                  ).slice(1)}
                              </p>
                            </td>

                            <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                              <p
                                className={`${gilroyMedium.className} text-sm text-neutral-10`}
                              >
                                {item?.video?.length
                                  ? `${Math.floor(
                                      item.video.length / (60 * 60)
                                    )}:${Math.round(item.video.length / 60)}`
                                  : 'N/A'}
                              </p>
                            </td>
                            <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis w-32'>
                              <div className='flex items-center gap-2'>
                                <div
                                  className={`w-6 h-6 rounded-md flex items-center justify-center`}
                                  style={{
                                    backgroundColor: item.published
                                      ? '#14A42B33'
                                      : '#D1416333'
                                  }}
                                >
                                  {item.published ? (
                                    <Completed className='w-3' />
                                  ) : (
                                    <Failed className='w-3' />
                                  )}
                                </div>
                                <p
                                  className={`${gilroyMedium.className} text-sm text-neutral-10`}
                                >
                                  {item?.published
                                    ? 'Published'
                                    : 'Unpublished'}
                                </p>
                              </div>
                            </td>
                            <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                              <div className='flex items-center gap-3'>
                                <div
                                  className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer bg-info hover:scale-125 transition-transform duration-500`}
                                  onClick={() => setSelectedCourse(item)}
                                >
                                  <EditSquare
                                    primaryColor='#ffffff'
                                    size={12}
                                  />
                                </div>
                                <div
                                  className={`w-6 h-6 rounded-md flex items-center bg-error bg-opacity-40 justify-center cursor-pointer hover:scale-125 transition-transform duration-500`}
                                  onClick={() => {
                                    setDeletingItem({
                                      id: item._id ?? '',
                                      title:
                                        item?.video?.title ?? item?.pdf?.title
                                    })
                                  }}
                                >
                                  <FaTrash
                                    className='w-[10px]'
                                    color='#E03A31'
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {!!serverError && (
        <Modal
          type='error'
          heading='Error creating course'
          body={serverError}
          onClose={() => setServerError(undefined)}
        />
      )}
      {!!deletingItem && (
        <Modal
          onConfirm={async () => await deleteCourse(deletingItem?.id)}
          type='error'
          heading='Confirm delete'
          body={`Are you sure you want to delete the course: ${deletingItem?.title}?`}
          onCancel={() => setDeletingItem(undefined)}
          confirmTxt='Yes, Delete'
        />
      )}
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
