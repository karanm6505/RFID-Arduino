import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UsersIcon, ClipboardCheckIcon, CirclePowerIcon, Download } from "lucide-react"

function Dashboard({ connected, stats, exportData }) {
  const formattedDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Attendance Dashboard</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="flex flex-row items-center pt-6">
              <div className="p-2 rounded-full bg-primary/10 mr-4">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.unique}</p>
                <p className="text-xs text-muted-foreground">Unique Students</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-row items-center pt-6">
              <div className="p-2 rounded-full bg-primary/10 mr-4">
                <ClipboardCheckIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Check-ins</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-row items-center pt-6">
              <div className="p-2 rounded-full bg-primary/10 mr-4">
                <CirclePowerIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <p className={`text-sm font-medium ${connected ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                  {connected ? 'Connected' : 'Disconnected'}
                </p>
                <p className="text-xs text-muted-foreground">System Status</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Button 
          onClick={exportData}
          disabled={stats.total === 0}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Attendance Data
        </Button>
      </CardContent>
    </Card>
  )
}

export default Dashboard
