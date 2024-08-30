import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../app/store";
import {useEffect, useState} from "react";
import {getUserMetrics} from "../../features/metrics/metricSlice";
import {Card, CardContent, Grid} from "@mui/material";
import React from "react";
import globalTheme from "../../theme/theme";
import C3Chart from "./C3Chart";
import {alignProperty} from "@mui/material/styles/cssUtils";


export function UserInfo(){

    const dispatch = useDispatch<AppDispatch>()
    const {isError, isSuccess, isLoading, message, data} = useSelector((state: any) => state.metrics)

    useEffect(() => {
        dispatch(getUserMetrics())
    },[dispatch])

    const [totalWords, setTotalWords] = useState(0)


    useEffect(() => {
        if(isSuccess) {
            setTotalWords(data.totalWords)
        }

    }, [isSuccess, data])

    return(<Grid>
        <Grid
            container={true}
            >
            <Card
                sx={{paddingX: globalTheme.spacing(2)}}
            >
                <CardContent
                    sx={{alignItems:"center"}}>
                    <h3>{"Total words"}</h3>
                    <h1>{totalWords}</h1>
                </CardContent>
            </Card>
        </Grid>
    </Grid>);
}
export default UserInfo;

