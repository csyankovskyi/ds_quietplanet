import CircularProgress from "@material-ui/core/CircularProgress"
import { Typography, Paper } from "@material-ui/core"
import { Chart } from "react-google-charts"

const chartProps = {
    chartType: "AreaChart",
    width: "100%",
    style: {
        maxWidth: "100%"
    },
    height: "400px",
    loader: <CircularProgress />
}

function getResultMessage (similarity) {
    if (similarity < 20 || similarity > 80) {
        return "Changes can be because of COVID-19"
    } else if (similarity < 40 || similarity > 60) {
        return "More researches needed"
    } else {
        return "Hard to decide"
    }
}

export default class Charts extends React.Component {
    /**
     * @param {Object}                  options
     * @param {String|String[]}         options.chartsToLoad
     * @param {Boolean}                 [options.displayDifferenceChart]
     * @param {String}                  [options.comment]
     * @param {React.Component[]}       [options.children]
     */
    constructor (options) {
        super(options)
        this.state = {
            chartsList: {},
            charts: {},
            loading: true
        }
    }

    componentDidMount () {
        if (this.props.chartsToLoad === "all") {
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
        } else {
            let charts = Array.isArray(this.props.chartsToLoad) ? this.props.chartsToLoad : [ this.props.chartsToLoad ]
            this.state.loading = charts.length
            this.state.chartsList = charts
            this.state.chartsList.forEach(chart => {
                fetch(`/api/charts/${chart}`)
                    .then(response => response.json())
                    .then(chartData => {
                        const charts = this.state.charts
                        charts[chart] = chartData
                        charts[chart].id = this.state.loading
                        this.setState({ charts, loading: this.state.loading - 1 })
                    })
            })
        }
    }
    

    render () {
        return (
            <div>
                {Object.keys(this.state.charts).map(key => {
                    const chart = this.state.charts[key]
                    const data = [ chart.legend ]

                    let maxValue = 0
                    let minValue = null

                    for (let i in chart.metadata) {
                        data.push([ chart.metadata[i], chart.data[i] ])
                        if (chart.data[i] > maxValue) {
                            maxValue = chart.data[i]
                        }

                        if (minValue === null || minValue > chart.data[i]) {
                            minValue = chart.data[i]
                        }
                    }

                    let prevData = null
                    let differenceData = null

                    if ("before" in chart) {
                        prevData = [ chart.legend ]
                        differenceData = [ chart.legend ]
                        for (let i in chart.before.metadata) {
                            prevData.push([ chart.before.metadata[i], chart.before.data[i] ])
                            differenceData.push([ "", chart.data[i] - chart.before.data[i] ])

                            if (chart.before.data[i] > maxValue) {
                                maxValue = chart.before.data[i]
                            }

                            if (minValue === null || minValue > chart.before.data[i]) {
                                minValue = chart.before.data[i]
                            }
                        }
                    }

                    maxValue *= 1.02

                    const options = {
                        legend: { position: 'top', maxLines: 3 },
                        vAxis: { 
                            maxValue,
                            minValue
                        }
                    }

                    return (
                        <Paper className={`chart chart-${key}`} key={chart.id}>
                            <Typography variant="h2" className="chart-title">{chart.description}</Typography>
                            <div className={`chart-wrapper ${this.props.children ? "with-post" : ""}`}>
                                {!this.props.children ? null : 
                                    <div className="chart-post">
                                        {this.props.children}
                                    </div>}
                                <div className="chart-inner-wrapper">
                                    {prevData === null ? null : 
                                        <Typography variant="subtitle2" className="chart-result" color="primary">
                                            {getResultMessage(chart.similarity) + ". "}
                                            {`Charts are ${chart.similarity * 100}% similar`}
                                        </Typography>}

                                    <div className={`chart-list ${prevData === null ? "only-latest" : ""}`}>
                                        {prevData === null ? null :
                                            <div className="chart-before">
                                                <Typography variant="subtitle1" className="chart-subtitle">Previous data</Typography>
                                                <Chart data={prevData} {...chartProps} options={options} />
                                            </div>}
                                        <div className="chart-latest">
                                            <Typography variant="subtitle1" className="chart-subtitle">Latest</Typography>
                                            <Chart data={data} {...chartProps} options={options} />
                                        </div>
                                    </div>
                                    {!(this.props.displayDifferenceChart && "before" in chart) ? null :
                                        <div className="chart-difference">
                                            <Typography variant="subtitle1" className="chart-subtitle">Difference</Typography>
                                            <Chart data={differenceData} {...chartProps} />
                                        </div>}
                                    {!this.props.comment ? null : 
                                        <Typography>{this.props.comment}</Typography>}
                                </div>
                            </div>
                       </Paper>
                    )
                })}

                {new Array(this.state.loading).fill(0).map(() => (
                    <div className="chart">
                        <CircularProgress />
                    </div>
                ))}
            </div>
        )

    }
}

