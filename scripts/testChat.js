// Simple Node script to test POST to /api/chat using global fetch (Node 18+)
async function run() {
  const url = 'http://localhost:3000/api/chat'
  const body = { message: 'I twisted my ankle, it popped and swelled.' }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const text = await res.text()
    console.log('Status:', res.status)
    console.log('Response:', text)
  } catch (err) {
    console.error('Request failed:', err)
  }
}

run()
