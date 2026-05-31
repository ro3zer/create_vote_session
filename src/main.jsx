import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AbstractWalletProvider } from '@abstract-foundation/agw-react'
import { abstract } from 'viem/chains' // 🔥 이더리움 체인 정보 불러오기 추가

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 🔥 chain={abstract} 속성을 추가해서 메인넷임을 알려줌 */}
    <AbstractWalletProvider chain={abstract}> 
      <App />
    </AbstractWalletProvider>
  </React.StrictMode>,
)