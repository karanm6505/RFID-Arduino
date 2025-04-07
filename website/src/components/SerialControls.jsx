import { useState } from 'react'
import './SerialControls.css'

function SerialControls({ ports, connected, activePort, onConnect, onDisconnect, onRefreshPorts }) {
  const [selectedPort, setSelectedPort] = useState('')
  const [baudRate, setBaudRate] = useState('9600')
  
  const baudRates = ['4800', '9600', '19200', '38400', '57600', '115200']

  const handleConnectClick = () => {
    if (selectedPort) {
      onConnect(selectedPort, parseInt(baudRate, 10))
    }
  }

  return (
    <div className="serial-controls">
      <div className="control-group">
        <label>Port:</label>
        <div className="port-selector">
          <select 
            value={selectedPort} 
            onChange={(e) => setSelectedPort(e.target.value)}
            disabled={connected}
          >
            <option value="">Select a port</option>
            {ports.map(port => (
              <option key={port.path} value={port.path}>
                {port.path} - {port.manufacturer || 'Unknown'}
              </option>
            ))}
          </select>
          <button onClick={onRefreshPorts} className="refresh-btn" disabled={connected}>
            ↻
          </button>
        </div>
      </div>

      <div className="control-group">
        <label>Baud Rate:</label>
        <select 
          value={baudRate} 
          onChange={(e) => setBaudRate(e.target.value)}
          disabled={connected}
        >
          {baudRates.map(rate => (
            <option key={rate} value={rate}>{rate}</option>
          ))}
        </select>
      </div>

      <div className="control-group">
        {!connected ? (
          <button 
            onClick={handleConnectClick} 
            disabled={!selectedPort || connected}
            className="connect-btn"
          >
            Connect
          </button>
        ) : (
          <button 
            onClick={onDisconnect} 
            className="disconnect-btn"
          >
            Disconnect from {activePort}
          </button>
        )}
      </div>
    </div>
  )
}

export default SerialControls
