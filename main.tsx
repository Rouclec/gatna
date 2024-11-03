;<main className='grid mt-[104px] px-40 pt-[136px]'>
  <div className='grid grid-cols-2 gap-8 relative'>
    <div className='pt-8'>
      <div className='grid gap-9'>
        <p className='font-readex font-bold text-6xl'>
          Formation crypto avec gantna.io
        </p>
        <p className={`${gilroyRegular.className} text-2xl`}>
          {`Achetez vos formations crypto et obtenez un nombre de pièces en
                staking pouvant vous générer jusqu’a 20% de ROI.`}
        </p>
        <div className='flex gap-[18px]'>
          <div className='flex h-[70px] w-full items-center justify-center bg-gradient rounded-[10px]'>
            <p className={`${gilroyBold.className} text-base text-neutral-10`}>
              Acheter ma formation
            </p>
          </div>
          <div className='flex h-[70px] w-full items-center justify-center bg-neutral-24 rounded-[10px]'>
            <p
              className={`${gilroyBold.className} text-base text-neutral-10`}
            >{`J’ai deja un compte`}</p>
          </div>
        </div>
        <div className='relative flex mt-6 gap-7 items-center w-full'>
          <SpiralArrow className='w-[400px] h-[180px] absolute -left-[300px] -bottom-[32px]' />
          <div className='flex items-center justify-center relative px-4'>
            {profiles.map((profile, index) => {
              const zIndex = 4 * index // Z-index for layering

              return (
                <div
                  key={index}
                  className={`w-14 h-14 items-center justify-center rounded-full bg-gradient z-[${zIndex}] flex -ml-7`}
                >
                  {profile.icon}
                </div>
              )
            })}
          </div>

          <p className={`w-[245px] ${gilroyMedium.className} text-neutral-10`}>
            Plus de <span className={`${gilroyBold.className}`}>120</span>{' '}
            utilisateurs abonnés suivent nos formations
          </p>
        </div>
      </div>
    </div>
    <div className='items-center justify-center my-4 relative'>
      <div className='items-center justify-center realtive'>
        <div className='pl-8 absolute'>
          <Image
            src={landingimage}
            alt='landing-image'
            className='w-[556px] h-[432px] z-10'
          />
        </div>
      </div>
    </div>
  </div>
  <div>
    {courses.map(({ course }, index) => {
      return (
        <div key={course.id}>
          <CourseDetails
            course={course}
            inverted={index % 2 !== 0}
            pinColor={colors[index % 5]}
          />
        </div>
      )
    })}
  </div>
  <div className='flex flex-col gap-14 h-screen justify-center'>
    <div className='grid grid-cols-7 gap-[72px] relative'>
      <div className='col-span-3'>
        <p className={`${gilroyBlack.className} text-[40px] leading-[50px]`}>
          Contactez-nous
        </p>
        <p className={`${gilroyRegular.className} text-xl`}>
          Nous sommes disponible sur ces canaux
        </p>
      </div>
      <div className='col-span-4 whitespace-nowrap overflow-hidden text-clip'>
        <p
          className={`${gilroyHeavy.className} text-[200px] absolute leading-[225px] -top-10 overflow-hidden opacity-[2%]`}
        >
          Ecrivez nous
        </p>
      </div>
    </div>
    <div className='grid grid-cols-7 gap-[72px]'>
      <div className='col-span-3 grid gap-12'>
        <div className='grid grid-cols-2 gap-6'>
          <div className='h-[190px] bg-grey-bg rounded-3xl flex flex-col p-[18px] justify-between'>
            <div className='flex gap-[6px] items-center'>
              <div className='w-[44px] h-[44px] rounded-xl bg-neutral-10 items-center justify-center flex'>
                <Telegram className='w-6 h-6' />
              </div>
              <div>
                <p className={`${gilroyBold.className} text-base`}>Telegram</p>
                <p className={`${gilroyRegular.className} text-sm`}>
                  +971 50 829 1203
                </p>
              </div>
            </div>
            <div className='h-12 items-center justify-center flex rounded-lg bg-telegram'>
              <p className={`${gilroySemiBold.className} text-sm`}>Chat us</p>
            </div>
          </div>
          <div className='h-[190px] bg-grey-bg rounded-3xl flex flex-col p-[18px] justify-between'>
            <div className='flex gap-[6px] items-center'>
              <div className='w-[44px] h-[44px] rounded-xl bg-neutral-10 items-center justify-center flex'>
                <WhatsApp className='w-6 h-6' stroke='#14A42B' />
              </div>
              <div>
                <p className={`${gilroyBold.className} text-base`}>WhatsApp</p>
                <p className={`${gilroyRegular.className} text-sm`}>
                  +971 50 829 1203
                </p>
              </div>
            </div>
            <div className='h-12 items-center justify-center flex rounded-lg bg-whatsapp'>
              <p className={`${gilroySemiBold.className} text-sm`}>Chat us</p>
            </div>
          </div>
        </div>
        <MapProvider>
          <MapComponent />
        </MapProvider>
      </div>
      <div className='col-span-4'>
        <p>Second section</p>
      </div>
    </div>
  </div>
</main>


