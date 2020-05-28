import "./styles.css"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import DefaultHead from "../components/DefaultHead"

export default ({ Component, pageProps }) => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
    const theme = React.useMemo(
        () => (
            createMuiTheme({
                palette: {
                    type: prefersDarkMode ? "dark" : "light"
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

