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
  onInputChange?(val: string): void; // Hàm callback khi giá trị input thay đổi

  placeholder?: string; // Placeholder cho input
};

const Autocomplete: React.FC<Props> = (props) => {
  const { options, placeholder, onChange, onInputChange } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<OptionType[]>(options); // Lưu trữ các tùy chọn được lọc
  const [searchValue, setSearchValue] = useState<string>("");

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
      options.filter((option) => option.label?.toLowerCase().includes(newValue)) // Lọc các tùy chọn
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
          className="grow bg-inherit outline-none focus:outline-none"
          value={searchValue} // Giá trị hiện tại
          onChange={(e) => {
            const newValue = e.target.value; // Giá trị người dùng nhập
            setSearchValue(newValue);
            setOpen(true); // Mở dropdown khi gõ
            if (onInputChange) {
              onInputChange(newValue); // Gọi hàm onInputChange khi input thay đổi
            }
          }}
          placeholder={placeholder}
          tabIndex={0}
          onFocus={() => setOpen(true)} // Mở dropdown khi focus vào input
        />
        {/* Icon hiển thị dropdown mở hoặc đóng */}
        <button
          type="button"
          className="h-4 w-4 cursor-pointer"
          onClick={() => setOpen(!open)} // Đổi trạng thái dropdown
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg> // Hiển thị mũi tên đi lên khi dropdown mở
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg> // Hiển thị mũi tên đi xuống khi dropdown đóng
          )}
        </button>
        {/* Nút "X" để xóa dữ liệu */}
        {searchValue && (
          <button
            type="button"
            className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 transition-all"
            onClick={() => {
              setSearchValue(""); // Xóa dữ liệu trong input
              setOpen(false); // Đóng dropdown
              onChange(""); // Truyền giá trị rỗng ra ngoài
              if (onInputChange) {
                onInputChange(""); // Gọi hàm onInputChange khi input thay đổi
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </label>
      {open && filteredOptions.length > 0 && ( // Chỉ hiển thị dropdown nếu có tùy chọn
        <div className="dropdown-content bg-base-200 top-10 max-h-96 overflow-auto flex-col rounded-md shadow-md">
          <ul
            className="menu bg-base-200 rounded-box"
            style={{ width: ref.current?.clientWidth }}
          >
            {filteredOptions.map((item, index) => (
              <li
                key={item.value} // Sử dụng value làm key
                tabIndex={index + 1}
                onClick={() => {
                  onChange(item.value); // Cập nhật giá trị khi chọn
                  setSearchValue(item.label);
                  setOpen(false); // Đóng dropdown khi chọn
                }}
                className="border-b border-b-base-content/10 w-full transition-all"
              >
                <button type="button" className="text-left px-4 py-2 w-full">{item.label}</button> {/* Hiển thị label */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
