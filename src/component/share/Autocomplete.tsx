import React, { useEffect, useRef, useState } from "react";

// Đổi kiểu Props để options là mảng các đối tượng có label và value
type OptionType = {
  label: string;
  value: number; // Giá trị là số
};

type Props = {
  classname?: string; 
  labelClassname?: string; 
  options: OptionType[];
  onChange(val: number | string): void; // Hàm callback khi giá trị thay đổi
  placeholder?: string; // Placeholder cho input
};

const Autocomplete: React.FC<Props> = (props) => {
  const { options, placeholder, onChange } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<OptionType[]>(options); // Lưu trữ các tùy chọn được lọc
  const [searchValue, setSearchValue] = useState<string>('');
  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  // Lọc các tùy chọn khi giá trị nhập vào thay đổi
  useEffect(() => {
    const newValue = String(searchValue).toLowerCase(); // Chuyển đổi giá trị nhập vào thành chữ thường
    setFilteredOptions(
      options.filter((option) => option.label.toLowerCase().includes(newValue)) // Lọc các tùy chọn
    );
  }, [searchValue, options]);

  return (
    <div
      ref={ref}
      className={`dropdown w-full flex ${open ? "dropdown-open" : ""} ${props.classname}`}
    >
      <label className={`input input-bordered flex items-center input-xs gap-2 ${props.labelClassname}`}>
        <input
          type="text"
          className="grow bg-inherit"
          value={searchValue} // Giá trị hiện tại
          onChange={(e) => {
            const newValue = e.target.value; // Giá trị người dùng nhập
            setSearchValue(newValue);
            setOpen(true); // Mở dropdown khi gõ
          }}
          placeholder={placeholder}
          tabIndex={0}
          onFocus={() => setOpen(true)} // Mở dropdown khi focus vào input
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70 cursor-pointer"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      {open && filteredOptions.length > 0 && ( // Chỉ hiển thị dropdown nếu có tùy chọn
        <div className="dropdown-content bg-base-200 top-14 max-h-96 overflow-auto flex-col rounded-md">
          <ul
            className="menu menu-compact"
            style={{ width: ref.current?.clientWidth }}
          >
            {filteredOptions.map((item, index) => (
              <li
                key={item.value} // Sử dụng value làm key
                tabIndex={index + 1}
                onClick={() => {
                  onChange(item.value); // Cập nhật giá trị khi chọn
                  setSearchValue(item.label)
                  setOpen(false); // Đóng dropdown khi chọn
                }}
                className="border-b border-b-base-content/10 w-full"
              >
                <button type="button">{item.label}</button> {/* Hiển thị label */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
