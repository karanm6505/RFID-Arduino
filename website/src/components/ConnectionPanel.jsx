import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCcwIcon, UsbIcon } from "lucide-react"

function ConnectionPanel({ ports, connected, activePort, onConnect, onDisconnect, onRefreshPorts }) {
  const [selectedPort, setSelectedPort] = useState('/dev/cu.usbserial-1110')
  const [baudRate, setBaudRate] = useState('9600')
  const targetPort = '/dev/cu.usbserial-1110'
  
  const baudRates = ['4800', '9600', '19200', '38400', '57600', '115200']
  
  // Auto-select the specified port when ports list is updated
  useEffect(() => {
    if (ports.some(port => port.path === targetPort)) {
      setSelectedPort(targetPort)
    }
  }, [ports])

  // Auto-connect to the specified port when component loads
  useEffect(() => {
    if (selectedPort === targetPort && !connected) {
      handleConnectClick()
    }
  }, [selectedPort, connected])

  const handleConnectClick = () => {
    if (selectedPort) {
      onConnect(selectedPort, parseInt(baudRate, 10))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Connection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="port">RFID Reader Port</Label>
          <div className="flex space-x-2">
            <Select
              value={selectedPort}
              onValueChange={setSelectedPort}
              disabled={connected}
            >
              <SelectTrigger id="port" className="flex-1">
                <SelectValue placeholder="Select a port" />
              </SelectTrigger>
              <SelectContent>
                {ports.map(port => (
                  <SelectItem key={port.path} value={port.path}>
                    {port.path} {port.manufacturer ? `(${port.manufacturer})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onRefreshPorts}
              disabled={connected}
              title="Refresh ports list"
            >
              <RefreshCcwIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="baudRate">Communication Speed</Label>
          <Select
            value={baudRate}
            onValueChange={setBaudRate}
            disabled={connected}
          >
            <SelectTrigger id="baudRate">
              <SelectValue placeholder="Select baud rate" />
            </SelectTrigger>
            <SelectContent>
              {baudRates.map(rate => (
                <SelectItem key={rate} value={rate}>{rate} baud</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!connected ? (
          <Button 
            onClick={handleConnectClick} 
            disabled={!selectedPort || connected}
            className="w-full"
            variant="success"
          >
            <UsbIcon className="mr-2 h-4 w-4" />
            Connect Device
          </Button>
        ) : (
          <Button 
            onClick={onDisconnect} 
            className="w-full"
            variant="destructive"
          >
            Disconnect
            <span className="ml-2 text-xs opacity-80">{activePort}</span>
          </Button>
        )}
      </CardContent>

      <CardFooter className="bg-muted/50 flex flex-col items-start px-6 py-4 text-sm text-muted-foreground">
        <h3 className="font-medium text-foreground mb-2">Connection Help</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Connect the Arduino with the RFID reader to your computer</li>
          <li>Select the correct port from the dropdown (usually {targetPort})</li>
          <li>Click Connect to start receiving attendance data</li>
        </ul>
      </CardFooter>
    </Card>
  )
}

export default ConnectionPanel
