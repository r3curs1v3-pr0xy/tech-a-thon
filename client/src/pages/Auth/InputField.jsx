import React from "react";

const InputField = ({ label, Icon, name, EndIcon, clickEndIcon, ...rest }) => {
  return (
    <div className="flex flex-col mb-5">
      <label
        htmlFor={name}
        className="mb-1 text-xs tracking-wide text-gray-600"
      >
        {label}
      </label>
      <div className="relative">
        <div
          className="
        inline-flex
        items-center
        justify-center
        absolute
        left-0
        top-0
        h-full
        w-10
        text-gray-400
      "
        >
          <Icon className="fas fa-at text-blue-500" />
        </div>

        <input
          id={name}
          type="text"
          name={name}
          className="
        text-sm
        placeholder-gray-500
        pl-10
        pr-4
        rounded-2xl
        border border-gray-400
        w-full
        py-2
        focus:outline-none focus:border-blue-400
      "
          {...rest}
        />
        {!!EndIcon && (
          <div
            className="
        inline-flex
        items-center
        justify-center
        absolute
        right-0
        top-0
        h-full
        w-10
        text-gray-400
      "
            onClick={clickEndIcon}
          >
            <EndIcon className="fas fa-at text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
