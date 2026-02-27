const { NFTStorage, File } = require('nft.storage')
require('dotenv').config()

const token = process.env.NFT_STORAGE_API_KEY || '6bae6ed4.d516462347a44ccd891a4aabbd0f40e04'

async function testUpload() {
    const client = new NFTStorage({ token })
    console.log('Attempting test upload to NFT.Storage...')

    try {
        const content = Buffer.from('test content')
        const file = new File([content], 'test.txt', { type: 'text/plain' })

        console.log('Uploading...')
        const metadata = await client.store({
            name: 'Test NFT',
            description: 'Testing if NFT.Storage is still active',
            image: file
        })

        console.log('✅ Upload successful!')
        console.log('CID:', metadata.ipnft)
        console.log('URL:', metadata.url)
    } catch (error) {
        console.error('❌ Upload failed!')
        console.error('Error message:', error.message)

        if (error.message.includes('decommissioned') || error.message.includes('403') || error.message.includes('503')) {
            console.log('\n🚨 IMPORTANT: NFT.Storage "Classic" uploads were decommissioned on June 30, 2024.')
            console.log('You likely need to switch to a different IPFS provider like Pinata or use the new web3.storage (w3up).')
        }
    }
}

testUpload()
