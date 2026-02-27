export async function GET() {
  const validationKey = '2a92c128e3b4368165981724641c02d5ee490685d66ebd6a424472a53f18e3dc22babc3b991aabed49387c50e7a6ce97582187448eb02029b9b73441b02837d2'
  
  return new Response(validationKey, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
