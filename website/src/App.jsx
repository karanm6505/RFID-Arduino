import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import AttendanceLog from './components/AttendanceLog'
import ConnectionPanel from './components/ConnectionPanel'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import './App.css'

function App() {
  const [socket, setSocket] = useState(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [ports, setPorts] = useState([])
  const [connected, setConnected] = useState(false)
  const [activePort, setActivePort] = useState('')
  const [connectionError, setConnectionError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    unique: 0
  })

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io()
    setSocket(newSocket)

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server')
      setConnectionError(null)
      newSocket.emit('getPorts')
    })

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
      setConnectionError('Could not connect to server. Please make sure the server is running.')
    })

    newSocket.on('ports', (availablePorts) => {
      setPorts(availablePorts)
    })

    newSocket.on('serialData', (data) => {
      try {
        // Parse data from Arduino (format: "Name,SRN")
        const parts = data.split(',')
        if (parts.length === 2) {
          const entry = {
            timestamp: new Date(),
            name: parts[0].trim(),
            srn: parts[1].trim()
          }
          
          setAttendanceData(prev => {
            const newData = [...prev, entry]
            // Update stats
            const uniqueSRNs = new Set(newData.map(item => item.srn))
            setStats({
              total: newData.length,
              unique: uniqueSRNs.size
            })
            return newData
          })
        } else {
          console.log('Raw data:', data)
        }
      } catch (error) {
        console.error('Error parsing data:', error)
      }
    })

    newSocket.on('connectionStatus', (status) => {
      setConnected(status.connected)
      if (status.connected) {
        setActivePort(status.port)
      } else {
        setActivePort('')
      }
    })

    newSocket.on('error', (error) => {
      setConnectionError(error.message)
    })

    // Cleanup on unmount
    return () => {
      newSocket.disconnect()
    }
  }, [])

  const handleConnect = (port, baudRate) => {
    if (socket) {
      socket.emit('connectToPort', { port, baudRate })
    }
  }

  const handleDisconnect = () => {
    if (socket) {
      socket.emit('disconnectPort')
    }
  }

  const clearData = () => {
    setAttendanceData([])
    setStats({ total: 0, unique: 0 })
  }

  // Export data as CSV
  const exportData = () => {
    if (attendanceData.length === 0) return

    const headers = ['Name', 'SRN', 'Timestamp']
    const csvData = attendanceData.map(entry => {
      return `"${entry.name}","${entry.srn}","${entry.timestamp.toLocaleString()}"`
    })
    
    const csv = [headers.join(','), ...csvData].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', `attendance_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {connectionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {connectionError}
              <div className="mt-2 text-sm">
                Run <code className="bg-muted px-1 py-0.5 rounded">npm run server</code> in your terminal to start the backend.
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <Dashboard 
              connected={connected} 
              stats={stats} 
              exportData={exportData}
            />
          </div>
          <div>
            <ConnectionPanel 
              ports={ports}
              connected={connected}
              activePort={activePort}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onRefreshPorts={() => socket?.emit('getPorts')}
              error={connectionError}
            />
          </div>
        </div>
        
        <AttendanceLog 
          data={attendanceData} 
          onClear={clearData}
          connected={connected}
        />
      </main>
      
      <footer className="py-4 px-6 border-t bg-card text-muted-foreground text-center text-sm">
        <p>MPCA Project - RFID Attendance System © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
