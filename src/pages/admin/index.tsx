import Sidebar from "@/src/components/Sidebar";
import React, { useEffect, useState } from "react";
import parsePhoneNumber from "libphonenumber-js";

import Users from "@/public/assets/icons/users.svg";
import AddUser from "@/public/assets/icons/add-user.svg";
import Airplay from "@/public/assets/icons/airplay.svg";
import CalenderDone from "@/public/assets/icons/calendar-done.svg";
import BankCard from "@/public/assets/icons/bank-card.svg";
import Plus from "@/public/assets/icons/plus.svg";
import DocumentVerified from "@/public/assets/icons/document-verified.svg";
import Filter from "@/public/assets/icons/filter.svg";
import Loading from "@/public/assets/icons/loading.svg";
import Completed from "@/public/assets/icons/complete.svg";
import Failed from "@/public/assets/icons/failed.svg";
// import Copy from '@/public/assets/icons/copy.svg'

import { gilroyBold, gilroyMedium } from "@/src/pages/index";
import AdminInfoCard from "@/src/components/AdminInfoCard";
import { ChevronDown, ChevronUp, EditSquare } from "react-iconly";
import moment from "moment";
import CircularProgressBar from "@/src/components/CircularProgressBar";
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { useGetStats } from "@/src/hooks/stats";
import { Transaction, useGetTransactions } from "@/src/hooks/transactions";
import { FaSave } from "react-icons/fa";
import { CreateUserModal, Modal } from "@/src/components";
import { useDeleteUser, useUpdateUser } from "@/src/hooks/user";
import { FaTrash } from "react-icons/fa";
import { useGetPackages } from "@/src/hooks/package";

const colors = {
  high: {
    stroke: "#ED4D4D",
    background: "#ED4D4D30",
  },
  medium: {
    stroke: "#D89A00",
    background: "#D89A0030",
  },
  low: {
    stroke: "#00890E",
    background: "#00890E30",
  },
};

const initialStats = [
  {
    title: "Total users.",
    quantity: 0,
    icon: <Users className="w-10" />,
  },
  {
    title: "Total subscribers.",
    quantity: 0,
    icon: <AddUser className="w-10" />,
  },
  {
    title: "Total videos.",
    quantity: 0,
    icon: <Airplay className="w-10" />,
  },
  {
    title: "Pending requests.",
    quantity: 0,
    icon: <CalenderDone className="w-10" />,
  },
  {
    title: "Total sales",
    quantity: `$${0}`,
    icon: <BankCard className="w-10" />,
  },
];

