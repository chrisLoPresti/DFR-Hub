import classNames from "classnames";
import { useState } from "react";
import { BsSuitDiamond } from "react-icons/bs";
import ColorButtons from "./ColorButtons";

const CreatePinPointButton = ({
  enablePinPoints,
  toggleEnablePinPoints,
  color,
  changeColor,
}) => {
  const [openColorPicker, setOpenColorPicker] = useState(false);

  const showColorPicker = () => {
    setOpenColorPicker(true);
  };

  const hideColorPicker = () => {
    setOpenColorPicker(false);
  };

  return (
    <div
      className="absolute top-20 right-2.5 flex"
      onMouseEnter={showColorPicker}
      onMouseLeave={hideColorPicker}
    >
      {openColorPicker && (
        <ColorButtons color={color} changeColor={changeColor} />
      )}
      <button
        className={classNames(
          "rounded-sm p-2 shadow-lg bg-white border-2 ml-2",
          {
            "text-blue-annotation border-blue-annotation bg-gradient-to-tr from-white from-80% to-blue-annotation to-90%":
              enablePinPoints,
            "border-white": !enablePinPoints,
          }
        )}
        onClick={toggleEnablePinPoints}
      >
        <BsSuitDiamond />
      </button>
    </div>
  );
};
export default CreatePinPointButton;
