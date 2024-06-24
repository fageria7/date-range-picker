import React from 'react';

export interface dropdownItem {
    label: string;
    value: number;
}

interface DropdownProps {
    dropdownItems: Array<dropdownItem>;
    id: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>, id: string) => void;
    selectedValue: number;
}

const Dropdown: React.FC<DropdownProps> = ({dropdownItems, id, onChange, selectedValue}) => {
    return (
        <select
            autoFocus
            className="dropdown-btn"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e, id)}
            value={selectedValue}
        >
            {dropdownItems.map((item, index) => 
            <option className="dropdown-option" key={item.value} value={item.value}>{item.label}</option>)
            }
        </select>
    );
}

export default Dropdown;