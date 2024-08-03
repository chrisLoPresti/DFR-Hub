import classNames from "classnames";
import { useMemo, useState } from "react";
import { BsSuitDiamond, BsCheck } from "react-icons/bs";

const CreatePinPointButton = ({
  enablePinPoints,
  toggleEnablePinPoints,
  markerColors,
  defaultMarkerColor,
  changeDefaultMarkerColor,
}) => {
  const [openColorPicker, setOpenColorPicker] = useState(false);

  const showColorPicker = () => {
    setOpenColorPicker(true);
  };

  const hideColorPicker = () => {
    setOpenColorPicker(false);
  };

  const colorButtons = useMemo(() => {
    return Object.keys(markerColors).map((key) => (
      <button
        key={key}
        className={`bg-${key}-annotation w-5 h-5 flex justify-center items-center`}
        onClick={changeDefaultMarkerColor(key)}
      >
        {defaultMarkerColor === key ? (
          <BsCheck className="text-white text-xl" />
        ) : (
          ""
        )}
      </button>
    ));
  }, [markerColors, defaultMarkerColor, changeDefaultMarkerColor]);

  return (
    <div
      className="absolute top-20 right-2.5 flex"
      onMouseEnter={showColorPicker}
      onMouseLeave={hideColorPicker}
    >
      {openColorPicker && (
        <div className="bg-white flex mr-2 shadow-sm rounded-md p-2 gap-x-2">
          {colorButtons}
        </div>
      )}
      <button
        className={classNames("rounded-sm p-2 shadow-lg bg-white border-2", {
          "text-blue-annotation border-blue-annotation bg-gradient-to-tr from-white from-80% to-blue-annotation to-90%":
            enablePinPoints,
          "border-white": !enablePinPoints,
        })}
        onClick={toggleEnablePinPoints}
      >
        <BsSuitDiamond />
      </button>
    </div>
  );
};
export default CreatePinPointButton;
