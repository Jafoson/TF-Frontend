import React from 'react'
import Image from 'next/image'

function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Hallo wenn du das liest, dann ist alles gut</h1>
      <div style={{ marginTop: '2rem' }}>
        <h2>Static Assets Test:</h2>
        <div style={{ marginTop: '1rem' }}>
          <h3>Logo Test:</h3>
          <Image
            src="/logo/tf_logo_light.svg"
            alt="Tournament Fox Logo"
            width={200}
            height={100}
            style={{ marginTop: '1rem' }}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h3>Background Image Test:</h3>
          <div 
            style={{
              width: '300px',
              height: '200px',
              backgroundImage: 'url(/background/LeagueofLegends_Worlds2022_ChaseCenter_California_Stage-1536x864.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid #ccc',
              marginTop: '1rem'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage