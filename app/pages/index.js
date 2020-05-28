import Head from "next/head"
import Footer from "../components/Footer"
import { Typography, Paper } from "@material-ui/core"

export default () => (
    <Paper className="root">
        <Head>
            <title>"Quiet planet" challenge solution by Data Scouts</title>
        </Head>

        <div className="top">
            <div className="header">
                <Typography variant="h1" className="header-title">Quiet planet</Typography>
                <Typography variant="subtitle1" className="header-paragraph">NASA Space Apps 2020 COVID-19 challenge solution by Data Scouts</Typography>
            </div>

            <div className="content">

            </div>
        </div>

        <Footer />
    </Paper>
)

