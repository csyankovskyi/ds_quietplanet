import Head from "next/head"
import Footer from "../components/Footer"
import { Chart } from "react-google-charts"
import { Typography, Paper } from "@material-ui/core"
import CircularProgress from "@material-ui/core/CircularProgress"

const chartProps = {
    chartType: "AreaChart",
    width: "100%",
    style: {
        maxWidth: "100%"
    },
    height: "400px",
    legendToggle: true,
    loader: <CircularProgress />
}

export default class Index extends React.Component {
    constructor () {
        super()
        this.state = {
            chartsList: {},
            charts: {},
            loading: true
        }
    }
    
    componentDidMount () {
        fetch("/api/charts")
            .then(response => response.json())
            .then(chartsList => {
                this.setState({ chartsList, loading: chartsList.length })
            })
            .then(() => (
                this.state.chartsList.forEach(chart => {
                    fetch(`/api/charts/${chart.name}`)
                        .then(response => response.json())
                        .then(chartData => {
                            const charts = this.state.charts
                            charts[chart.name] = chartData
                            charts[chart.name].id = this.state.loading
                            this.setState({ charts, loading: this.state.loading - 1 })
                        })
                })
            ))
    }

    render () {
        return (
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
                        {Object.keys(this.state.charts).map(key => {
                            const chart = this.state.charts[key]
                            const data = [ chart.legend ]

                            for (let i in chart.metadata) {
                                data.push([ chart.metadata[i], chart.data[i] ])
                            }

                            let prevData = null

                            if ("before" in chart) {
                                prevData = [ chart.legend ]
                                for (let i in chart.before.metadata) {
                                    prevData.push([ chart.before.metadata[i], chart.before.data[i] ])
                                }
                            }

                            return (
                                <div className={`chart chart-${key}`} key={chart.id}>
                                    <Typography variant="h2" className="chart-title">{chart.description}</Typography>
                                    <div className={`chart-list ${prevData === null ? "only-latest" : ""}`}>
                                        <div className="chart-latest">
                                            <Typography variant="subtitle1" className="chart-subtitle">Latest</Typography>
                                            <Chart data={data} {...chartProps} />
                                        </div>
                                        {prevData === null ? null :
                                            <div className="chart-before">
                                                <Typography variant="subtitle1" className="chart-subtitle">Previous data</Typography>
                                                <Chart data={prevData} {...chartProps} />
                                            </div>}
                                    </div>
                                </div>
                            )
                        })}

                        {new Array(this.state.loading).fill(0).map(() => (
                            <div className="chart">
                                <CircularProgress />
                            </div>
                        ))}
                    </div>
                </div>

                <Footer />
            </Paper>
        )
    }
}
