export const getOpsToken = async () => {
  if (!process.env.EPO_CONSUMER_KEY || !process.env.EPO_CONSUMER_SECRET) {
    throw new Error('EPO_CONSUMER_KEY or EPO_CONSUMER_SECRET not found')
  }

  const consumerKey = process.env.EPO_CONSUMER_KEY
  const consumerSecret = process.env.EPO_CONSUMER_SECRET
  const creds = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
  const tokenRes = await fetch('https://ops.epo.org/3.2/auth/accesstoken', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!tokenRes.ok) throw new Error('Could not get OPS OAuth token')
  const tokenData = await tokenRes.json()
  const token = tokenData.access_token as string

  return token
}
