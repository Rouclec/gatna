// components/ImageUploadButton.js

import React, { FC, useState } from "react";
import { gilroyBold, gilroyRegular } from "../pages";

interface Props {
  title: string;
  placeholder?: string;
}
const ImageUploadButton: FC<Props> = ({
  title,
  placeholder = "Upload image",
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSelectedImage] = useState<string>();
  const [imageName, setImageName] = useState<string>("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Create a URL for the selected image
      setImageName(file.name); // Set the name of the uploaded file
    } else {
      setImageName(""); // Reset name if no file is selected
    }
  };

  return (
    <div className="bg-grey-bg rounded-lg h-16 flex flex-col px-5 py-2 gap-1">
      <label className="cursor-pointer w-full">
        <div className="flex items-center justify-between">
          <div className="grid">
            <p className={`${gilroyRegular.className} text-neutral-50 text-sm`}>
              {title}
            </p>
            <p className={`${gilroyBold.className} text-neutral-50 text-sm`}>
              {imageName ? imageName : placeholder}
            </p>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden" // Hide the default file input
        />
      </label>
    </div>
  );
};

export default ImageUploadButton;
