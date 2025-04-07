import { useEffect, useRef } from 'react'
import './SerialMonitor.css'

function SerialMonitor({ data, onClear, connected }) {
  const monitorRef = useRef(null)

  // Auto-scroll to bottom when new data arrives
  useEffect(() => {
    if (monitorRef.current) {
      monitorRef.current.scrollTop = monitorRef.current.scrollHeight
    }
  }, [data])

  return (
    <div className="serial-monitor-container">
      <div className="monitor-header">
        <h2>Serial Output</h2>
        <div className="monitor-controls">
          <div className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
          <button onClick={onClear} className="clear-btn">Clear</button>
        </div>
      </div>

      <div className="serial-monitor" ref={monitorRef}>
        {data.length === 0 ? (
          <div className="no-data">No data received yet</div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="serial-line">
              <span className="timestamp">[{item.timestamp}]</span>
              <span className="message">{item.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SerialMonitor