function Index() {
  const [isEditing, setIsEditing] = useState<string>();
  const [confirmSave, setConfirmSave] = useState(false);
  const [discardSave, setDiscardSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [countryCode, setCountryCode] = useState<string>();
  const [number, setNumber] = useState<string>();
  const [phoneNumberString, setPhoneNumberString] = useState<string>();
  const [deletingItem, setDeletingItem] = useState<{
    _id: string;
    email: string;
  }>();

  const [stats, setStats] = useState<
    {
      title: string;
      quantity: number | string;
      icon: React.JSX.Element;
    }[]
  >(initialStats);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [filter, setFilter] = useState<string>();
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  function calculateProgress(
    startDate: string,
    endDate: string | null | undefined
  ): number {
    if (!endDate) return 0;

    const start = new Date(startDate); // e.g. '2024-10-18'
    const end = new Date(endDate); // e.g. '2024-10-22'
    const today = new Date();

    // If the current date is after the end date, return 100%
    if (today >= end) {
      return 100;
    }

    // Calculate the total number of days between the start and end date
    const totalTime = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    // Calculate the number of days passed since the start date
    const timePassed =
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    // Calculate the percentage of time passed
    const percentage = (timePassed / totalTime) * 100;

    // Ensure percentage does not go below 0% or above 100%, and return it as a number
    return parseFloat(Math.min(Math.max(percentage, 0), 100).toFixed(2));
  }

  const { data: adminStats, isFetched } = useGetStats();

  const { data: transactions, refetch } = useGetTransactions();

  const { data: packages } = useGetPackages({});

  useEffect(() => {
    if (adminStats && isFetched) {
      const sales =
        (adminStats?.sales ?? 0) > 1000
          ? `${((adminStats?.sales ?? 0) / 1000).toFixed(2)}k`
          : `${adminStats.sales ?? 0}`;

      setStats([
        {
          title: "Total users.",
          quantity: adminStats?.users ?? 0,
          icon: <Users className="w-10" />,
        },
        {
          title: "Total subscribers.",
          quantity: adminStats?.subscribers ?? 0,
          icon: <AddUser className="w-10" />,
        },
        {
          title: "Total videos.",
          quantity: adminStats?.videos ?? 0,
          icon: <Airplay className="w-10" />,
        },
        {
          title: "Pending requests.",
          quantity: adminStats?.pendingRequests ?? 0,
          icon: <CalenderDone className="w-10" />,
        },
        {
          title: "Total sales",
          quantity: `$${sales}`,
          icon: <BankCard className="w-10" />,
        },
      ]);
    }
  }, [isFetched, adminStats]);

  useEffect(() => {
    if (!filter) {
      setFilteredTransactions(transactions ?? []);
    } else {
      const lowercasedValue = filter.toLowerCase();
      const filtered =
        transactions?.filter(({ user }) => {
          const searchableObject = user;
          delete searchableObject.referredBy;
          return Object.values(searchableObject).some((field) => {
            return (
              typeof field === "string" &&
              field.toLowerCase().includes(lowercasedValue)
            );
          });
        }) ?? [];

      setFilteredTransactions(filtered);
    }
  }, [filter, transactions]);

  const { mutateAsync } = useUpdateUser(
    async () => {
      await refetch();
    },
    (error) => {
      if (!!error?.response?.data?.message) {
        if (typeof error?.response?.data.message === "string") {
          setError(error?.response?.data.message);
        } else if (typeof error?.response?.data.message?.message === "string") {
          setError(error?.response?.data.message?.message);
        } else if (
          typeof error?.response?.data?.message?.errorResponse?.errmsg ==
          "string"
        ) {
          setError(error?.response?.data?.message?.errorResponse?.errmsg);
        } else {
          setError("An unknown server error occured");
        }
      } else {
        setError("An unknown server error occured");
      }
    }
  );

  const { mutateAsync: deleteUser } = useDeleteUser(
    async () => {
      await refetch();
    },
    (error) => {
      if (!!error?.response?.data?.message) {
        if (typeof error?.response?.data.message === "string") {
          setError(error?.response?.data.message);
        } else if (typeof error?.response?.data.message?.message === "string") {
          setError(error?.response?.data.message?.message);
        } else if (
          typeof error?.response?.data?.message?.errorResponse?.errmsg ==
          "string"
        ) {
          setError(error?.response?.data?.message?.errorResponse?.errmsg);
        } else {
          setError("An unknown server error occured");
        }
      } else {
        setError("An unknown server error occured");
      }
    }
  );

  const handleUpdateUser = async () => {
    try {
      setIsLoading(true);
      await mutateAsync({
        _id: isEditing!,
        firstName: firstName!,
        email: email!,
        lastName: lastName!,
        countryCode: `+${countryCode}`,
        phoneNumber: number!,
      });
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
      setIsEditing(undefined);
      setConfirmSave(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      await deleteUser(deletingItem?._id ?? "");
    } catch (error) {
      console.error({ error });
    } finally {
      setIsLoading(false);
      setDeletingItem(undefined);
    }
  };

  useEffect(() => {
    if (phoneNumberString) {
      const parsedPhoneNumber = parsePhoneNumber(phoneNumberString);
      setCountryCode(parsedPhoneNumber?.countryCallingCode);
      setNumber(parsedPhoneNumber?.nationalNumber);
    }
  }, [phoneNumberString]);

  return (
    <Sidebar>
      <div className="ml-12 mr-20 mt-8 flex flex-col gap-8">
        <div className="grid mx-auto md:mx-0 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center gap-8">
          {stats.map((card, index) => {
            return <AdminInfoCard item={card} key={card.title} index={index} />;
          })}
        </div>
        <div className="w-full p-8 rounded-3xl bg-grey-bg overflow-x-auto">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <DocumentVerified className="w-[52px]" />
              <p className={`${gilroyBold.className} text-2xl text-white`}>
                Users list
              </p>
            </div>
            {/* <div className='flex px-3 py-4 items-center gap-4 bg-neutral-C4 bg-opacity-10 rounded-[10px]'>
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
            </div> */}
            <div className="flex items-center justify-between w-52 px-5 py-4 bg-neutral-C4 bg-opacity-10 rounded-[10px]">
              <input
                className={`focus:ring-0 text-input focus:outline-none text-neutral-10 bg-transparent w-full ${gilroyMedium.className}`}
                placeholder="Search"
                onChange={(e) => setFilter(e.target.value)}
              />
              <div className="flex-shrink-0 w-5">
                <Filter className="w-full" />
              </div>
            </div>
            <div
              className="button-primary px-4 py-3 gap-4"
              onClick={() => setShowCreateUserModal(true)}
            >
              <Plus className={"w-5"} />
              <p className={`${gilroyBold.className} text-sm text-white`}>
                Add new
              </p>
            </div>
          </div>
          <table className="min-w-full w-full table-auto mt-7">
            <thead className="bg-neutral-CF bg-opacity-10 rounded-lg">
              <tr>
                <th className="text-left px-3 py-5 whitespace-nowrap rounded-l-lg">
                  <div className="flex gap-1 items-center">
                    <p
                      className={`${gilroyBold.className} text-sm text-neutral-50`}
                    >
                      SL
                    </p>
                  </div>
                </th>
                <th className="text-left px-3 py-5 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <p
                      className={`${gilroyBold.className} text-sm text-neutral-50`}
                    >
                      Referral Code
                    </p>
                  </div>
                </th>
                <th className="text-left px-3 py-5 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <div className="h-6 items-center gap-0 my-auto">
                      <ChevronUp
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ChevronDown
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
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
                <th className="text-left px-3 py-5 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <div className="h-6 items-center gap-0 my-auto">
                      <ChevronUp
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ChevronDown
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
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
                <th className="text-left px-3 py-5 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <div className="h-6 items-center gap-0 my-auto">
                      <ChevronUp
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ChevronDown
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
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
                <th className="text-left px-3 py-5 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <div className="h-6 items-center gap-0 my-auto">
                      <ChevronUp
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ChevronDown
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
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
                <th className="text-left px-3 py-5 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <div className="h-6 items-center gap-0 my-auto">
                      <ChevronUp
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ChevronDown
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <p
                      className={`${gilroyBold.className} text-sm text-neutral-50`}
                    >
                      Phone number
                    </p>
                  </div>
                </th>
                <th className="text-left px-3 py-5 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <div className="h-6 items-center gap-0 my-auto">
                      <ChevronUp
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ChevronDown
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <p
                      className={`${gilroyBold.className} text-sm text-neutral-50`}
                    >
                      Package
                    </p>
                  </div>
                </th>
                <th className="text-left px-3 py-5 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <div className="h-6 items-center gap-0 my-auto">
                      <ChevronUp
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ChevronDown
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
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
                <th className="text-left px-3 py-5 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <div className="h-6 items-center gap-0 my-auto">
                      <ChevronUp
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ChevronDown
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
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
                <th className="text-left px-3 py-5 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <div className="h-6 items-center gap-0 my-auto">
                      <ChevronUp
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ChevronDown
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
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
                <th className="text-left px-3 py-5 whitespace-nowrap">
                  <div className="flex gap-1 items-center">
                    <div className="h-6 items-center gap-0 my-auto">
                      <ChevronUp
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ChevronDown
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
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
                <th className="text-left px-3 py-5 whitespace-nowrap rounded-r-lg">
                  <div className="flex gap-1 items-center">
                    <div className="h-6 items-center gap-0 my-auto">
                      <ChevronUp
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <ChevronDown
                        size={12}
                        primaryColor="#606060"
                        style={{
                          cursor: "pointer",
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
              {filteredTransactions?.map((item, index) => {
                const progress = calculateProgress(
                  item?.updatedAt,
                  item?.expiryDate
                );
                return (
                  <tr key={index}>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
                      <input className="checkbox-custom" type="checkbox" />
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item?.user?.referalCode}
                      </p>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {moment(item?.updatedAt).format("DD-MM-YYYY")}
                      </p>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis relative max-w-28">
                      <div>
                        {isEditing === item?.user?._id ? (
                          <input
                            className="bg-transparent border focus:outline-none max-w-24 rounded-md border-grey-bg"
                            // defaultValue={item?.user?.firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                          />
                        ) : (
                          <p
                            className={`${gilroyMedium.className} text-sm text-neutral-10`}
                          >
                            {item?.user?.firstName}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
                      <div>
                        {isEditing === item?.user?._id ? (
                          <input
                            className="bg-transparent border focus:outline-none max-w-24 rounded-md border-grey-bg"
                            // defaultValue={item?.user?.lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                          />
                        ) : (
                          <p
                            className={`${gilroyMedium.className} text-sm text-neutral-10`}
                          >
                            {item?.user?.lastName}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
                      <div>
                        {isEditing === item?.user?._id ? (
                          <input
                            className="bg-transparent border focus:outline-none max-w-24 rounded-md border-grey-bg"
                            // defaultValue={item?.user?.email}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                        ) : (
                          <p
                            className={`${gilroyMedium.className} text-sm text-neutral-10`}
                          >
                            {item?.user?.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
                      <div>
                        {isEditing === item?.user?._id ? (
                          <input
                            className="bg-transparent border focus:outline-none max-w-24 rounded-md border-grey-bg"
                            // defaultValue={item?.user?.email}
                            onChange={(e) =>
                              setPhoneNumberString(e.target.value)
                            }
                            value={phoneNumberString}
                          />
                        ) : (
                          <p
                            className={`${gilroyMedium.className} text-sm text-neutral-10`}
                          >
                            {item?.user?.countryCode}
                            {item?.user?.phoneNumber}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item?.package?.name?.charAt(0).toUpperCase() +
                          item?.package?.name?.slice(1)}
                      </p>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {item.amount}
                      </p>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
                      <p
                        className={`${gilroyMedium.className} text-sm text-neutral-10`}
                      >
                        {`Crypto`}
                      </p>
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
                      <div className="flex items-center justify-between">
                        <p
                          className={`${gilroyMedium.className} text-sm text-neutral-10`}
                        >
                          {item?.expiryDate
                            ? moment(item?.expiryDate).format("DD-MM-YYYY")
                            : "N/A"}
                        </p>
                        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                          <CircularProgressBar
                            radius={14}
                            strokeWidth={3}
                            percentage={progress}
                            pathColor="#FFFFFF33"
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
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28 underline text-success cursor-pointer">
                      {item.transactionId}
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap overflow-hidden text-ellipsis max-w-28">
                      <div className="flex items-center gap-3">
                        {isEditing !== item?.user?._id && (
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center`}
                            style={{
                              backgroundColor:
                                item.status === "pending"
                                  ? "#E8B04433"
                                  : item.status === "completed"
                                  ? "#14A42B33"
                                  : "#D1416333",
                            }}
                          >
                            {item.status === "pending" ? (
                              <Loading className="w-3" />
                            ) : item.status === "completed" ? (
                              <Completed className="w-3" />
                            ) : (
                              <Failed className="w-3" />
                            )}
                          </div>
                        )}
                        {isEditing === item?.user?._id && (
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer bg-error bg-opacity-40 hover:scale-125 transition-transform duration-500`}
                            onClick={() => setDiscardSave(true)}
                          >
                            <Failed className="w-3" />
                          </div>
                        )}
                        {isEditing === item?.user?._id && (
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer bg-[#14A42B33] hover:scale-125 transition-transform duration-500`}
                            onClick={() => setConfirmSave(true)}
                          >
                            <FaSave color="#14A42B" size={12} />
                          </div>
                        )}
                        {isEditing !== item?.user?._id && (
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer bg-info hover:scale-125 transition-transform duration-500`}
                            onClick={() => {
                              setIsEditing(item.user?._id);
                              setFirstName(item.user?.firstName);
                              setLastName(item?.user?.lastName);
                              setEmail(item?.user?.email);
                              setPhoneNumberString(
                                item?.user?.countryCode +
                                  item?.user?.phoneNumber
                              );
                            }}
                          >
                            <EditSquare primaryColor="#ffffff" size={12} />
                          </div>
                        )}
                        <div
                          className={`w-6 h-6 rounded-md flex items-center bg-error bg-opacity-40 justify-center cursor-pointer hover:scale-125 transition-transform duration-500`}
                          onClick={() => {
                            setDeletingItem({
                              _id: item.user?._id ?? "",
                              email: item.user?.email,
                            });
                          }}
                        >
                          <FaTrash className="w-[10px]" color="#E03A31" />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {confirmSave && (
        <Modal
          type="info"
          heading="Confirm save"
          body="Are you sure you want to save these changes?"
          confirmTxt="Yes"
          cancelTxt="No, Cancel"
          isLoading={isLoading}
          onConfirm={handleUpdateUser}
          onCancel={() => {
            setConfirmSave(false);
          }}
        />
      )}
      {discardSave && (
        <Modal
          type="error"
          heading="Discard changes"
          body="Are you sure you want to discard these changes?"
          confirmTxt="Yes, Discard"
          cancelTxt="Continue editing"
          onConfirm={() => {
            setIsEditing(undefined);
            setDiscardSave(false);
          }}
          onCancel={() => {
            setDiscardSave(false);
          }}
        />
      )}
      {deletingItem && (
        <Modal
          type="error"
          heading="Confirm delete user"
          body={`Are you sure you want to delete the user with email ${deletingItem.email}`}
          onConfirm={handleDeleteUser}
          isLoading={isLoading}
          onCancel={() => setDeletingItem(undefined)}
        />
      )}
      {error && (
        <Modal
          type="error"
          heading="Error updating user"
          body={error}
          onClose={() => setError(undefined)}
        />
      )}
      <CreateUserModal
        visible={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        packages={packages}
      />
    </Sidebar>
  );
}

export default Index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  console.log({ session }, "in admin page");
  // Check if the user is authenticated
  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  // Check if the user has the admin role
  if (session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/403",
        permanent: false,
      },
    };
  }

  // If the user is an admin, proceed to render the page
  return {
    props: { session },
  };
}
