import "./styles.css"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import DefaultHead from "../components/DefaultHead"
import blue from "@material-ui/core/colors/blue"

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
            <DefaultHead />
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

