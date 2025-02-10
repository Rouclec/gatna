import React, { FC, useState } from "react";
import { gilroyBold, gilroyRegular } from "../pages";
import { ChevronDown, Login, Message } from "react-iconly";
import { ClipLoader } from "react-spinners";
import { Package } from "../hooks/package";
import { useAssignCourseToUser } from "../hooks/user";
import Modal from "./Modal";

interface Props {
  visible: boolean;
  onClose: () => void;
  packages: Package[] | undefined;
}

export const CreateUserModal: FC<Props> = ({ visible, onClose, packages }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [packageId, setPackageId] = useState<string>();
  const [serverError, setServerError] = useState<string>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      if (!email || !packageId) {
        setServerError("Please enter an email and select a package");
      } else {
        await mutateAsync({ email, packageId });
      }
    } catch (error) {
      console.error(`Error assigning course to user: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const { mutateAsync } = useAssignCourseToUser(
    () => {
      setShowSuccessModal(true);
    },
    (error) => {
      console.log(error);
      if (!!error?.response?.data?.message) {
        if (typeof error?.response?.data.message === "string") {
          setServerError(error?.response?.data.message);
        } else if (typeof error?.response?.data.message?.message === "string") {
          setServerError(error?.response?.data.message?.message);
        } else if (
          typeof error?.response?.data?.message?.errorResponse?.errmsg ==
          "string"
        ) {
          setServerError(error?.response?.data?.message?.errorResponse?.errmsg);
        } else {
          setServerError("An unknown server error occured");
        }
      } else {
        setServerError("An unknown server error occured");
      }
    }
  );
  return (
    <div
      className={`fixed inset-0 bg-black/30 backdrop-blur-lg z-40 flex items-center justify-center ${
        !visible && "hidden"
      }`}
      onClick={() => {
        onClose();
        setEmail("");
        setPackageId("");
      }}
    >
      <div
        className="w-[520px] p-9 flex flex-col bg-dark-0 rounded-[40px] gap-10"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleAdd}>
          <div className="flex flex-col gap-6 items-center justify-center">
            <div className="grid gap-2">
              <p className="font-readex text-center font-bold text-3xl sm:text-4xl text-neutral-10">
                Add user
              </p>
              <p
                className={`${gilroyRegular.className} text-lg text-center text-neutral-B2`}
              >
                Add a user and assign a course to them.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-3 w-full">
              <div className="flex flex-col gap-6">
                <div className="relative flex items-center">
                  {/* email input  */}
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-[60px] w-full text-input bg-neutral-1A bg-opacity-40 text-neutral-10 rounded-xl px-4 pl-20 placeholder:${gilroyRegular.className} placeholder:text-base placeholder:text-neutral-B2`}
                    required
                  />
                  <div className="flex items-center gap-2 absolute left-6 self-center">
                    <Message primaryColor="#FFFFFF33" />
                    <div className="w-[6px] h-[6px] rounded-full bg-grey-60 opacity-10" />
                  </div>
                </div>

                {/* package selection dropdown  */}
                <div className="relative w-full">
                  <select
                    className="h-[60px] w-full text-input bg-neutral-1A bg-opacity-40 text-neutral-10 rounded-xl px-4 pl-20 pr-12 placeholder:${gilroyRegular.className} placeholder:text-base placeholder:text-neutral-B2 appearance-none"
                    onChange={(e) => setPackageId(e.target.value)}
                    value={packageId}
                    defaultValue={""}
                  >
                    <option
                      value=""
                      className="text-opacity-50 text-xs mt-24"
                      disabled
                    >
                      Select a package
                    </option>
                    {packages?.map((item, index) => (
                      <option value={item?._id} key={index}>
                        {item?.name}
                      </option>
                    ))}
                  </select>

                  {/* Custom Chevron */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* {error && <p className='text-red-500 mt-2'>{error}</p>} */}
          <button
            type="submit"
            className={`bg-gradient px-8 py-5 mt-16 mx-auto w-fit rounded-[10px] cursor-pointer flex gap-[10px] items-center ${
              (loading || !email || !packageId) && "opacity-60"
            }`}
            disabled={loading || !email || !packageId}
            onClick={handleAdd}
          >
            <p className={`${gilroyBold.className} text-lg`}>Assign</p>
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              <Login primaryColor="#FFFFFF66" />
            )}
          </button>
        </form>
        {!!serverError && (
          <div>
            <Modal
              type="error"
              heading="Error assigning course to user"
              body={serverError}
              onClose={() => setServerError(undefined)}
            />
          </div>
        )}
        {!!showSuccessModal && (
          <div>
            <Modal
              type="success"
              heading={"Packge Assigned"}
              body={`Packge <strong>${
                packages?.find((pack) => pack?._id === packageId)?.name ?? ""
              }</strong> assigned to user <strong>${email}</strong> successfully`}
              onClose={() => {
                setShowSuccessModal(false);
                setEmail("");
                setPackageId("");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
