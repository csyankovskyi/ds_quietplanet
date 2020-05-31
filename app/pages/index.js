import Head from "next/head"
import Footer from "../components/Footer"
import Header from "../components/Header"
import Charts from "../components/Charts"
import Link from "@material-ui/core/Link"
import { Typography, Paper } from "@material-ui/core"

export default class Index extends React.Component {
    render () {
        return (
            <div className="root">
                <Head>
                    <title>"Quiet planet" challenge solution by Data Scouts</title>
                </Head>

                <div className="top">
                    <Header />
                    <div className="content">
                        <div className="content-text">
                            <div className="content-post">
                                <Typography>By the time of 2020, the COVID-19 pandemic is the most impactful problem worldwide, with no country escaping its touch and everyone feeling the consequences. Considering its high contagiousness and severe mortality, strong measures were taken to contain it’s spread, with many of those having sometimes unobvious impacts on our planet.</Typography>
                                <Typography>Our job was to investigate planet changes happening during the pandemic and determine whether they are caused by it or not.</Typography>
                            </div>
                            <div className="content-post">
                                <Typography variant="h2">Measures taken</Typography>
                                <Typography>
                                    Almost all the countries took different measures, including travel bans, non-essential business closure, social distance enforcement, etc. 
                                    According to <Link href="https://www.bsg.ox.ac.uk/covidtracker">Oxford COVID-19 government response tracker</Link>, different restrictions started to apply 
                                    mostly in the middle of March.
                                </Typography>
                            </div>
                        </div>
                        <Charts chartsToLoad="aerosol" displayDifferenceChart comment="Aerosol optical thickness drop from February to March is caused by China shutting down industrial facilities in response to COVID-19 spread, and shortage of atmospheric emissions as a result.">
                            <Typography>This is post</Typography>
                            <Typography>Hello world!</Typography>
                        </Charts>
                        <Charts chartsToLoad="ozone" displayDifferenceChart comment="">
                        
                        </Charts>
                        <Charts chartsToLoad="nitrogen-dioxide" displayDifferenceChart comment="">
                        
                        </Charts>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}
