import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, GithubIcon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
          <h1 className="text-xl font-medium m-0">RFID Attendance System</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-primary-foreground"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost" size="icon" asChild className="text-primary-foreground">
            <a href="https://github.com/karanm6505/RFID-Arduino" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
