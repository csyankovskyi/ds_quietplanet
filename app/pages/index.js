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
                    <Header key="header" />
                    <div className="content" key="content">
                        <div className="content-text" key="content-text">
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
                        <Charts chartsToLoad={["aerosol", "wildfires"]} sameCard hideBefore comment={{
                            aerosol: "Aerosol optical thickness drop from February to March is caused by China shutting down industrial facilities in response to COVID-19 spread, and shortage of atmospheric emissions as a result."
                        }} key="aerosol-and-active-fires" customTitle="Aerosol optical thickness & wildfires">
                            <Typography>
                                Tiny solid and liquid particles suspended in the atmosphere are called aerosols.
                                Windblown dust, sea salts, volcanic ash, smoke from wildfires, and pollution from factories are all examples of aerosols.
                                Because aerosols reflect visible and near-infrared light back to space, scientists can use satellites to make maps of where there are high concentrations of these particles.
                                Scientists call this measurement aerosol optical thickness. It is a measure of how much light the airborne particles prevent from traveling through the atmosphere.
                                Aerosols absorb and scatter incoming sunlight, thus reducing visibility and increasing optical thickness. An optical thickness of less than 0.1 indicates a crystal clear sky with maximum visibility,
                                whereas a value of 1 indicates the presence of aerosols so dense that people would have difficulty seeing the Sun, even at mid-day.
                            </Typography>
                            <Typography>
                                Aerosol optical thickness increase is caused mostly by wildfires, with this value being high at the places with a large amount of burnings. Another large contributors are dust storms,
                                which are responsible for AOT being high in many deserted areas and factories, throwing aerosols into air.
                            </Typography>
                            <img src="aerosol-and-fires.png"/>
                            <Typography>
                                This year`s aerosol optical thickness has increased comparing to the two past years. However, despite fire count increasing and no dust storm situation changes, it started to drop between February and March. The most probable reason is decrease in atmospheric emissions from factories and other human activities due to different disease containment measures.
                            </Typography>
                        </Charts>
                        <Charts chartsToLoad="nitrogen-dioxide" displayDifferenceChart comment="" key="nitrogen-dioxide">
                            <Typography>
                                Nitrogen dioxide (NO<sub>2</sub>) is a gas that occurs naturally in our atmosphere, but its concentrations are very low as compared to oxygen (O<sub>2</sub>) and nitrogen (N<sub>2</sub>).
                                NO<sub>2</sub> is part of a family of chemical compounds collectively called “nitrogen oxides” or “NO<sub>x</sub>”. Nitric oxide (NO) is also part of the NO<sub>x</sub> family.
                                Together, NO and NO<sub>2</sub> play important roles in the chemical formation of ozone near the Earth's surface where we live and breathe.
                            </Typography>
                            <Typography>
                                While ozone high in the atmosphere (i.e., in the stratospheric “ozone layer”) protects us from ultraviolet (UV) rays from the Sun, ozone near the surface is a pollutant.
                                Ozone is unhealthy to breathe and damages plants, including food crops.
                            </Typography>
                            <Typography>
                                Like NO<sub>x</sub>, ozone occurs naturally in the air at low concentrations that are not unhealthy, but its concentrations can reach unhealthy levels when NO<sub>x</sub> concentrations become high.
                                In the presence of sunlight, NO<sub>x</sub> can undergo chemical reactions leading to the formation of high concentrations of ozone if NO<sub>x</sub> concentrations are high.
                                In urban areas, NO<sub>x</sub> concentrations can be quite high since NO<sub>x</sub> is formed during the combustion of fossil fuels, such as gasoline in car engines and coal in power plants, which is then released into the atmosphere.
                            </Typography>
                            <Typography>
                                This year because of numerous travel restrictions and lockdowns NO<sub>2</sub> amount has significantly decreased comparing to the past two years, which can be seen both on the graph and on the illustrations.
                            </Typography>
                            <img src="https://neo.sci.gsfc.nasa.gov/servlet/RenderData?si=1787647&cs=rgb&format=JPEG&width=720&height=360"/>
                            <img src="https://neo.sci.gsfc.nasa.gov/servlet/RenderData?si=1787659&cs=rgb&format=JPEG&width=720&height=360"/>
                            <img src="https://neo.sci.gsfc.nasa.gov/servlet/RenderData?si=1787671&cs=rgb&format=JPEG&width=720&height=360"/>
                            <Typography>
                                As the main NO<sub>2</sub> source is car traffic, a connection between quarantine measures and NO<sub>2</sub> reduction can be noticed.
                            </Typography>
                        </Charts>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}
