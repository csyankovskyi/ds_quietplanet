import "./styles.css"
import DefaultHead from "../components/DefaultHead"

export default ({ Component, pageProps }) => (
    <div>
        <DefaultHead />
        <Component {...pageProps} />
    </div>
)

