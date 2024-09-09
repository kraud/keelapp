import React, { useEffect, useRef } from 'react';
import c3, {Data, LegendOptions, TooltipOptions} from 'c3';
import 'c3/c3.css';

interface C3Props {
    data: Data,
    options?: {
        legend?: LegendOptions,
        tooltip?: TooltipOptions
        // zoom?: ZoomOptions,
    }
}
const C3Chart = (props: C3Props) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = c3.generate({
            bindto: chartRef.current,
            data: props.data,
            ...props.options
        });

        return () => {
            chart.destroy()
        }
    }, [props]);

    return <div ref={chartRef}></div>;
};

export default C3Chart;
