// server.js
const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const path = require("path")
const fs = require("fs")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl

        if (pathname === "/api/charts") {
            const sections = "sections" in query ? query.sections.split(",") : ["all"]
            const charts = "charts" in query ? query.charts.split(",") : ["all"]

            const graphsJsonPath = path.resolve(__dirname, "../graphs/graphs.json")
            if (!fs.existsSync(graphsJsonPath)) {
                res.statusCode = 404
                res.end()
                return
            }

            if (process.env.NODE_ENV === "development") {
                delete require.cache[graphsJsonPath]
            }

            const graphs = require(graphsJsonPath)
            const result = []

            for (let graph of graphs) {
                if (sections.indexOf("all") === -1) {
                    if (sections.indexOf(graph.section) === -1) {
                        continue
                    }
                }

                if (charts.indexOf("all") === -1) {
                    if (charts.indexOf(graph.name) === -1) {
                        continue
                    }
                }

                result.push(graph)
            }

            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(result))
        } else if (pathname === "/api/sections") {
            const sections = []

            const graphsJsonPath = path.resolve(__dirname, "../graphs/graphs.json")
            if (!fs.existsSync(graphsJsonPath)) {
                res.statusCode = 404
                res.end()
                return
            }

            if (process.env.NODE_ENV === "development") {
                delete require.cache[graphsJsonPath]
            }

            const graphs = require(graphsJsonPath)

            for (let graph of graphs) {
                if (graph.section && sections.indexOf(graph.section) === -1) {
                    sections.push(graph.section)
                }
            }
            
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(sections))
        } else if (/^\/api\/charts\/(\w+(-?)\w*)+$/g.test(pathname)) {
            const pathItems= pathname.split("/")
            const chartName = pathItems[pathItems.length - 1]
            const chartPath = path.resolve(__dirname, `../graphs/${chartName}/chart.json`)
            if (!fs.existsSync(chartPath)) {
                res.statusCode = 404
                res.end()
                return
            }

            if (process.env.NODE_ENV === "development") {
                delete require.cache[chartPath]
            }

            const chart = require(chartPath)
            const result = {
                ...chart,
                name: chartName
            }

            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(result))
        } else {
            handle(req, res, parsedUrl)
        }
    }).listen(3000, (err) => {
        if (err) throw err
        console.log("> Ready on http://localhost:3000")
    })
})


