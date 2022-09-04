const TextArea = ({
  label,
  helperText,
  placeholder,
  value,
  handleChange,
  name,
  type,
  rows = 6,
  required = true,
  ...rest
}) => {
  return (
    <div className="flex flex-1 flex-col p-2 gap-1 ">
      <div className="text-md pl-1 text-slate-500 ">
        {label} {required ? "*" : "(optional)"}{" "}
      </div>
      {helperText && (
        <div className="text-xs pl-1 text-slate-500 ">{helperText}</div>
      )}
      <textarea
        type={type || "text"}
        className="w-full border  p-4 rounded-2xl  "
        placeholder={placeholder || label}
        value={value}
        name={name}
        rows={rows}
        onChange={handleChange}
        required={required}
        {...rest}
      ></textarea>
    </div>
  );
};

export default TextArea;
