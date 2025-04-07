import { useEffect, useRef } from 'react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, RotateCcw, ClipboardList } from "lucide-react"

function AttendanceLog({ data, onClear, connected }) {
  const logRef = useRef(null)

  // Auto-scroll to bottom when new data arrives
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [data])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xl">Attendance Log</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={connected ? "success" : "destructive"} className="px-2 py-1">
            {connected ? 'Receiving Data' : 'Not Connected'}
          </Badge>
          <Button 
            onClick={onClear} 
            disabled={data.length === 0}
            variant="ghost"
            size="sm"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>

      {data.length === 0 ? (
        <CardContent className="h-[400px] flex flex-col items-center justify-center text-center text-muted-foreground">
          <ClipboardList className="h-16 w-16 mb-4 text-muted" />
          <p className="text-lg font-medium">No attendance data recorded yet</p>
          <p className="text-sm max-w-md mt-1">
            When students scan their RFID cards, their attendance will appear here
          </p>
        </CardContent>
      ) : (
        <CardContent className="p-0">
          <div className="h-[400px] overflow-auto" ref={logRef}>
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="sticky top-0 bg-card p-3 text-xs font-medium text-muted-foreground">Time</th>
                  <th className="sticky top-0 bg-card p-3 text-xs font-medium text-muted-foreground">Student Name</th>
                  <th className="sticky top-0 bg-card p-3 text-xs font-medium text-muted-foreground">Student ID</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-3 text-sm text-muted-foreground">
                      {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 text-sm font-medium">{entry.name}</td>
                    <td className="p-3 text-sm font-mono text-primary">{entry.srn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default AttendanceLog
