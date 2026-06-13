import React, { useState } from "react";
import { HiCheck, HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Carousel = (props) => {
  const { data, onSelect } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [select, setSelect] = useState(false);

  const previous = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const forward = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const selectImage = (index) => {
    setCurrentIndex(index);
    onSelect(data[index]);
    setSelect(index);
  };

  return (
    <div className="flex gap-20 justify-between my-[68px] items-center">
      {data.length === 7 && (
        <HiChevronLeft
          className="text-neutral-500 cursor-pointer"
          onClick={previous}
          size={120}
        />
      )}
      {data.map((item, index) => (
        <div className="flex flex-col items-center" key={index}>
          {select !== false && currentIndex === index ? (
            <div className="rounded-full cursor-pointer w-32 h-32 flex justify-center items-center bg-teal-600">
              <HiCheck size={70} />
            </div>
          ) : (
            <img
              src={item.image}
              alt="candidate"
              className={`rounded-full cursor-pointer w-32 h-32 ${
                index === currentIndex ? "bg-teal-600" : ""
              }`}
              onClick={() => selectImage(index)}
            />
          )}

          <p className="text-xl font-bold mt-[26px]">
            {item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)}{" "}
            {item.lastname.charAt(0).toUpperCase() + item.lastname.slice(1)}
          </p>
          <p className="mt-[7px] text-neutral-500 text-base">
            {item.course || item.position || ""}
          </p>
        </div>
      ))}

      {data.length === 7 && (
        <HiChevronRight
          className={`text-neutral-500 cursor-pointer ${
            currentIndex === data.length - 1 ? "opacity-50" : ""
          }`}
          onClick={forward}
          size={120}
        />
      )}
    </div>
  );
};
export default Carousel;
