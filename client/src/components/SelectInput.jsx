import React from "react";

const SelectInput = ({
  label,
  value,
  options,
  optionText = "name",
  optionValue = "id",
  helperText,
  placeholder,
  handleChange,
  name,
  required = true,
}) => {
  return (
    <div className="flex flex-1 flex-col p-2 gap-1">
      <div className="text-md pl-1 text-slate-500 ">
        {label} {required ? "*" : "(optional)"}{" "}
      </div>
      {helperText && (
        <div className="text-xs pl-1 text-slate-500 ">{helperText}</div>
      )}
      <div className="mb-3 xl:w-96">
        <select
          className="form-select appearance-none block w-full p-3 pl-5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid  rounded-2xl transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          value={value}
          name={name}
          onChange={handleChange}
          required={required}
        >
          <option value="">{placeholder || label}</option>
          {options.map((option) => (
            <option key={option[optionValue]} value={option[optionValue]}>
              {option[optionText]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectInput;
