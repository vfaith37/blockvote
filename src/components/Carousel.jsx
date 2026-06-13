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
    <div className="flex flex-wrap gap-10 sm:gap-14 justify-center my-12 items-start">
      {data.length === 7 && (
        <HiChevronLeft
          className="text-neutral-500 cursor-pointer self-center"
          onClick={previous}
          size={80}
        />
      )}
      {data.map((item, index) => {
        const isSelected = select !== false && select === index;
        return (
          <button
            type="button"
            key={index}
            onClick={() => selectImage(index)}
            aria-pressed={isSelected}
            aria-label={`Select ${item.firstname} ${item.lastname}`}
            className="group flex flex-col items-center bg-transparent border-0 p-0"
          >
            <div
              className={`relative rounded-full p-1 transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-teal-500 ring-offset-4 dark:ring-offset-black ring-offset-white"
                  : "ring-1 dark:ring-neutral-700 ring-neutral-300 group-hover:ring-teal-600"
              }`}
            >
              <img
                src={item.image}
                alt=""
                className={`rounded-full w-28 h-28 sm:w-32 sm:h-32 object-cover transition-transform duration-200 ${
                  isSelected ? "" : "group-hover:scale-[1.03]"
                }`}
              />
              {isSelected && (
                <span className="stamp-in absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center border-2 dark:border-black border-white">
                  <HiCheck size={20} />
                </span>
              )}
            </div>

            <p
              className={`text-lg sm:text-xl font-display font-bold mt-5 transition-colors ${
                isSelected ? "text-teal-500" : ""
              }`}
            >
              {item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1)}{" "}
              {item.lastname.charAt(0).toUpperCase() + item.lastname.slice(1)}
            </p>
            <p className="mt-1 text-neutral-500 text-sm">
              {item.course || item.position || ""}
            </p>
          </button>
        );
      })}

      {data.length === 7 && (
        <HiChevronRight
          className={`text-neutral-500 cursor-pointer self-center ${
            currentIndex === data.length - 1 ? "opacity-50" : ""
          }`}
          onClick={forward}
          size={80}
        />
      )}
    </div>
  );
};
export default Carousel;
