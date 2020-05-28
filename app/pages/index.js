import Head from "next/head"
import Footer from "../components/Footer"
import { Button, Heading, Paragraph } from "evergreen-ui"

export default () => (
    <div className="root">
        <Head>
            <title>Quiet planet solution by Data Scouts</title>
        </Head>

        <div className="top">
            <div className="header">
                <Heading is="h1" size={900} className="header-title">Quiet planet</Heading>
                <Paragraph size={500} className="header-paragraph">NASA Space Apps 2020 COVID-19 challenge solution by Data Scouts</Paragraph>
            </div>

            <div className="content">

            </div>
        </div>

        <Footer />
    </div>
)

