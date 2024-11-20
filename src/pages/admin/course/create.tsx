import Sidebar from '@/src/components/Sidebar'
import React, { ChangeEvent, FC, useState } from 'react'

import DocumentVerified from '@/public/assets/icons/document-verified.svg'
import Filter from '@/public/assets/icons/filter.svg'
import Completed from '@/public/assets/icons/complete.svg'
// import Failed from '@/public/assets/icons/failed.svg'

import { gilroyBold, gilroyMedium, gilroyRegular } from '@/src/pages/index'
import { ChevronDown, ChevronUp, EditSquare } from 'react-iconly'
import CheckMark from '@/public/assets/icons/checkmark.svg'
import ClipboardText from '@/public/assets/icons/clipboard-text.svg'
import DocumentText from '@/public/assets/icons/document-text.svg'
import Reels from '@/public/assets/icons/reels.svg'
// import Stopwatch from '@/public/assets/icons/stopwatch.svg'
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import { useGetCategories } from '@/src/hooks/category'
import {
  CreateCourseRequest,
  useGetCourses,
  useSaveCourse
} from '@/src/hooks/course'
import { storage } from '@/src/util/firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { ClipLoader, FadeLoader } from 'react-spinners'

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
  // const [durtion, setDurtion] = useState<number>()
  const [courseTitle, setCourseTitle] = useState<string>()
  const [videoID, setVideoID] = useState<string>()
  const [description, setDescripton] = useState<string>()

  const [file, setFile] = useState<File | null>(null)
  // const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!file) return

    // Create a storage reference
    const storageRef = ref(storage, `uploads/${file.name}`)

    // Start the file upload
    const uploadTask = uploadBytesResumable(storageRef, file)

    // Monitor upload progress
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(`Upload is ${progress}% done`)
      },
      error => {
        console.error('Upload failed:', error)
      },
      async () => {
        // Get the download URL after the upload completes
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        setDownloadURL(url)
      }
    )
  }

  const { data: categories, isFetching: isCategoriesFetching } =
    useGetCategories({})
  const { data: coursesData, isFetching: isCoursesFetching } = useGetCourses()

  const handleCreate = async () => {
    try {
      setLoading(true)
      if (courseType === 'pdf') {
        handleUpload()
        const course: CreateCourseRequest = {
          category: categories![selectedType]._id,
          videoID: null,
          title: courseTitle!,
          description: description!,
          pdf: downloadURL
        }
        mutate(course)
      } else {
        const course: CreateCourseRequest = {
          category: categories![selectedType]._id,
          videoID: videoID!,
          title: courseTitle!,
          description: description!,
          pdf: null
        }
        mutate(course)
      }
    } catch (error) {
      console.error(`Error uploading course: ${error}`)
      alert(`Error uploading course: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const { mutate } = useSaveCourse()

  return (
    <Sidebar>
      {(isCategoriesFetching || isCoursesFetching) && (
        <div className='absolute inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm z-[9999] flex items-start pt-[30vh] justify-center'>
          <FadeLoader />
        </div>
      )}
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
              {categories?.map((item, index) => {
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
                    className='w-full h-full bg-transparent focus:outline-none px-5 py-3'
                    placeholder='Description'
                    value={description}
                    onChange={e => setDescripton(e.target.value)}
                  />
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
                {coursesData
                  ?.flatMap(course => [
                    ...(course.videos ?? []),
                    ...(course.pdfs ?? [])
                  ])
                  ?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                          <input className='checkbox-custom' type='checkbox' />
                        </td>
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
                            {item.title}
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
                            {item.fileType.charAt(0).toUpperCase() +
                              item.fileType.slice(1)}
                          </p>
                        </td>

                        <td className='px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28'>
                          <p
                            className={`${gilroyMedium.className} text-sm text-neutral-10`}
                          >
                            {item?.length
                              ? `${Math.floor(item.length / (60 * 60))}:${
                                  item.length % (60)
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
                                  // item.status === 'completed'
                                  //   ?
                                  '#14A42B33'
                                // : '#D1416333'
                              }}
                            >
                              {/* {item.status === 'completed' ? ( */}
                              <Completed className='w-3' />
                              {/* ) : (
                                <Failed className='w-3' />
                              )} */}
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
