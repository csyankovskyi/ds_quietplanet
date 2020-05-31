import { Typography, Paper } from "@material-ui/core"
import { Chart } from "react-google-charts"

function getResultMessage (similarity) {
    if (similarity <= 0.2 || similarity >= 0.8) {
        return "Changes can be connected to the pandemic"
    } else if (similarity <= 0.4 || similarity >= 0.6) {
        return "More researches needed"
    } else {
        return "Hard to decide"
    }
}

export default class _Chart extends React.Component {
    /**
     * @param {Object}                  options
     * @param {String|String[]}         options.chart
     * @param {Object}                  options.chartProps
     * @param {Boolean}                 [options.displayDifferenceChart]
     * @param {String}                  [options.comment]
     * @param {Boolean}                 [options.hideChartTitle]
     */
    constructor (options) {
        super(options)
    }

    static defaultProps = {
        wrapper: "div"
    }

    render () {
        const chart = this.props.chart
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

        if ("before" in chart && chart.before && typeof chart.before === "object") {
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

        // used for all graphs
        const allOptions = {
            legend: { position: 'top', maxLines: 3 },
        }

        // used only for latest and current graphs
        const options = {
            ...allOptions,
            vAxis: { 
                maxValue,
                minValue
            }
        }

        return (
            <this.props.wrapper className={`chart chart-${chart.name} ${this.props.children ? "with-post" : ""} ${this.props.className ? this.props.className : ""}`}>
                {this.props.hideChartTitle ? null :
                    <Typography variant="h2" component="h2" className="chart-title">{chart.description}</Typography>}
                {prevData === null ? null : 
                        <Typography variant="subtitle2" className="chart-result" color="primary">
                            {getResultMessage(chart.similarity) + ". "}
                            {`Charts are ${chart.similarity * 100}% similar`}
                        </Typography>}


                <div className="chart-wrapper">
                    {!this.props.children ? null : 
                        <div className="chart-post">
                            {this.props.children}
                        </div>}

                    <div className="chart-inner-wrapper">
                        
                        <div className={`chart-list ${prevData === null ? "only-latest" : ""}`}>
                            {prevData === null || this.props.hideBefore ? null :
                                <div className="chart-before">
                                    <Typography variant="subtitle1" className="chart-subtitle">Previous data</Typography>
                                    <Chart data={prevData} {...this.props.chartProps} options={options} />
                                </div>}
                            <div className="chart-latest">
                                <Typography variant="subtitle1" className="chart-subtitle">Latest</Typography>
                                <Chart data={data} {...this.props.chartProps} options={options} />
                            </div>
                        </div>
                        {!(this.props.displayDifferenceChart && prevData !== null) ? null :
                            <div className="chart-difference">
                                <Typography variant="subtitle1" className="chart-subtitle">Difference</Typography>
                                <Chart data={differenceData} {...this.props.chartProps} options={allOptions} />
                            </div>}
                        {typeof this.props.comment === "object" 
                            ? chart.name in this.props.comment 
                                ? <Typography className="chart-comment">{this.props.comment[chart.name]}</Typography>
                                : null
                            : typeof this.props.comment === "string" 
                                ? <Typography className="chart-comment">{this.props.comment}</Typography>
                                : null}
                    </div>
                </div>
           </this.props.wrapper>
        )
    }
}


