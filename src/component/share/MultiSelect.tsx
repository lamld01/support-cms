import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select, { MultiValue, ActionMeta } from 'react-select';

// Define color mappings to match DaisyUI light and dark themes
const themeColors = {
    light: {
        primary: '#570df8', // DaisyUI light primary
        primary75: '#4506cb', // Slightly faded primary
        primary50: '#99ccff', // More faded version
        primary25: '#e0e7ff', // Lighter background for selections
        danger: '#ff5724', // DaisyUI error color
        dangerLight: '#ffd1cf', // Lighter error color
        neutral0: '#ffffff', // Light background
        neutral5: '#f9fafb', // Light base
        neutral10: '#ced3d9', // Light neutral
        neutral20: '#e6e6e6', // Light borders and inputs
        neutral30: '#c2c2c2', // Placeholder text color
        neutral40: '#bd0091', // Secondary focus
        neutral50: '#3b424e', // Darker text for light theme
        neutral60: '#009485', // Success color
        neutral70: '#1c92f2', // Info color
        neutral80: '#99ccff', // Warning color
        neutral90: '#1e2734', // Light mode text content
    },
    dark: {
        primary: 'hsl(220deg 13% 69% / 20%)', // DaisyUI dark primary
        primary75: '#4d99ff', // Slightly faded primary
        primary50: '#3399ff', // More faded version
        primary25: '#282c35', // Darker background for selections
        danger: '#ff7f7f', // DaisyUI error color for dark
        dangerLight: '#ffb3b3', // Lighter error color for dark
        neutral0: '#1D232A', // Dark background
        neutral5: '#2e2e2e', // Darker base
        neutral10: '#3b3b3b', // Dark neutral
        neutral20: '#444444', // Borders and input background for dark mode
        neutral30: '#888888', // Placeholder text color for dark
        neutral40: '#888888', // Secondary focus for dark
        neutral50: '#9da3af', // Light text for dark mode
        neutral60: '#009485', // Success color for dark mode
        neutral70: '#1c92f2', // Info color for dark mode
        neutral80: '#99ccff', // Warning color for dark mode
        neutral90: '#222222', // Text content for dark mode
    }
};

export interface Option {
    value: number; // Adjust this type based on your actual ID type
    label: string;
}

interface MultiSelectProps {
    classname?: string;
    isMulti?: boolean;
    options?: Option[];
    value?: Option | Option[] | null;
    onChange: (selectedOptions: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void;
    onInputChange: (inputValue: string) => void;
    placeholder: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    classname,
    isMulti,
    options,
    value,
    onChange,
    onInputChange,
    placeholder,
}) => {
    const currentTheme = useSelector((state: any) => state?.settings?.theme);
    const [colors, setColors] = useState(currentTheme === 'dark' ? themeColors.dark : themeColors.light);
    const [valueInput, setValueInput] = useState<Option | Option[] | null>()

    useEffect(() => {
        setColors(currentTheme === 'dark' ? themeColors.dark : themeColors.light)
    }, [currentTheme]);

    useEffect(() => {
        setValueInput(value)
    }, [value]);

    return (
        <Select
            isMulti={isMulti || true}
            options={options || []}
            value={valueInput}
            onChange={onChange}
            onInputChange={onInputChange}
            placeholder={placeholder}
            theme={(theme) => ({
                ...theme,
                borderRadius: 4, // Rounded borders for input
                spacing: {
                    baseUnit: 4, // Padding and spacing
                    controlHeight: 38, // Control height of input
                    menuGutter: 8, // Space between items
                },
                colors: {
                    primary: colors.primary,
                    primary75: colors.primary75,
                    primary50: colors.primary50,
                    primary25: colors.primary25,
                    danger: colors.danger,
                    dangerLight: colors.dangerLight,
                    neutral0: colors.neutral0,
                    neutral5: colors.neutral5,
                    neutral10: colors.neutral10,
                    neutral20: colors.neutral20,
                    neutral30: colors.neutral30,
                    neutral40: colors.neutral40,
                    neutral50: colors.neutral50,
                    neutral60: colors.neutral60,
                    neutral70: colors.neutral70,
                    neutral80: colors.neutral80,
                    neutral90: colors.neutral90,
                }
            })}
            className={classname}
            styles={{
                valueContainer: (base) => ({
                    height: '2.9rem',
                    fontSize : '0.875rem',
                    fontFamily: 'inherit',
                   ...base,
                })
            }}
        />
    );
};

export default MultiSelect;
