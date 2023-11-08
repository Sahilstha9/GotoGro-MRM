import {Select} from 'antd';
import React, {useState} from 'react';

const {Option} = Select;
let timeout;
let currentValue;

const getRecords = (value, callback, props) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    currentValue = value;

    // This method fetches the records from the database.
    const fake = () => {
        const origin = window.location.origin;
        fetch(`${origin.replace("3000", "5000")}${props.endpoint}?q=${value}`)
            .then((response) => {
                if (!response.ok) {
                    const message = `An error occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }

                return response.json();
            })
            .then((d) => {
                if (currentValue === value) {
                    const data = d
                        .filter(item => props.inputoptionlabel.split("+").map(e => item[e]).join(" ").trim() != "")
                        .slice(0, 5)
                        .map((item) => ({
                            value: item[props.inputoptionvalue],
                            text: props.inputoptionlabel.split("+").map(e => item[e]).join(" "),
                        }));
                    callback(data);
                }
            })
    }
    timeout = setTimeout(fake, 300);
}

export default function SearchBox(props) {

    const SearchInput = (props) => {
        const [data, setData] = useState([]);

        const handleSearch = (newValue) => {

            if (newValue) {
                getRecords(newValue, setData, props);
            } else {
                setData([]);
            }
        };

        const options = data.map((d) => <Option key={d.value}>{d.text}</Option>);

        return (
            <Select
                showSearch
                {...props}
                defaultActiveFirstOption={true}
                showArrow={true}
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                onSearch={handleSearch}
                notFoundContent={null}
            >
                {options}
            </Select>
        );
    };

    // This method will map out the records on the table


    return (
        <SearchInput {...props} hello={"yolo"}/>
    );
}