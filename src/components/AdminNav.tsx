import React, { useState, useRef, useEffect } from 'react';
import Bell from '@/public/assets/icons/bell.svg';
import { gilroyBold, gilroyRegular } from '../pages';
import { useSession } from 'next-auth/react';
import { useGetNotifications, useMarkNotificationsRead } from '../hooks/useNotifications';

const AdminNav = () => {
  const session = useSession();
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Notifications fetching and updating
  const { data: notifications, refetch } = useGetNotifications(); // Fetch notifications
  const { mutate: markAsRead } = useMarkNotificationsRead(); // Update notifications as read

  // To track visibility and time spent on each notification
  const notificationRefs = useRef<(HTMLLIElement | null)[]>([]);
  const visibleNotifications = useRef<Set<number>>(new Set());
  const timers = useRef<{ [key: number]: NodeJS.Timeout }>({});

  // Toggle modal open/close
  const toggleModal = () => setModalOpen((prev) => !prev);

  // Close the modal when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Intersection observer for detecting visible notifications
  useEffect(() => {
    if (!isModalOpen || !notifications) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            if (!visibleNotifications.current.has(index)) {
              visibleNotifications.current.add(index);
              timers.current[index] = setTimeout(() => {
                const notification = notifications[index];
                if (!notification.read) {
                  markAsRead({ ids: [notification._id] }); // Mark notification as read
                  refetch(); // Refetch notifications
                }
              }, 5000); // 5 seconds timer
            }
          } else {
            visibleNotifications.current.delete(index);
            if (timers.current[index]) {
              clearTimeout(timers.current[index]);
              delete timers.current[index];
            }
          }
        });
      },
      { threshold: 0.5 } // Notification must be 50% visible
    );

    notificationRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      notificationRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, [isModalOpen, notifications, markAsRead, refetch]);

  return (
    <div className="lg:container lg:mx-auto fixed h-20 sm:h-[120px] pb-2 sm:pb-6 border-b-[1px] left-0 pl-20 right-2 md:left-[120px] md:pl-0 md:right-20 border-neutral-1A items-end flex z-40 bg-background">
      <div className="flex w-full items-center justify-between">
        {/* Welcome Message */}
        <div className="flex flex-col gap-1 sm:gap-2">
          <p
            className={`${gilroyRegular.className} text-white text-sm sm:text-base`}
          >
            Welcome
          </p>
          <p
            className={`${gilroyBold.className} text-lg sm:text-2xl text-white`}
          >
            {session.data?.user.name ?? 'gatna.io'}
          </p>
        </div>

        {/* Notification Bell */}
        <div className="flex w-fit items-center gap-2 sm:gap-[10px] relative">
          <div
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full items-center justify-center flex bg-grey-bg cursor-pointer"
            onClick={toggleModal}
          >
            <Bell className="w-4 sm:w-5" />
            {(notifications?.filter((notification) => !notification.read)
              ?.length ?? 0) > 0 && (
              <div className="absolute w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full flex items-center justify-center bg-primary-400 -top-[1px] -right-2">
                <p
                  className={`${gilroyBold.className} text-[7px] sm:text-[8px] text-white`}
                >
                  {notifications?.filter((notification) => !notification.read)
                    ?.length ?? 0}
                </p>
              </div>
            )}
          </div>

          {/* Notification Modal */}
          {isModalOpen && (
            <div
              ref={modalRef}
              className="absolute top-12 sm:top-16 right-0 sm:right-2 w-80 sm:w-96 bg-white shadow-lg h-fit max-h-80 sm:max-h-96 overflow-y-auto rounded-md p-4 z-50"
            >
              {(notifications?.length ?? 0) === 0 ? (
                <p
                  className={`${gilroyRegular.className} text-gray-500 text-sm`}
                >
                  No notifications
                </p>
              ) : (
                <ul className="space-y-4">
                  {notifications?.map((notification, index) => (
                    <li
                      key={index}
                      ref={(el) => { notificationRefs.current[index] = el; }}
                      data-index={index}
                      className="border-b border-neutral-700 pb-2 relative"
                    >
                      {!notification.read && (
                        <div className="absolute w-2 h-2 bg-primary-400 rounded-full right-2 top-1" /> /* Dot on the right */
                      )}
                      <p
                        className={`${gilroyBold.className} text-primary-500 text-sm`}
                      >
                        {notification?.title}
                      </p>
                      <p
                        className={`${gilroyRegular.className} text-neutral-500 text-xs`}
                      >
                        {notification?.body}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
