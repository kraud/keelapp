import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import React from "react";
import UserInfoCard from "./UserInfoCard";
import {useTranslation} from "react-i18next";


export function UserInfoPanel() {
    const { t } = useTranslation(['dashboard'])
    const {isSuccess, data} = useSelector((state: any) => state.metrics)

    const [totalWords, setTotalWords] = useState<string>("")
    const [incompleteWords, setIncompleteWords] = useState<string>("")
    const [totalLanguages, setTotalLanguages] = useState<string>("")
    
    
    useEffect(() => {
        if(isSuccess) {
            setTotalWords(data.totalWords)
            setIncompleteWords(data.incompleteWordsCount)
            setTotalLanguages(data.translationsPerLanguage.length)
        }
    }, [isSuccess, data.totalWords, data.incompleteWordsCount, data.translationsPerLanguage])

    return (
        <Grid
            container={true}
            item={true}
            alignItems={'center'}
            justifyContent={"space-between"}
            xs={12}
            direction={{
                xs: 'row',
                xl: 'column'
            }}
            spacing={2}
        >
            <Grid
                container={true}
                item={true}
                xs={true}
            >
                <UserInfoCard
                    title={t('userInfoCards.totalWords', {ns: 'dashboard'})}
                    data={totalWords}
                />
            </Grid>
            <Grid
                container={true}
                item={true}
                xs={true}
            >
                <UserInfoCard
                    title={t("userInfoCards.incompleteWords", {ns: 'dashboard'})}
                    data={incompleteWords}
                    link={"review"}
                />
            </Grid>
            <Grid
                container={true}
                item={true}
                xs={true}
            >
                <UserInfoCard
                    title={t("userInfoCards.languages", {ns: 'dashboard'})}
                    data={totalLanguages}
                />
            </Grid>
        </Grid>
    )
}

export default UserInfoPanel