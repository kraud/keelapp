import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../app/store";
import {useEffect, useState} from "react";
import {getUserMetrics} from "../../features/metrics/metricSlice";
import globalTheme from "../../theme/theme";
import {Grid} from "@mui/material";
import React from "react";
import UserInfoCard from "./UserInfoCard";


export function UserInfoPanel() {
    const dispatch = useDispatch<AppDispatch>()
    const {isSuccess, data} = useSelector((state: any) => state.metrics)

    // On first render, this makes all the necessary requests to BE (and stores result data in Redux) to display account-screen info
    useEffect(() => {
        dispatch(getUserMetrics())
    },[dispatch])

    const [totalWords, setTotalWords] = useState<string>("")
    const [incompleteWords, setIncompleteWords] = useState<string>("")
    const [totalLanguages, setTotalLanguages] = useState<string>("")
    
    
    useEffect(() => {
        if(isSuccess) {
            console.log(data)
            setTotalWords(data.totalWords)
            setIncompleteWords(data.incompleteWordsCount)
            setTotalLanguages(data.translationsPerLanguage.length)
        }

    }, [isSuccess, data])

    return (
        <Grid
            container={true}
            sx={{
                border: '2px solid #0072CE',
                borderRadius: '25px',
                padding: globalTheme.spacing(1),
                marginBottom: globalTheme.spacing(1),
                backgroundColor: '#e1e1e1'
            }}
            alignItems={'center'}
            justifyContent={"space-between"}
            xs={12}
            md={5}
        >
            <Grid
                flexGrow={1}
                sx={{paddingX: '2px'}}
            >
                <UserInfoCard title={"Total Words"} data={totalWords}/>
            </Grid>
            <Grid
                flexGrow={1}
                sx={{paddingX: '2px'}}
            >
                <UserInfoCard title={"Incomplete Words"} data={incompleteWords} link={"review"}/>
            </Grid>
            <Grid
                flexGrow={1}
                sx={{paddingX: '2px'}}
            >
                <UserInfoCard title={"Languages"} data={totalLanguages}/>
            </Grid>
        </Grid>);

}

export default UserInfoPanel;