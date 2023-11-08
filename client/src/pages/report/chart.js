import React, {useState, useEffect, useRef} from 'react';
//import ReactDOM from 'react-dom';
import {Area} from '@ant-design/plots';

const DemoArea = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        fetch(`${origin.replace("3000", "5000")}/api/v1/sales`)
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };
    const config = {
        data,
        xField: 'timestamp',
        yField: 'total',
        xAxis: {
            range: [0, 1],
            title: {text: "Date and Time"},
        },
        yAxis: {
            title: {text: "Total"},
        },
        smooth: true,
        isStack: true,
        areaStyle: {
            fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        },
        lineStyle: {
            stroke: 'black',
            lineWidth: 1,
        },
    };

    const ref = useRef();

    // export image
    const downloadImage = () => {
        ref.current?.downloadImage("SalesChart", 'image/png', {backgroundColor: '#ab3', padding: [30, 15, 15, 15]});
    };

    // get base64 data
    const toDataURL = () => {
        console.log(ref.current?.toDataURL());
    };

    return (
        <div>
            <Area {...config}
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
        </div>
    );
};

export default DemoArea;

//ReactDOM.render(, document.getElementById('container'));
