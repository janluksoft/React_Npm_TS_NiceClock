import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ClockMub from './MClock';


type xArg = { xinfo: string };

function DApp() {
  return (
    <div>
      <div style={{ padding: "0px 20px", width: "80%", color: "#77623b" }} >
        React elements with TypeScript
      </div>
      <table>
        <tr>
          <td><ClockMub size={240} timeFormat="12hour" hourFormat="roman"/></td>
          <td><ClockMub size={160} timeFormat="12hour" hourFormat="standard"/></td>
          <td><ClockMub size={280} timeFormat="24hour" hourFormat="standard"/></td>
        </tr>
      </table>
    </div>
    );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <DApp />
);
