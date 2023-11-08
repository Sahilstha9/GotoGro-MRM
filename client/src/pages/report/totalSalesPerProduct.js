import React, {useState, useEffect, useRef} from 'react';
//import ReactDOM from 'react-dom';
import {Column, Anchor} from '@ant-design/plots';
import {CSVLink} from "react-csv";

const DemoArea = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        const dateNow = new Date();
        const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;

        const oneWeekAgoDate = dateNow.getTime() - oneWeekInMillis;

        fetch(`${origin.replace("3000", "5000")}/api/v1/reports/totalRevenuePerProduct?after=${oneWeekAgoDate}`)
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };
    const config = {
        data,
        xField: 'name',
        yField: 'saleQuantity',
        xAxis: {
            title: {text: "Products"},
            label: {
                autoRotate: false,
            },
        },
        yAxis: {
            title: {text: "Total"},
        },
        scrollbar: {
            type: 'horizontal',
        },
    };

    const ref = useRef();

    // export image
    const downloadImage = () => {
        ref.current?.downloadImage("ProductSalesChart", 'image/png', {
            backgroundColor: '#ab3',
            padding: [30, 15, 15, 15]
        });
    };

    const header = [
        {label : 'Product ID', key: '_id'},
        {label : 'Name', key: 'name'},
        {label : 'Total Amount Sold', key: 'totalSold'},
        {label : 'Sale Quantity', key: 'saleQuantity'},
    ]

    const csvReport = {
        filename: "TotalSaleRevenue.csv",
        headers: header,
        data: data
    }

    // get base64 data
    const toDataURL = () => {
        console.log(ref.current?.toDataURL());
    };

    return (
        <div>
            <Column {...config}
                    onReady={(plot) => {
                        ref.current = plot;
                    }}
            />
            <button type="button" onClick={downloadImage} style={{marginRight: 24}}>
                Export image
            </button>
            <button type="button" onClick={toDataURL}>
                Get base64
            </button>
            <CSVLink {...csvReport}>Export To CSV</CSVLink>
        </div>
    );
};

export default DemoArea;

//ReactDOM.render(, document.getElementById('container'));
