import React from "react";

const RadioSelection = ({ options, value, onChange }) => {
  return (
    <div className="flex items-center mb-4 mt-4">
      {options.map((option) => (
        <label
          key={option.value}
          for={option.label}
          className=" ml-5 text-sm font-medium text-white "
        >
          <input
            id={option.label}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            type="radio"
            value={option.value}
            checked={option.value === value}
            onChange={onChange}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export { RadioSelection };
