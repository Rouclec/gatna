import Sidebar from '@/src/components/Sidebar'
import { gilroyBold, gilroyRegular } from '..'
import CourseCard from '@/src/components/CourseCard'
import { useEffect, useState } from 'react'
import Pagination from '@/src/components/Pagination'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { useGetUserCourses } from '@/src/hooks/course'
import { FadeLoader } from 'react-spinners'
import { useGetVideoPlaybackInfo } from '@/src/hooks/video'
import { Course } from '@/src/interfaces'

const PAGE_SIZE = 4

function Home () {
  const [courses, setCourses] = useState<Course[]>()
  const [viewingCourses, setViewingCourses] = useState<Course[]>()
  const [selectedCourse, setSelectedCourse] = useState<Course>()
  const [totalPages, setTotalPages] = useState(1)

  const { data, isFetched } = useGetUserCourses()

  const handlePageChange = (page: number = 1) => {
    const startIndex = (page - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    setViewingCourses(courses?.slice(startIndex, endIndex))
    if (!!viewingCourses) setSelectedCourse(viewingCourses[0])
  }

  useEffect(() => {
    if (isFetched) {
      const sortedData = data
        ?.filter(course => course.package && course.package.name) // Ensure package and name exist
        .sort((a, b) => {
          const nameA = a.package.name || ''
          const nameB = b.package.name || ''

          // Extract the numeric part after "Gatna" and compare
          const numA = parseInt(nameA.replace(/\D/g, ''), 10) || 0
          const numB = parseInt(nameB.replace(/\D/g, ''), 10) || 0

          return numA - numB
        })

      const coursesData = Array.from(
        new Map(
          sortedData
            ?.map(course => {
              const file = course.video || course.pdf // Extract either video or pdf

              if (!file) return null // Skip if neither video nor pdf exists

              return {
                package: course.package,
                ...file
              }
            })
            .filter(item => item !== null) // Filter out null values
            .map(item => [item.id, item]) // Create unique entries based on id
        ).values()
      )

      setCourses(coursesData)
      setViewingCourses(coursesData?.slice(0, 0 + PAGE_SIZE))

      if (coursesData.length > 0) setSelectedCourse(coursesData[0])

      const totalItems = coursesData.length
      setTotalPages(Math.ceil(totalItems / PAGE_SIZE))
    }
  }, [data, isFetched])

  const { data: videoPlayBackInfo } = useGetVideoPlaybackInfo(
    selectedCourse?.id as string
  )

  return (
    <Sidebar>
      <div className='mx-6 lg:ml-10 lg:mr-28 overflow-x-hidden overflow-y-hidden'>
        {!isFetched ? (
          <div className='absolute inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm z-[9999] flex items-start pt-[30vh] justify-center'>
            <FadeLoader />
          </div>
        ) : (
          <main className='pb-5 sm:pb-20 flex flex-col gap-7'>
            <div>
              <p className={`${gilroyBold.className} text-2xl sm:text-4xl`}>
                Welcome back!
              </p>
              <p className={`${gilroyRegular.className} text-grey-60`}>
                Continue where you left off!
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-[350px_1fr] gap-10'>
              <div className='grid min-h-[50vh] gap-2 order-2 md:order-1'>
                {viewingCourses?.map((course, index) => (
                  <CourseCard
                    course={course}
                    index={index + 1}
                    key={index}
                    onClick={() => setSelectedCourse(course)}
                    isSelected={selectedCourse?.title === course.title}
                  />
                ))}
              </div>
              {selectedCourse && (
                <div className='flex flex-col gap-3 order-1 md:order-2'>
                  <div className='w-full h-64 sm:h-96 md:h-full'>
                    {!selectedCourse?.link ? (
                      <iframe
                        src={`https://player.vdocipher.com/v2/?otp=${videoPlayBackInfo?.otp}&playbackInfo=${videoPlayBackInfo?.playbackInfo}`}
                        style={{
                          border: 0,
                          borderRadius: 32,
                          width: '100%',
                          height: '100%'
                        }}
                        allow='encrypted-media'
                        allowFullScreen
                      />
                    ) : (
                      // <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'>
                      //   <Viewer fileUrl={selectedCourse.link} />
                      // </Worker>
                      // <></>
                      <iframe
                        src={selectedCourse.link}
                        width={'100%'}
                        height={'100%'}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className={`${gilroyBold.className} text-4xl text-ellipsis overflow-hidden line-clamp-1`}
                    >
                      {((courses ?? []).indexOf(selectedCourse) + 1)
                        .toString()
                        .padStart(2, '0')}
                      . {selectedCourse.title}
                    </p>
                    <p
                      className={`${gilroyRegular.className} text-ellipsis overflow-hidden line-clamp-1 text-neutral-CC`}
                    >
                      {selectedCourse.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className='grid grid-cols-[350px_1fr] gap-10'>
              <Pagination
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </main>
        )}
      </div>
    </Sidebar>
  )
}

export default Home

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

  // If there is a user
  return {
    props: { session }
  }
}
