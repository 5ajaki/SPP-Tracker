import "../styles/globals.css";
import { ThemeProvider } from "../lib/ThemeContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
