import { useState, useEffect } from 'react'
// import { NFTStorage, File } from 'nft.storage' // Removed as it is decommissioned
import { Buffer } from 'buffer'
import { ethers } from 'ethers'

// Components
import Spinner from 'react-bootstrap/Spinner'
import Navigation from './components/Navigation'
import Auth from './components/Auth'
import Landing from './components/Landing'
import { useAuth } from './components/AuthContext'

// ABIs
import NFT from './abis/NFT.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [url, setURL] = useState(null)

  const [message, setMessage] = useState('')
  const [isWaiting, setIsWaiting] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const { user, loading } = useAuth()

  const loadBlockchainData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)

      const network = await provider.getNetwork()

      if (config[network.chainId]) {
        const nft = new ethers.Contract(
          config[network.chainId].nft.address,
          NFT,
          provider
        )
        setNFT(nft)
      } else {
        window.alert('Network not supported. Please switch to Hardhat (Localhost 8545).')
      }
    } catch (error) {
      console.error('Error loading blockchain data:', error)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!name || !description) {
      window.alert('Please provide a name and description')
      return
    }

    setIsWaiting(true)

    try {
      const imageData = await createImage()
      const url = await uploadImage(imageData)
      await mintImage(url)
    } catch (error) {
      console.error('Error in submitHandler:', error)
      window.alert(error.message)
    }

    setIsWaiting(false)
    setMessage('')
  }

  const createImage = async () => {
    setMessage('Generating Image...')

    const response = await fetch('http://localhost:8000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    })

    if (!response.ok) {
      let errorMsg
      try {
        const err = await response.json()
        errorMsg = err.details || err.error || 'AI generation failed'
      } catch (e) {
        errorMsg = await response.text()
      }
      throw new Error(errorMsg)
    }

    const type = response.headers.get('content-type')
    const data = await response.arrayBuffer()

    const base64data = Buffer.from(data).toString('base64')
    const img = `data:${type};base64,${base64data}`
    setImage(img)

    return data
  }

  const uploadImage = async (imageData) => {
    setMessage('Uploading Image to Pinata...')

    const jwt = process.env.REACT_APP_PINATA_JWT

    if (!jwt) {
      throw new Error(
        'Pinata JWT missing. Check REACT_APP_PINATA_JWT and restart React.'
      )
    }

    // 1. Upload File to IPFS
    const formData = new FormData()
    const file = new File([imageData], 'image.png', { type: 'image/png' })
    formData.append('file', file)

    const pinataRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    })

    if (!pinataRes.ok) {
      throw new Error('Failed to upload image to Pinata')
    }

    const pinataData = await pinataRes.json()
    const imageHash = pinataData.IpfsHash

    // 2. Upload Metadata to IPFS
    const metadata = JSON.stringify({
      pinataContent: {
        name: name,
        description: description,
        image: `ipfs://${imageHash}`,
      },
      pinataMetadata: {
        name: `${name}_metadata.json`,
      },
    })

    const metadataRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: metadata,
    })

    if (!metadataRes.ok) {
      throw new Error('Failed to upload metadata to Pinata')
    }

    const metadataData = await metadataRes.json()
    const url = `https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}`
    setURL(url)

    return url
  }

  const mintImage = async (tokenURI) => {
    setMessage('Waiting for Mint...')

    const signer = await provider.getSigner()
    const tx = await nft
      .connect(signer)
      .mint(tokenURI, { value: ethers.utils.parseUnits('1', 'ether') })

    await tx.wait()
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  if (loading) return <div className="image__placeholder" style={{ minHeight: '100vh', background: '#0f0f1a' }}><Spinner animation="border" /></div>

  if (!user) {
    return showAuth ? (
      <Auth onBack={() => setShowAuth(false)} />
    ) : (
      <Landing onGetStarted={() => setShowAuth(true)} />
    )
  }

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <div className="form">
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Create a name..."
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Create a description..."
            onChange={(e) => setDescription(e.target.value)}
          />
          <input type="submit" value="Create & Mint" />
        </form>

        <div className="image">
          {!isWaiting && image ? (
            <img src={image} alt="AI output" />
          ) : isWaiting ? (
            <div className="image__placeholder">
              <Spinner animation="border" />
              <p>{message}</p>
            </div>
          ) : null}
        </div>
      </div>

      {!isWaiting && url && (
        <p>
          View&nbsp;
          <a href={url} target="_blank" rel="noreferrer">
            Metadata
          </a>
        </p>
      )}
    </div>
  )
}

export default App