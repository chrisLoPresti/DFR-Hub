import { BsCheck } from "react-icons/bs";
import classNames from "classnames";
import { markerColors } from "@/context/MapContext";

const ColorButtons = ({ className, color, changeColor }) => {
  return (
    <div
      className={classNames("bg-white flex shadow-sm rounded-sm p-2 gap-x-2", {
        [className]: className,
      })}
    >
      {Object.keys(markerColors).map((key) => (
        <button
          key={key}
          className={`bg-${key}-annotation w-5 h-5 flex justify-center items-center`}
          onClick={changeColor ? changeColor(key) : null}
        >
          {color === key ? <BsCheck className="text-white text-xl" /> : ""}
        </button>
      ))}
    </div>
  );
};

export default ColorButtons;
