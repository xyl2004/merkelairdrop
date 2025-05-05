import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full mt-auto py-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm text-gray-500">
          Built with
          <span className="mx-1">❤️</span>
          using
          <a 
            href="https://wagmi.sh/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-800 mx-1"
          >
            wagmi
          </a>
          and
          <a 
            href="https://www.rainbowkit.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-secondary-600 hover:text-secondary-800 mx-1"
          >
            RainbowKit
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer