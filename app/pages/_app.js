import "./styles.css"
import "typeface-roboto"
import Head from "next/head"
import blue from "@material-ui/core/colors/blue"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { createMuiTheme, Link, ThemeProvider, AppBar, Typography, Toolbar, Paper, Menu, MenuItem } from "@material-ui/core"

const MenuLink = ({ href, children }) => (
    <Link href={href} color="inherit">
        <Typography color="inherit">{children}</Typography>
    </Link>
)

export default ({ Component, pageProps }) => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
    const theme = React.useMemo(
        () => (
            createMuiTheme({
                palette: {
                    type: prefersDarkMode ? "dark" : "light",
                    primary: {
                        main: prefersDarkMode ? blue[200] : blue[600]
                    }
                }
            })
        ), [prefersDarkMode]
    )

    return (
        <ThemeProvider theme={theme}>
            <Head>
                <meta name="theme-color" content={theme.palette.primary.main} />
            </Head>
            <Paper>
                <AppBar position="fixed" className="app-bar">
                    <Toolbar className="toolbar">
                        <Typography variant="h6" component="h2">Quiet planet</Typography>
                        <div className="app-menu">
                            <MenuLink href="/">Home</MenuLink>
                            <MenuLink href="/tools">Research Tools</MenuLink>
                        </div>
                    </Toolbar>
                </AppBar>
                <Component {...pageProps} />
            </Paper>
        </ThemeProvider>
    )
}

