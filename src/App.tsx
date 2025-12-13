import React from 'react'

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>RedNote Card Generator</h1>
      <p>🎉 Cloudflare Pages 部署成功</p>
      <button
        style={{
          marginTop: 16,
          padding: '10px 16px',
          borderRadius: 8,
          border: 'none',
          background: '#ff2442',
          color: '#fff',
          cursor: 'pointer'
        }}
        onClick={() => alert('Hello Cloudflare!')}
      >
        测试按钮
      </button>
    </div>
  )
}
