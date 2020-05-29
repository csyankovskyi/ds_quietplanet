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
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(graphs))
        } else if (/^\/api\/charts\/\w+$/g.test(pathname)) {
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
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(chart))
        } else {
            handle(req, res, parsedUrl)
        }
    }).listen(3000, (err) => {
        if (err) throw err
        console.log("> Ready on http://localhost:3000")
    })
})


