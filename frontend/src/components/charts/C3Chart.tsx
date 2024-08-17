import React, { useEffect, useRef } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

const C3Chart = ({ data, options }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = c3.generate({
            bindto: chartRef.current,
            data: data,
            ...options,
        });

        return () => {
            chart.destroy();
        };
    }, [data, options]);

    return <div ref={chartRef}></div>;
};

export default C3Chart;
