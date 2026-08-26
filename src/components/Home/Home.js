import Nav_bar from "../Navbar/Navbar"
import './CSS/home.css'
import BackgroundSlider from "./BackgroundSlider"
import About from "./About"
import Features from "./Features"
import Contact from "./Contact"
import FAQ from "./FAQ"
import UpcomingFeatures from "./Upcoming"
import Team from "./Team"
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher"
import { useTheme } from "../../context/ThemeContext"

const Home = () => {
    const { currentTheme } = useTheme();
    
    return (
        <div className="Home">
            <div className="Home-content">
            <Nav_bar />
            <ThemeSwitcher position="top-right" />
            <BackgroundSlider/>
            <About/>
            <Features/>
            <Team/>
            <FAQ/>
            <UpcomingFeatures/>
            <Contact/>
            </div>
        </div>
    )
}
export default Home