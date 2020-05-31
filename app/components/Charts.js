import CircularProgress from "@material-ui/core/CircularProgress"
import { Typography, Paper } from "@material-ui/core"
import Chart from "./Chart"

export const chartProps = {
    chartType: "AreaChart",
    width: "100%",
    style: {
        maxWidth: "100%"
    },
    height: "400px",
    loader: <CircularProgress style={{ marginLeft: "auto", marginRight: "auto" }} />
}

function getResultMessage (similarity) {
    if (similarity <= 0.2 || similarity >= 0.8) {
        return "Changes can be connected to the pandemic"
    } else if (similarity <= 0.4 || similarity >= 0.6) {
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
     * @param {String|String[]}         [options.showSections]
     * @param {Boolean}                 [options.sameCard]
     * @param {String}                  [options.customTitle]
     * @param {Boolean}                 [options.hideBefore]
     */
    constructor (options) {
        super(options)
        this.state = {
            chartsList: [],
            charts: [],
            loading: true
        }
    }

    componentDidMount () {
        var sections = ""
        var charts = ""
        var url = "/api/charts"

        if (Array.isArray(this.props.showSections)) {
            sections = this.props.showSections.join(",")
        } else if (typeof this.props.showSections === "string") {
            sections = this.props.showSections
        } else {
            sections = "all"
        }

        charts = Array.isArray(this.props.chartsToLoad) ? this.props.chartsToLoad : [ this.props.chartsToLoad ]
        charts = charts.join(",")

        url += "?sections=" + sections + "&charts=" + charts

        fetch(url)
            .then(response => response.json())
            .then(chartsList => {
                this.setState({ chartsList, loading: chartsList.length })
            })
            .then(() => {
                this.state.chartsList.forEach(chart => {
                    fetch(`/api/charts/${chart.name}`)
                        .then(response => response.json())
                        .then(chartData => {
                            const charts = this.state.charts.concat([])
                            charts.push(chartData)
                            this.setState({ charts, loading: this.state.loading - 1 })
                        })
                })
            })
    }
    

    render () {
        const Wrapper = this.props.sameCard ? Paper : "div"
        return (
            <Wrapper className={`charts ${this.props.sameCard ? "same-card" : ""} ${this.props.children && this.props.sameCard ? "with-post" : ""}`}>
                {this.props.customTitle && this.props.sameCard ? <Typography variant="h2" component="h2" className="charts-title">{this.props.customTitle}</Typography> : null}
                <div className="charts-wrapper">
                    {this.props.children && this.props.sameCard ? <div className="chart-post">{this.props.children}</div> : null}
                    <div className="charts-inner-wrapper">
                        {this.state.charts.map(chart => (
                            <Chart chart={chart} hideBefore={this.props.hideBefore} displayDifferenceChart={this.props.displayDifferenceChart} comment={this.props.comment} chartProps={chartProps} wrapper={this.props.sameCard ? "div" : Paper}>
                                {this.props.children && !this.props.sameCard ? this.props.children : null}
                            </Chart>
                        ))}

                        {new Array(this.state.loading).fill(0).map(() => (
                            <div className="chart">
                                <CircularProgress />
                            </div>
                        ))}
                    </div>
                </div>
            </Wrapper>
        )
    }
}

